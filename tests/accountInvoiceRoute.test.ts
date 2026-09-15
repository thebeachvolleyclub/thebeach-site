import assert from "node:assert/strict";
import test from "node:test";
import { createInvoiceEmailRequestPost } from "../src/lib/accountInvoiceRoute.core.ts";
import { validInvoiceId } from "../src/lib/coursePayment.core.ts";

const invoiceId = "10000000-0000-4000-8000-000000000001";
const url = `https://thebeach.one/api/account/invoices/${invoiceId}/email/request`;

function harness({ token = "owner-token", sameOrigin = true, response = Response.json({ traditional_requested: true, traditional_fee_sek: 150, amount_due_sek: 4150 }) }: { token?: string | null; sameOrigin?: boolean; response?: Response } = {}) {
  const calls: { path: string; init?: RequestInit; options?: { token?: string } }[] = [];
  const post = createInvoiceEmailRequestPost({
    accountToken: async () => token,
    sameOrigin: () => sameOrigin,
    unauthorized: () => Response.json({ detail: "Logga in" }, { status: 401 }),
    validInvoiceId,
    appApi: async (path, init, options) => { calls.push({ path, init, options }); return response; },
    proxyAppJson: async (value) => value,
  });
  return { post, calls };
}

test("email invoice request requires same-origin and authenticated owner before reaching backend", async () => {
  for (const [options, status] of [[{ token: null }, 401], [{ sameOrigin: false }, 403]] as const) {
    const { post, calls } = harness(options);
    assert.equal((await post(new Request(url, { method: "POST" }), { params: Promise.resolve({ invoiceId }) })).status, status);
    assert.equal(calls.length, 0);
  }
});

test("email invoice request rejects invalid ids without a backend request", async () => {
  const { post, calls } = harness();
  assert.equal((await post(new Request(url, { method: "POST" }), { params: Promise.resolve({ invoiceId: "../someone-else" }) })).status, 400);
  assert.equal(calls.length, 0);
});

test("email invoice request forwards only signed session, never client identity, amount or fee", async () => {
  const { post, calls } = harness();
  const response = await post(new Request(url, { method: "POST", body: JSON.stringify({ user_id: "victim", amount_sek: 0, traditional_fee_sek: 0 }) }), { params: Promise.resolve({ invoiceId }) });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { traditional_requested: true, traditional_fee_sek: 150, amount_due_sek: 4150 });
  assert.deepEqual(calls, [{ path: `/training/invoices/${invoiceId}/request-traditional`, init: { method: "POST" }, options: { token: "owner-token" } }]);
});

test("backend invoice ownership and conflict errors retain their actual status", async () => {
  for (const status of [403, 404, 409]) {
    const { post } = harness({ response: Response.json({ detail: "Kan inte begära fakturan" }, { status }) });
    const response = await post(new Request(url, { method: "POST" }), { params: Promise.resolve({ invoiceId }) });
    assert.equal(response.status, status);
    assert.equal((await response.json()).detail, "Kan inte begära fakturan");
  }
});
