import assert from "node:assert/strict";
import test from "node:test";
import { createLicenceRequestPost, LICENCE_PERSONNUMMER_ERROR, normalizeLicencePersonnummer } from "../src/lib/licencePersonnummer.core.ts";

const now = new Date("2026-10-08T12:00:00Z");
const full = (prefix: string) => {
  const total = [...prefix.slice(2)].reduce((sum, digit, index) => { const weighted = Number(digit) * (index % 2 === 0 ? 2 : 1); return sum + (weighted > 9 ? weighted - 9 : weighted); }, 0);
  return prefix + String((10 - total % 10) % 10);
};
const synthetic = full("19900101001");
const request = (body: unknown) => new Request("https://thebeach.one/api/account/competition-licence", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const safeRequest = { id: 1, membership_type: "Senior 2026", membership_year: 2026, status: "pending", created_at: "2026-10-08T12:00:00Z" };
function harness({ token = "private-bearer", origin = true, status = 201, payload = { request: safeRequest } as unknown } = {}) {
  const calls: { path: string; body: unknown; token: string | undefined }[] = [];
  const post = createLicenceRequestPost({ accountToken: async () => token || null, sameOrigin: () => origin,
    appApi: async (path, init, options) => { calls.push({ path, body: JSON.parse(String(init?.body)), token: options?.token }); return Response.json(payload, { status }); } });
  return { post, calls };
}

test("full compact/canonical personnummer normalizes to twelve ASCII digits", () => {
  assert.equal(normalizeLicencePersonnummer(synthetic, now), synthetic);
  assert.equal(normalizeLicencePersonnummer(`  ${synthetic.slice(0, 8)}-${synthetic.slice(8)}  `, now), synthetic);
  assert.equal(normalizeLicencePersonnummer(full("20000229001"), now), full("20000229001"));
});
test("century, real date, nonfuture date and Luhn are mandatory without profile birthday matching", () => {
  for (const value of [null, 12, "", synthetic.slice(2), synthetic.replace(/0/g, "０"), synthetic.slice(0, 8) + "+" + synthetic.slice(8), full("19900230001"), full("19000229001"), full("20990101001"), synthetic.slice(0, 11) + String((Number(synthetic.at(-1)) + 1) % 10), full("19900001001"), full("19900100001")]) {
    assert.equal(normalizeLicencePersonnummer(value, now), null);
  }
  assert.equal(normalizeLicencePersonnummer(full("18991231001"), now), full("18991231001"));
});
test("origin and HttpOnly-session denial precede upstream or private input handling", async () => {
  for (const [config, status] of [[{ origin: false }, 403], [{ token: "" }, 401]] as const) {
    const { post, calls } = harness(config);
    const response = await post(request({ personnummer: synthetic, idempotencyKey: "retry-key-12345" }));
    assert.equal(response.status, status); assert.equal(calls.length, 0);
    assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  }
});
test("missing, malformed and checksum-invalid private input never reaches backend", async () => {
  for (const personnummer of [undefined, "", synthetic.slice(2), synthetic.slice(0, 11) + "x"]) {
    const { post, calls } = harness();
    const response = await post(request({ idempotencyKey: "retry-key-12345", personnummer }));
    assert.equal(response.status, 422); assert.deepEqual(await response.json(), { detail: LICENCE_PERSONNUMMER_ERROR }); assert.equal(calls.length, 0);
  }
});
test("only normalized private number and original retry key go upstream, never caller identity/year/DOB", async () => {
  const { post, calls } = harness();
  const response = await post(request({ idempotencyKey: "retry-key-12345", personnummer: ` ${synthetic.slice(0, 8)}-${synthetic.slice(8)} `, userId: "another", membershipYear: 2027, birthdate: "1980-03-04", auth_token: "attacker" }));
  assert.equal(response.status, 201);
  assert.deepEqual(calls, [{ path: "/competition-licence/requests", body: { idempotency_key: "retry-key-12345", personnummer: synthetic }, token: "private-bearer" }]);
  assert.deepEqual(await response.json(), { request: { ...safeRequest, status_note: null } });
});
test("upstream validation input and arbitrary errors never echo private values", async () => {
  for (const status of [401, 403, 409, 422, 500]) {
    const { post } = harness({ status, payload: { detail: [{ input: synthetic, msg: `invalid ${synthetic}`, ctx: { secret: synthetic } }], auth_token: "secret" } });
    const response = await post(request({ idempotencyKey: "retry-key-12345", personnummer: synthetic }));
    assert.equal(response.status, status);
    const text = await response.text(); assert.ok(!text.includes(synthetic)); assert.ok(!text.includes("secret"));
  }
});
test("customer success DTO excludes staff number/unknown fields and scrubs public-note input echoes", async () => {
  const { post } = harness({ payload: { request: { ...safeRequest, personnummer: synthetic, personnummer_record: { raw: synthetic }, status_note: `note ${synthetic}`, unknown: synthetic }, personnummer: synthetic } });
  const response = await post(request({ idempotencyKey: "retry-key-12345", personnummer: synthetic }));
  const text = await response.text(); assert.ok(!text.includes(synthetic)); assert.ok(!text.includes("personnummer"));
  assert.ok(text.includes("uppgift utelämnad"));
});
test("repeated requests keep the exact original retry key and valid number", async () => {
  const { post, calls } = harness();
  for (let index = 0; index < 2; index++) assert.equal((await post(request({ idempotencyKey: "retry-key-12345", personnummer: synthetic }))).status, 201);
  assert.deepEqual(calls[0], calls[1]);
});
