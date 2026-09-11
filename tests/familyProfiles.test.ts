import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { familyChildRequest, familyIdempotencyKey, familyPlayerId, familyFailure } from "../src/lib/familyProfiles.core.ts";
import { accountContextFingerprint, accountContextMatches, clearUnscopedAccountStorage } from "../src/lib/accountContext.core.ts";

const child = {
  first_name: "Test", last_name: "Barn", birthdate: "2015-06-01", gender: "W",
  parental_responsibility_confirmed: true, expected_contact_email: "parent@example.test",
};

test("child creation forwards only child fields and stale-contact assertion, never caller authority", () => {
  assert.deepEqual(familyChildRequest({ ...child, email: "attacker@example.test", actor_player_id: 999,
    parent_player_id: 999, player_id: 99, is_public: true, relationship: "self" }), child);
});

test("child create requires explicit parent/contact confirmation and valid payload types", () => {
  for (const invalid of [null, [], { ...child, parental_responsibility_confirmed: false },
    { ...child, expected_contact_email: null }, { ...child, gender: "other" },
    { ...child, first_name: 123 }, { ...child, birthdate: "yesterday" }]) {
    assert.equal(familyChildRequest(invalid), null);
  }
});

test("family operations accept a canonical numeric BeachID and UUID retry key only", () => {
  assert.equal(familyPlayerId(123), 123);
  for (const value of ["123", -1, 0, 1.5, Number.MAX_SAFE_INTEGER + 1, null]) assert.equal(familyPlayerId(value), null);
  assert.equal(familyIdempotencyKey("791b3920-f889-467f-95ec-616d326e4823"), true);
  assert.equal(familyIdempotencyKey(null), false);
  assert.equal(familyIdempotencyKey("same-email"), false);
});

test("structured backend family errors retain the specific message and safe code, not credentials", () => {
  assert.deepEqual(familyFailure({ detail: { code: "FAMILY_CONTACT_CHANGED", message: "Bekräfta den nya kontakten" }, auth_token: "secret" }, "Error"), {
    detail: "Bekräfta den nya kontakten", code: "FAMILY_CONTACT_CHANGED",
  });
  assert.deepEqual(familyFailure({ detail: "Try again" }, "Error"), { detail: "Try again" });
});

test("context fingerprints cannot be used as bearer credentials and reject stale tabs", async () => {
  const parent = await accountContextFingerprint("synthetic-parent-token");
  const childContext = await accountContextFingerprint("synthetic-child-token");
  assert.match(parent, /^[a-f0-9]{64}$/);
  assert.notEqual(parent, "synthetic-parent-token");
  assert.notEqual(parent, childContext);
  assert.equal(await accountContextFingerprint(null), "anonymous");
  assert.equal(accountContextMatches(parent, parent), true);
  assert.equal(accountContextMatches(parent, childContext), false);
  assert.equal(accountContextMatches("anonymous", childContext), false);
  assert.equal(accountContextMatches(null, parent), true, "legacy clients stay compatible");
});

test("switch cleanup removes unscoped course state but preserves identity-scoped payment retry keys and consent", () => {
  const items = new Map([
    ["tb_course_attempt_12", "attempt"], ["tb_course_invoice_12", "old-private-invoice"],
    ["tb-membership-purchase:parent-uuid:2026:12", "pending-idempotency-key"],
    ["tb-competition-licence:parent-uuid:2026", "pending-idempotency-key"], ["cookie_consent", "granted"],
  ]);
  clearUnscopedAccountStorage({ get length() { return items.size; }, key(index) { return [...items.keys()][index] ?? null; }, removeItem(key) { items.delete(key); } });
  assert.equal(items.has("tb_course_attempt_12"), false);
  assert.equal(items.has("tb_course_invoice_12"), false);
  assert.equal(items.size, 3);
});

test("session reads and TV handoffs cannot restore or clear cookies after switching", () => {
  for (const path of ["../src/app/api/account/session/route.ts", "../src/app/api/account/tv-handoff/route.ts"]) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(source, /setAccountSession|clearAccountSession|cookies\.set/);
  }
});

test("all private client surfaces use the shared cancellation/context boundary", () => {
  for (const path of ["account/AccountPortal", "booking/BookingWidget", "trana/CourseEnrolButton",
    "trana/CoursePaymentReturn", "anmalan/SignupFormClient", "payments/StripeReturnPanel"]) {
    const source = readFileSync(new URL(`../src/components/${path}.tsx`, import.meta.url), "utf8");
    assert.match(source, /accountFetch as fetch/);
  }
  const source = readFileSync(new URL("../src/components/account/AccountContextBoundary.tsx", import.meta.url), "utf8");
  assert.match(source, /phase === "changing" \|\| phase === "changed"/);
});

test("family BFF checks origin and bearer, switches using BeachID, and never proxies auth tokens to JS", () => {
  const create = readFileSync(new URL("../src/app/api/account/family/children/route.ts", import.meta.url), "utf8");
  assert.match(create, /sameOrigin\(request\)/);
  assert.match(create, /accountToken\(\)/);
  assert.match(create, /familyChildRequest/);
  const source = readFileSync(new URL("../src/app/api/account/family/switch/route.ts", import.meta.url), "utf8");
  assert.match(source, /sameOrigin\(request\)/);
  assert.match(source, /familyPlayerId/);
  assert.match(source, /setAccountSession\(response, payload.auth_token\)/);
  assert.doesNotMatch(source, /json\(payload|proxyAppJson/);
});
