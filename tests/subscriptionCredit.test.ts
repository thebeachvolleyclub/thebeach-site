import assert from "node:assert/strict";
import test from "node:test";
import { availableSubscriptionCredit, creditPriceQuoteFromWire, subscriptionCreditsFromWire } from "../src/lib/subscriptionCredit.core.ts";
import { subscriptionOccurrenceCanRelease, subscriptionsFromWire } from "../src/lib/accountSubscription.core.ts";
import { bookingCreditAttemptFromStorage, bookingCreditAttemptKey } from "../src/lib/bookingCreditAttempt.core.ts";

test("credit checkout uses only the server's available amount for the selected venue", () => {
  const feed = subscriptionCreditsFromWire({ totalAvailableOre: 70200, credits: [
    { id: "credit", venueId: "beach", status: "ACTIVE", balanceOre: 70200, availableOre: 70200, expiresAt: "2027-09-21T12:00:00" },
    { id: "expired", venueId: "beach", status: "ACTIVE", balanceOre: 90000, availableOre: 0 },
    { id: "future", venueId: "beach", status: "ACTIVE", balanceOre: 10000, availableOre: 0 },
    { id: "other", venueId: "elsewhere", status: "ACTIVE", balanceOre: 10000, availableOre: 10000 },
    { id: "inactive", venueId: "beach", status: "SUSPENDED", balanceOre: 2000, availableOre: 2000 },
  ] });
  assert.equal(availableSubscriptionCredit(feed, "beach"), 70200);
  assert.equal(availableSubscriptionCredit(feed, "missing"), 0);
});

test("missing or malformed availability cannot spend a historical balance", () => {
  const feed = subscriptionCreditsFromWire({ totalAvailableOre: 10000, credits: [
    { id: "legacy", venueId: "beach", status: "ACTIVE", balanceOre: 10000 },
    { id: "invalid", venueId: "beach", status: "ACTIVE", balanceOre: -100, availableOre: Infinity },
  ] });
  assert.equal(availableSubscriptionCredit(feed, "beach"), 0);
  assert.deepEqual(subscriptionCreditsFromWire(null), { totalAvailableOre: 0, credits: [] });
});

test("explicit payment quotes preserve cash minimum and reject inconsistent amounts", () => {
  const quote = { quoteId: "quote-1", priceSek: 780, storedValueAppliedOre: 77700, remainingAmountOre: 300, expiresAt: "2026-09-21T12:00:00" };
  assert.equal(creditPriceQuoteFromWire(quote)?.remainingAmountOre, 300);
  assert.equal(creditPriceQuoteFromWire(quote)?.expiresAt, "2026-09-21T12:00:00Z");
  assert.equal(creditPriceQuoteFromWire({ ...quote, remainingAmountOre: 0 }), null);
  assert.equal(creditPriceQuoteFromWire({ ...quote, storedValueAppliedOre: undefined }), null);
  assert.equal(creditPriceQuoteFromWire({ ...quote, expiresAt: "invalid" }), null);
});

test("release is limited to future active occurrences in Swedish local time", () => {
  const item = subscriptionsFromWire({ subscriptions: [{ id: "sub", status: "ACTIVE", occurrences: [{ id: "occ", bookingId: "booking", status: "SCHEDULED", date: "2026-09-21", startTime: "18:00" }] }] })[0];
  const occurrence = item.occurrences[0];
  assert.equal(subscriptionOccurrenceCanRelease(item, occurrence, new Date("2026-09-21T15:59:59Z")), true);
  assert.equal(subscriptionOccurrenceCanRelease(item, occurrence, new Date("2026-09-21T16:00:00Z")), false);
  assert.equal(subscriptionOccurrenceCanRelease({ ...item, status: "OFFERED" }, occurrence, new Date("2026-09-21T15:00:00Z")), false);
  assert.equal(subscriptionOccurrenceCanRelease(item, { ...occurrence, status: "RELEASED" }, new Date("2026-09-21T15:00:00Z")), false);
});

test("uncertain checkout restores exactly one owner's original consent and idempotency key", () => {
  const attempt = { ownerId: "owner", courtName: "Bana 1", body: {
    venueId: "venue", courtId: "court", date: "2026-09-21", startTime: "18:00", quoteId: "quote-original",
    streamRequested: false, useStoredValue: true, paymentProvider: "SWISH",
    expectedStoredValueAppliedOre: 70200, expectedRemainingAmountOre: 7800, clientReference: "web-original-attempt",
  } };
  assert.deepEqual(bookingCreditAttemptFromStorage(JSON.stringify(attempt), "owner"), attempt);
  assert.equal(bookingCreditAttemptFromStorage(JSON.stringify(attempt), "other-owner"), null);
  assert.equal(bookingCreditAttemptFromStorage("broken json", "owner"), null);
  assert.notEqual(bookingCreditAttemptKey("owner"), bookingCreditAttemptKey("other-owner"));
});
