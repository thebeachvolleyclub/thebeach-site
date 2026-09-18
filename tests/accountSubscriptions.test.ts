import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  subscriptionCanAccept,
  subscriptionCanPay,
  subscriptionPaymentFromWire,
  subscriptionPaymentNeedsPolling,
  subscriptionsFromWire,
  validSubscriptionId,
} from "../src/lib/accountSubscription.core.ts";

const offered = subscriptionsFromWire({
  subscriptions: [{
    id: "sub-1",
    status: "OFFERED",
    termName: "HT 2026",
    totalPriceOre: 960000,
    paymentDueOn: "2026-09-28",
    termsVersion: "ht26-v1",
    payment: {
      subscriptionId: "sub-1",
      subscriptionStatus: "OFFERED",
      orderStatus: "PENDING",
      paymentDueOn: "2026-09-28",
      paymentExpired: false,
      paymentMethod: "SWISH",
      paymentStatus: "SELECTED",
      amountOre: 960000,
      swish: null,
    },
    occurrences: [],
  }],
})[0];

test("subscription parser preserves server-owned amount, deadline and acceptance gate", () => {
  assert.equal(offered.totalPriceOre, 960000);
  assert.equal(offered.paymentDueOn, "2026-09-28");
  assert.equal(subscriptionCanAccept(offered), true);
  assert.equal(subscriptionCanAccept({ ...offered, payment: { ...offered.payment, paymentExpired: true } }), false);
});

test("Swish starts only after acceptance and one active attempt is polled", () => {
  const awaiting = { ...offered, status: "AWAITING_PAYMENT", payment: { ...offered.payment, subscriptionStatus: "AWAITING_PAYMENT" } };
  assert.equal(subscriptionCanPay(awaiting), true);
  const created = { ...awaiting, payment: { ...awaiting.payment, swish: {
    id: "attempt-1", status: "CREATED" as const, amountOre: 960000,
    paymentVerificationPending: false, providerReference: null,
  } } };
  assert.equal(subscriptionCanPay(created), false);
  assert.equal(subscriptionPaymentNeedsPolling(created), true);
});

test("source-authoritative payment status can update a stale subscription feed", () => {
  const payment = subscriptionPaymentFromWire({
    ...offered.payment,
    subscriptionStatus: "ACTIVE",
    orderStatus: "PAID",
    paymentStatus: "PAID",
    swish: { id: "attempt-1", status: "PAID", amountOre: 960000 },
  }, offered.id, offered.totalPriceOre);
  assert.equal(payment.subscriptionStatus, "ACTIVE");
  assert.equal(payment.swish?.status, "PAID");
});

test("BFF routes keep identity server-side and allow only bounded subscription ids", () => {
  assert.equal(validSubscriptionId("sub-123_OK"), true);
  assert.equal(validSubscriptionId("../someone-else"), false);
  const root = process.cwd();
  const accept = readFileSync(`${root}/src/app/api/account/subscriptions/[subscriptionId]/accept/route.ts`, "utf8");
  const swish = readFileSync(`${root}/src/app/api/account/subscriptions/[subscriptionId]/swish/route.ts`, "utf8");
  for (const source of [accept, swish]) {
    assert.match(source, /accountToken\(\)/);
    assert.match(source, /sameOrigin\(request\)/);
    assert.match(source, /validSubscriptionId\(subscriptionId\)/);
    assert.doesNotMatch(source, /playerId|customerId|user_id/);
  }
  assert.match(swish, /channel: "WEB"/);
  assert.match(accept, /personalUseAccepted: true/);
});

test("account portal exposes the dedicated subscription customer flow", () => {
  const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");
  assert.match(portal, /\["subscriptions", "Banabonnemang"\]/);
  assert.match(portal, /Acceptera erbjudandet/);
  assert.match(portal, /Betala med Swish/);
  assert.match(portal, /subscriptionPaymentNeedsPolling/);
});
