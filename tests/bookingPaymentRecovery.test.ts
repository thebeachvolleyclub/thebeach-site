import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { bookingFailureProvesNoAllocation, bookingPaymentNotice, checkoutBookingId, safeBookingPaymentUrl, startBookingRecovery } from "../src/lib/bookingPaymentRecovery.core.ts";
import { bookingCreditAttemptFromStorage } from "../src/lib/bookingCreditAttempt.core.ts";

test("unknown and received payments cannot be presented as unpaid expiry", () => {
  for (const status of ["PENDING_PAYMENT", "EXPIRED", "CANCELLED"]) {
    const notice = bookingPaymentNotice({ booking: { status }, paymentReviewRequired: true });
    assert.equal(notice.keepAttempt, true);
    assert.match(notice.message, /Starta inte en ny betalning/);
  }
  assert.match(bookingPaymentNotice({ booking: { status: "EXPIRED" }, paymentStatus: "PAID" }).message, /kommit in/);
  for (const status of ["EXPIRED", "CANCELLED"]) for (const paymentStatus of [null, "ERROR", "CREATED"]) {
    const notice = bookingPaymentNotice({ booking: { status, paymentStatus: "PAID" }, paymentStatus });
    assert.equal(notice.keepAttempt, true); assert.match(notice.message, /kommit in/);
  }
  assert.equal(bookingPaymentNotice({ booking: { status: "CONFIRMED" }, paymentStatus: "PAID" }).complete, true);
  assert.equal(bookingPaymentNotice({ booking: { status: "EXPIRED" }, paymentStatus: "ERROR", paymentError: "Avbruten" }).keepAttempt, false);
});

test("completed refund overrides historical paid and review flags", () => {
  const notice = bookingPaymentNotice({ booking: { status: "CANCELLED", paymentStatus: "REFUNDED" }, paymentStatus: "PAID", paymentReviewRequired: true });
  assert.equal(notice.keepAttempt, false); assert.equal(notice.complete, false);
  assert.match(notice.message, /återbetalats/);
});

test("known booking metadata is owner-fenced and retained for status-only recovery", () => {
  const attempt = { ownerId: "owner", courtName: "Bana 1", bookingId: "booking", checkoutUrl: "https://checkout.stripe.com/c/pay/session", body: {
    venueId: "venue", courtId: "court", date: "2026-10-30", startTime: "18:00", quoteId: "quote", clientReference: "web-original", paymentProvider: "SWISH", useStoredValue: false, streamRequested: false, expectedStoredValueAppliedOre: 0, expectedRemainingAmountOre: 78000,
  } };
  assert.deepEqual(bookingCreditAttemptFromStorage(JSON.stringify(attempt), "owner"), attempt);
  assert.equal(bookingCreditAttemptFromStorage(JSON.stringify(attempt), "other"), null);
  assert.equal(bookingCreditAttemptFromStorage(JSON.stringify({ ...attempt, bookingId: 1 }), "owner"), null);
});

test("automatic retries are bounded and stop on known outcome or owner change", async () => {
  const queue: Array<{ run: () => void; delay: number }> = [];
  let calls = 0, exhausted = 0, current = true;
  const delays: number[] = [];
  const stop = startBookingRecovery({ current: () => current, recover: async () => { calls += 1; return false; }, exhausted: () => { exhausted += 1; }, schedule: (run, delay) => { queue.push({ run, delay }); delays.push(delay); return 1 as unknown as ReturnType<typeof setTimeout>; }, cancel: () => {} });
  const tick = async () => { queue.shift()?.run(); for (let i = 0; i < 6; i += 1) await Promise.resolve(); };
  for (let i = 0; i < 5; i += 1) await tick();
  assert.equal(calls, 5); assert.equal(exhausted, 1); assert.deepEqual(delays, [0, 1000, 2000, 4000, 8000]);
  current = false; stop(); assert.equal(queue.length, 0);
});

test("recovery is single flight and never reopens a payment provider automatically", async () => {
  const queue: Array<() => void> = [];
  let done!: (value: boolean) => void;
  let calls = 0;
  startBookingRecovery({ current: () => true, recover: () => { calls += 1; return new Promise((resolve) => { done = resolve; }); }, exhausted: () => assert.fail(), schedule: (run) => { queue.push(run); return 1 as unknown as ReturnType<typeof setTimeout>; } });
  const run = queue.shift()!; run(); run(); assert.equal(calls, 1);
  done(true); for (let i = 0; i < 5; i += 1) await Promise.resolve(); assert.equal(queue.length, 0);
  const source = readFileSync("src/components/booking/BookingWidget.tsx", "utf8");
  assert.match(source, /recover: \(\) => submitAttempt\(attempt, false\)/);
  assert.match(source, /if \(openProvider && attempt.body.paymentProvider/);
  assert.match(source, /if \(!attempt \|\| attempt.bookingId/);
  assert.match(source, /if \(restored\?\.bookingId\) setBookingId/);
  assert.doesNotMatch(source, /Kontrollera bokningsförsöket/);
});

test("only a valid Stripe URL can be explicitly reopened", () => {
  assert.equal(safeBookingPaymentUrl("https://checkout.stripe.com/c/pay/session"), true);
  for (const value of [null, "javascript:alert(1)", "https://checkout.stripe.com.evil.test", "https://user:pass@checkout.stripe.com", "https://example.test"]) assert.equal(safeBookingPaymentUrl(value), false);
});

test("only explicit pre-allocation conflicts release an uncertain attempt", () => {
  for (const status of [400, 401, 403, 408, 409, 422, 429, 500]) assert.equal(bookingFailureProvesNoAllocation(status, ""), false);
  for (const code of ["PRICE_CHANGED", "QUOTE_EXPIRED", "SLOT_TAKEN", "SUBSCRIPTION_CREDIT_CHANGED"]) assert.equal(bookingFailureProvesNoAllocation(409, code), true);
  assert.equal(bookingFailureProvesNoAllocation(429, "PRICE_CHANGED"), false);
  assert.equal(bookingFailureProvesNoAllocation(500, "SLOT_TAKEN"), false);
});

test("malformed success cannot turn unknown recovery into a fresh attempt", () => {
  for (const value of [null, undefined, 1, {}, "", "   "]) assert.throws(() => checkoutBookingId(value));
  assert.equal(checkoutBookingId("booking-1"), "booking-1");
  const screen = readFileSync("src/components/booking/BookingWidget.tsx", "utf8");
  assert.match(screen, /bookingId: checkoutBookingId\(result.bookingId\)/);
  assert.match(screen, /setUncertainAttempt\(attempt\)/);
});
