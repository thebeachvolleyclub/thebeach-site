import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

type Call = { path: string; init?: RequestInit; options?: { token?: string } };

function routeHarness(file: string, options: { token?: string | null; sameOrigin?: boolean; status?: number; payload?: unknown } = {}) {
  const calls: Call[] = [];
  const exported: Record<string, (...args: unknown[]) => Promise<Response>> = {};
  const source = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mocks: Record<string, unknown> = {
    "next/server": { NextResponse: Response },
    "@/lib/accountSession": {
      accountToken: async () => options.token === undefined ? "owner-session" : options.token,
      sameOrigin: () => options.sameOrigin !== false,
      unauthorized: () => Response.json({ detail: "Logga in" }, { status: 401 }),
    },
    "@/lib/appApi": {
      appApi: async (path: string, init?: RequestInit, config?: { token?: string }) => { calls.push(structuredClone({ path, init, options: config })); return Response.json(options.payload ?? { bookingId: "owned-booking", status: "CONFIRMED" }, { status: options.status ?? 200 }); },
      proxyAppJson: async (response: Response) => response,
    },
    "@/lib/bookingApi": { bookingPublicEnabled: true, proxyJson: async (response: Response) => response },
    "@/lib/coursePaymentRoute.core": { courseStripeCheckoutUrl: (payload: { checkoutUrl?: string }) => payload.checkoutUrl },
    "@/lib/accountSubscription.core": { validSubscriptionId: (id: string) => /^[A-Za-z0-9_-]{1,25}$/.test(id) },
  };
  vm.runInNewContext(source, { exports: exported, require: (name: string) => {
    if (!(name in mocks)) throw new Error(`Unexpected import ${name}`);
    return mocks[name];
  }, Response, Request });
  return { handlers: exported, calls };
}

const creditPath = "src/app/api/account/subscriptions/credits/route.ts";
const releasePath = "src/app/api/account/subscriptions/occurrences/[occurrenceId]/release/route.ts";
const checkoutPath = "src/app/api/booking/checkout/route.ts";
const quotePath = "src/app/api/booking/quotes/route.ts";
const post = (payload: unknown) => new Request("https://thebeach.one/api/booking/checkout", { method: "POST", body: JSON.stringify(payload) });

test("credit balance is private, authenticated and exclusively owner-scoped", async () => {
  for (const token of [null, "owner-session"]) {
    const { handlers, calls } = routeHarness(creditPath, { token });
    const response = await handlers.GET();
    assert.equal(response.status, token ? 200 : 401);
    assert.equal(response.headers.get("Cache-Control"), "private, no-store");
    assert.equal(calls.length, token ? 1 : 0);
    if (token) assert.deepEqual(calls[0], { path: "/booking/subscriptions/credits/mine", init: undefined, options: { token } });
  }
});

test("release requires same-origin and session, and ignores caller-supplied identity", async () => {
  for (const [options, status] of [[{ token: null }, 401], [{ sameOrigin: false }, 403], [{}, 200]] as const) {
    const { handlers, calls } = routeHarness(releasePath, options);
    const response = await handlers.POST(post({ playerId: "someone-else", creditOre: 99999 }), { params: Promise.resolve({ occurrenceId: "occ-1" }) });
    assert.equal(response.status, status);
    assert.equal(calls.length, status === 200 ? 1 : 0);
    if (calls.length) assert.deepEqual(calls[0], { path: "/booking/subscriptions/occurrences/occ-1/release", init: { method: "POST" }, options: { token: "owner-session" } });
  }
});

test("checkout whitelists credit choice and expected split, never price or account identity", async () => {
  const { handlers, calls } = routeHarness(checkoutPath, { payload: { bookingId: "owned-booking", status: "CONFIRMED", managementToken: "server-secret" } });
  const response = await handlers.POST(post({ venueId: "beach", useStoredValue: true, paymentProvider: "STRIPE", expectedStoredValueAppliedOre: 70200, expectedRemainingAmountOre: 7800, customerId: "victim", priceSek: 0, managementToken: "leak" }));
  assert.equal(response.status, 200); // Full credit requires no Stripe redirect.
  const sent = JSON.parse(String(calls[0].init?.body));
  assert.deepEqual(sent, { venueId: "beach", streamRequested: false, useStoredValue: true, expectedStoredValueAppliedOre: 70200, expectedRemainingAmountOre: 7800, paymentProvider: "STRIPE", channel: "WEB" });
  assert.deepEqual(calls[0].options, { token: "owner-session" });
  assert.equal((await response.json()).managementToken, undefined);
});

test("quote and checkout enforce session, origin and object bodies before upstream calls", async () => {
  for (const path of [checkoutPath, quotePath]) {
    for (const [options, payload, expected] of [[{ token: null }, {}, 401], [{ sameOrigin: false }, {}, 403], [{}, null, 400], [{}, [], 400]] as const) {
      const { handlers, calls } = routeHarness(path, options);
      assert.equal((await handlers.POST(post(payload))).status, expected);
      assert.equal(calls.length, 0);
    }
  }
});

test("ordinary payment remains the default and quote never accepts client amount authority", async () => {
  for (const path of [checkoutPath, quotePath]) {
    const { handlers, calls } = routeHarness(path);
    await handlers.POST(post({ venueId: "beach", useStoredValue: "true", paymentProvider: "OTHER", storedValueAppliedOre: 1000, remainingAmountOre: 0 }));
    const sent = JSON.parse(String(calls[0].init?.body));
    assert.equal(sent.useStoredValue, false);
    assert.equal(sent.paymentProvider, "SWISH");
    assert.equal(sent.storedValueAppliedOre, undefined);
    assert.equal(sent.remainingAmountOre, undefined);
  }
});

test("checkout preserves insufficient/stale credit conflicts without starting another request", async () => {
  const { handlers, calls } = routeHarness(checkoutPath, { status: 409, payload: { detail: "Tillgodohavandet har ändrats", code: "SUBSCRIPTION_CREDIT_CHANGED" } });
  const response = await handlers.POST(post({ useStoredValue: true }));
  assert.equal(response.status, 409);
  assert.equal((await response.json()).code, "SUBSCRIPTION_CREDIT_CHANGED");
  assert.equal(calls.length, 1);
});
