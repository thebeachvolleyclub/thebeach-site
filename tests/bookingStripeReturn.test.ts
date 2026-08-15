import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  stripeBookingIsClosed,
  stripeBookingIsPaid,
  stripeReturnBooking,
  type StripeReturnBooking,
} from "../src/lib/bookingStripeReturn.core.ts";

const paid: StripeReturnBooking = {
  id: "booking-paid",
  status: "CONFIRMED",
  paymentMethod: "STRIPE",
  paymentStatus: "PAID",
  courtName: "Inomhus 1",
  date: "2026-08-15",
  startTime: "11:30",
  endTime: "13:00",
  priceSek: 400,
  createdAt: "2026-08-14T16:58:10",
};

test("Stripe return accepts the exact booking status response", () => {
  assert.deepEqual(stripeReturnBooking({ booking: paid }, paid.id), paid);
  assert.equal(stripeBookingIsPaid(paid), true);
  assert.equal(stripeBookingIsClosed(paid), false);
});

test("legacy Stripe returns recover the newest owned Stripe booking", () => {
  const older = { ...paid, id: "older", createdAt: "2026-08-14T15:00:00" };
  const swish = { ...paid, id: "swish", paymentMethod: "SWISH", createdAt: "2026-08-14T17:00:00" };
  assert.equal(stripeReturnBooking([older, swish, paid], null)?.id, paid.id);
});

test("Stripe return treats only terminal booking states as closed", () => {
  assert.equal(stripeBookingIsClosed({ ...paid, status: "EXPIRED", paymentStatus: "UNPAID" }), true);
  assert.equal(stripeBookingIsClosed({ ...paid, status: "PENDING_PAYMENT", paymentStatus: "UNPAID" }), false);
});

test("web return page polls the authenticated booking API", () => {
  const panel = readFileSync("src/components/payments/StripeReturnPanel.tsx", "utf8");
  assert.match(panel, /booking_id/);
  assert.match(panel, /\/api\/booking\/mine/);
  assert.match(panel, /Betalt och bokat/);
  assert.match(panel, /window\.setTimeout\(poll, 2000\)/);
});

test("mobile Stripe return is a single-purpose handoff back to the app", () => {
  const panel = readFileSync("src/components/payments/StripeReturnPanel.tsx", "utf8");
  assert.match(panel, /Tillbaka till The Beach/);
  assert.match(panel, /Öppna The Beach/);
  assert.match(panel, /thebeach:\/\/stripe-return/);
  assert.match(panel, /!mobile \? <a href="\/boka"/);
});
