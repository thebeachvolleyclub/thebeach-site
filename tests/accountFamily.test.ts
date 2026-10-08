import assert from "node:assert/strict";
import test from "node:test";
import {
  bindAccountDrafts, createFamilyChildPost, createFamilyInboxVerifyPost,
  createFamilySwitchPost, leaveAccountDrafts, reloadAccountDocument, type FamilySwitchRecovery,
} from "../src/lib/accountFamily.core.ts";

const original = "a".repeat(64), result = "b".repeat(64);
const key = "family-request-0001";
const request = (body: unknown) => new Request("https://thebeach.one/api/account/family/switch", { method: "POST", body: JSON.stringify(body) });
function harness({ token = original, origin = true, recovery = null, replies = [] }: {
  token?: string | null; origin?: boolean; recovery?: FamilySwitchRecovery | null; replies?: Response[];
} = {}) {
  const calls: { path: string; body: unknown; headers: Headers; token?: string; deviceId?: string }[] = [];
  const installed: { token: string; recovery?: FamilySwitchRecovery }[] = [];
  const deps = {
    accountToken: async () => token,
    accountDeviceId: async () => "web-fixture-installation",
    sameOrigin: () => origin,
    appApi: async (path: string, init?: RequestInit, options?: { token?: string; deviceId?: string }) => {
      calls.push({ path, body: init?.body ? JSON.parse(String(init.body)) : undefined, headers: new Headers(init?.headers), ...options });
      const reply = replies.shift();
      assert.ok(reply, `unexpected upstream call ${path}`);
      return reply;
    },
    recovery: async () => recovery,
    install: (token: string, recovery?: FamilySwitchRecovery) => {
      installed.push({ token, recovery }); return Response.json({ authenticated: true });
    },
  };
  return { deps, calls, installed };
}
const session = (playerId = 10) => Response.json({ success: true, auth_token: result, user: { id: "account-10", canonical_player_id: playerId } });

test("family mutations deny anonymous and cross-origin calls before contacting App API", async () => {
  for (const factory of [createFamilySwitchPost, createFamilyChildPost, createFamilyInboxVerifyPost]) {
    for (const [options, status] of [[{ token: null }, 401], [{ origin: false }, 403]] as const) {
      const { deps, calls } = harness(options);
      assert.equal((await factory(deps)(request({}))).status, status);
      assert.equal(calls.length, 0);
    }
  }
});

test("switch uses an exact positive BeachID, session and idempotency key, never browser actor/guardian claims", async () => {
  const { deps, calls, installed } = harness({ replies: [session()] });
  const response = await createFamilySwitchPost(deps)(request({ playerId: 10, idempotencyKey: key, user_id: "victim", guardian: true, auth_token: "spoof" }));
  assert.deepEqual(await response.json(), { authenticated: true });
  assert.deepEqual(calls[0].body, { player_id: 10 });
  assert.equal(calls[0].token, original);
  assert.equal(calls[0].deviceId, "web-fixture-installation");
  assert.equal(calls[0].headers.get("Idempotency-Key"), key);
  assert.deepEqual(installed, [{ token: result, recovery: { sourceToken: original, resultToken: result, requestKey: key, playerId: 10 } }]);
});

test("switch rejects names, UUIDs, string IDs, invalid numbers and absent replay keys", async () => {
  for (const playerId of ["10", "Alice", "00000000-0000-4000-8000-000000000001", 0, -10, 1.1, null]) {
    const { deps, calls } = harness();
    assert.equal((await createFamilySwitchPost(deps)(request({ playerId, idempotencyKey: key }))).status, 422);
    assert.equal(calls.length, 0);
  }
  const { deps, calls } = harness();
  assert.equal((await createFamilySwitchPost(deps)(request({ playerId: 10 }))).status, 422);
  assert.equal(calls.length, 0);
});

test("lost body after Set-Cookie recovers only the exact original switch, not a different request or account", async () => {
  const receipt = { sourceToken: original, resultToken: result, requestKey: key, playerId: 10 };
  for (const [token, target, idempotencyKey, expectedToken] of [
    [result, 10, key, original], [result, 11, key, result], [result, 10, "another-request-key", result], ["c".repeat(64), 10, key, "c".repeat(64)],
  ] as const) {
    const { deps, calls } = harness({ token, recovery: receipt, replies: [session(target)] });
    assert.equal((await createFamilySwitchPost(deps)(request({ playerId: target, idempotencyKey }))).status, 200);
    assert.equal(calls[0].token, expectedToken);
  }
});

test("retired, unrelated and stale permissions remain denied; no token from an error reaches browser", async () => {
  for (const status of [401, 403, 409]) {
    const { deps, installed } = harness({ replies: [Response.json({ detail: { message: "Not allowed", code: "FAMILY_ACCESS_DENIED" }, auth_token: original }, { status })] });
    const response = await createFamilySwitchPost(deps)(request({ playerId: 10, idempotencyKey: key }));
    assert.equal(response.status, status);
    assert.deepEqual(await response.json(), { detail: "Not allowed", code: "FAMILY_ACCESS_DENIED" });
    assert.equal(installed.length, 0);
  }
});

test("a wrong-person or missing-token switch result cannot install a session", async () => {
  for (const reply of [session(11), Response.json({ success: true, user: { id: "account-10", canonical_player_id: 10 } })]) {
    const { deps, installed } = harness({ replies: [reply] });
    assert.equal((await createFamilySwitchPost(deps)(request({ playerId: 10, idempotencyKey: key }))).status, 502);
    assert.equal(installed.length, 0);
  }
});

test("child creation whitelists existing API fields and retains the exact replay key", async () => {
  const child = { player_id: 12, name: "Child Example", is_public: false };
  const { deps, calls } = harness({ replies: [Response.json({ child, idempotent_replay: true }, { status: 201 })] });
  const body = { first_name: "Child", last_name: "Example", birthdate: "2016-01-01", gender: "W", parental_responsibility_confirmed: true, expected_contact_email: "parent@example.com" };
  const response = await createFamilyChildPost(deps)(request({ ...body, idempotencyKey: key, actor_player_id: 999, is_public: true, paid_membership: true }));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { child, idempotent_replay: true });
  assert.deepEqual(calls[0].body, body);
  assert.equal(calls[0].token, original);
  assert.equal(calls[0].headers.get("Idempotency-Key"), key);
});

test("changed contact, duplicate child, guardian denial and field validation preserve upstream status", async () => {
  for (const status of [403, 409, 422]) {
    const { deps } = harness({ replies: [Response.json({ detail: { code: "FAMILY_CONTACT_CHANGED", message: "Confirm contact again" } }, { status })] });
    const response = await createFamilyChildPost(deps)(request({ idempotencyKey: key }));
    assert.equal(response.status, status);
    assert.equal((await response.json()).code, "FAMILY_CONTACT_CHANGED");
  }
});

const family = () => Response.json({ current_player_id: 10, contact_email: " Parent@example.com " });
test("legacy inbox verification selects the exact current BeachID and keeps challenge and tokens server-side", async () => {
  const { deps, calls, installed } = harness({ replies: [family(), Response.json({ success: true, identity_challenge: "private-challenge", family_users: [{ player_id: 11 }, { player_id: 10 }] }), session(), Response.json({ success: true })] });
  const response = await createFamilyInboxVerifyPost(deps)(request({ code: "123456", email: "attacker@example.com", playerId: 11 }));
  assert.deepEqual(await response.json(), { authenticated: true });
  assert.deepEqual(calls[1].body, { email: "parent@example.com", code: "123456" });
  assert.deepEqual(calls[2].body, { challenge: "private-challenge", player_id: 10 });
  assert.equal(calls[2].headers.get("X-Identity-Flow"), "beachid-v2");
  assert.equal(calls[3].path, "/matchmaking/auth/revoke-token");
  assert.equal(calls[3].token, original);
  assert.equal(installed[0].token, result);
});

test("wrong code retains the current session and cannot revoke/install credentials", async () => {
  const { deps, calls, installed } = harness({ replies: [family(), Response.json({ detail: "Wrong code" }, { status: 401 })] });
  assert.equal((await createFamilyInboxVerifyPost(deps)(request({ code: "111111" }))).status, 401);
  assert.equal(installed.length, 0); assert.equal(calls.length, 2);
});

test("inbox proof rejects a chooser omitting current BeachID and a direct session for someone else", async () => {
  for (const reply of [Response.json({ success: true, identity_challenge: "private", family_users: [{ player_id: 11 }, { player_id: 12 }] }), session(11)]) {
    const { deps, calls, installed } = harness({ replies: [family(), reply] });
    assert.equal((await createFamilyInboxVerifyPost(deps)(request({ code: "123456" }))).status, 403);
    assert.equal(calls.length, 2); assert.equal(installed.length, 0);
  }
});

function storage() {
  const entries = new Map<string, string>();
  return { get length() { return entries.size; }, key: (index: number) => [...entries.keys()][index] ?? null,
    getItem: (key: string) => entries.get(key) ?? null, setItem: (key: string, value: string) => { entries.set(key, value); }, removeItem: (key: string) => { entries.delete(key); } };
}

test("switching isolates legacy person drafts while preserving parent retry keys for return", () => {
  const state = storage(); bindAccountDrafts(state, "parent");
  state.setItem("tb_course_attempt_1", "original-course-retry");
  state.setItem("tb-competition-licence:2026", "original-license-retry");
  state.setItem("tb-membership-purchase:parent:2027:1", "owner-scoped-payment");
  state.setItem("cookie-consent", "granted");
  leaveAccountDrafts(state); bindAccountDrafts(state, "child");
  assert.equal(state.getItem("tb_course_attempt_1"), null);
  assert.equal(state.getItem("tb-competition-licence:2026"), null);
  assert.equal(state.getItem("tb-membership-purchase:parent:2027:1"), "owner-scoped-payment");
  assert.equal(state.getItem("cookie-consent"), "granted");
  state.setItem("tb_course_attempt_2", "child-retry");
  leaveAccountDrafts(state); bindAccountDrafts(state, "parent");
  assert.equal(state.getItem("tb_course_attempt_1"), "original-course-retry");
  assert.equal(state.getItem("tb-competition-licence:2026"), "original-license-retry");
  assert.equal(state.getItem("tb_course_attempt_2"), null);
  bindAccountDrafts(state, "parent");
  assert.equal(state.getItem("tb_course_attempt_1"), "original-course-retry");
});

test("unknown legacy drafts are retained privately but never attributed to the next person", () => {
  const state = storage(); state.setItem("tb_course_invoice_1", "legacy-receipt");
  bindAccountDrafts(state, "new-child");
  assert.equal(state.getItem("tb_course_invoice_1"), null);
  assert.equal(state.getItem("tb-account-draft:legacy-unassigned:tb_course_invoice_1"), "legacy-receipt");
});

test("account boundary forces a document reload even when the account hash is unchanged", () => {
  const calls: unknown[][] = [];
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    history: { replaceState: (...args: unknown[]) => calls.push(["history", ...args]) },
    location: { reload: () => calls.push(["reload"]) },
  } });
  try {
    reloadAccountDocument(true); reloadAccountDocument();
    assert.deepEqual(calls, [["history", null, "", "/konto#familj"], ["reload"], ["history", null, "", "/konto"], ["reload"]]);
  } finally { Reflect.deleteProperty(globalThis, "window"); }
});
