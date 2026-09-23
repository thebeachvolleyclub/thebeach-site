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

test("HQ #295: booking owner action distinguishes cancel, release and pending subscription", async () => {
  const { bookingOwnerAction } = await import("../src/lib/accountSubscription.core.ts");
  assert.deepEqual(bookingOwnerAction({ status: "CONFIRMED" }), { kind: "cancel" });
  assert.deepEqual(bookingOwnerAction({ status: "PENDING_PAYMENT" }), { kind: "none" });
  assert.deepEqual(
    bookingOwnerAction({ status: "CONFIRMED", subscriptionId: "s1", subscriptionOccurrenceId: "o1", subscriptionStatus: "ACTIVE", subscriptionOccurrenceStatus: "SCHEDULED" }),
    { kind: "release", occurrenceId: "o1", subscriptionId: "s1" },
  );
  assert.equal(
    bookingOwnerAction({ status: "CONFIRMED", subscriptionId: "s1", subscriptionOccurrenceId: "o1", subscriptionStatus: "ACTIVE", subscriptionOccurrenceStatus: "RELEASED" }).kind,
    "none",
  );
  for (const status of ["OFFERED", "AWAITING_PAYMENT"]) {
    const action = bookingOwnerAction({ status: "CONFIRMED", subscriptionId: "s1", subscriptionOccurrenceId: "o1", subscriptionStatus: status, subscriptionOccurrenceStatus: "SCHEDULED" });
    assert.equal(action.kind, "subscription-pending");
  }
  // A subscription time is never a regular cancel, whatever its state.
  assert.notEqual(
    bookingOwnerAction({ status: "CONFIRMED", subscriptionId: "s1", subscriptionOccurrenceId: "o1", subscriptionStatus: "TERMINATED", subscriptionOccurrenceStatus: "SCHEDULED" }).kind,
    "cancel",
  );
});

test("HQ #296: card is a secondary option with the same gates as Swish, and an open link can be resumed", async () => {
  const { subscriptionCanPay, subscriptionCanPayByCard, subscriptionOpenCardCheckoutUrl, subscriptionsFromWire } = await import("../src/lib/accountSubscription.core.ts");
  const base = {
    id: "sub-2", status: "AWAITING_PAYMENT", termName: "HT 2026", totalPriceOre: 300000, paymentDueOn: "2026-10-05", termsVersion: "HT2026-v1",
    payment: { subscriptionId: "sub-2", subscriptionStatus: "AWAITING_PAYMENT", orderStatus: "PENDING", paymentDueOn: "2026-10-05", paymentExpired: false, paymentMethod: "SWISH", paymentStatus: "SELECTED", amountOre: 300000, swish: null, card: null },
  };
  const wire = (payment: Record<string, unknown>) => subscriptionsFromWire({ subscriptions: [{ ...base, payment: { ...base.payment, ...payment } }] })[0];

  const fresh = wire({});
  assert.equal(subscriptionCanPay(fresh), true);
  assert.equal(subscriptionCanPayByCard(fresh), true);
  assert.equal(subscriptionOpenCardCheckoutUrl(fresh), null);

  const cardChosen = wire({ paymentMethod: "CARD", paymentStatus: "SELECTED" });
  assert.equal(subscriptionCanPay(cardChosen), true, "an uncompleted card choice can still go Swish");
  assert.equal(subscriptionCanPayByCard(cardChosen), true);

  const cardOpen = wire({ paymentMethod: "CARD", paymentStatus: "EXTERNAL_CREATED", card: { transactionId: "tx", status: "CREATED", checkoutUrl: "https://checkout.stripe.com/c/pay/cs_1" } });
  assert.equal(subscriptionCanPay(cardOpen), false, "Swish waits while a Checkout link is open");
  assert.equal(subscriptionCanPayByCard(cardOpen), true);
  assert.equal(subscriptionOpenCardCheckoutUrl(cardOpen), "https://checkout.stripe.com/c/pay/cs_1");

  const badUrl = wire({ paymentMethod: "CARD", paymentStatus: "EXTERNAL_CREATED", card: { transactionId: "tx", status: "CREATED", checkoutUrl: "https://evil.example/pay" } });
  assert.equal(subscriptionOpenCardCheckoutUrl(badUrl), null, "only checkout.stripe.com links are followed");

  const swishPending = wire({ swish: { id: "a", status: "CREATED", amountOre: 300000 } });
  assert.equal(subscriptionCanPayByCard(swishPending), false, "card hides while a Swish request is pending");

  const expired = wire({ paymentExpired: true });
  assert.equal(subscriptionCanPayByCard(expired), false);
  const fortnox = wire({ paymentMethod: "FORTNOX" });
  assert.equal(subscriptionCanPay(fortnox), false);
  assert.equal(subscriptionCanPayByCard(fortnox), false);
});

test("HQ #296: card BFF route keeps identity server-side and only forwards the idempotency key", () => {
  const route = readFileSync("src/app/api/account/subscriptions/[subscriptionId]/card/route.ts", "utf8");
  assert.match(route, /sameOrigin\(request\)/);
  assert.match(route, /accountToken\(\)/);
  assert.match(route, /validSubscriptionId\(subscriptionId\)/);
  assert.match(route, /\/booking\/subscriptions\/\$\{encodeURIComponent\(subscriptionId\)\}\/card/);
  assert.doesNotMatch(route, /customerId|playerId/);
  const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");
  assert.match(portal, /AlternativePaymentOption busy=\{busyId === item.id\}/);
  assert.match(portal, /checkout\\\.stripe\\\.com/);
});
