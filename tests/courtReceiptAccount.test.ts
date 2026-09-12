import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const portal = fs.readFileSync("src/components/account/AccountPortal.tsx", "utf8");
const route = fs.readFileSync("src/app/api/booking/[bookingId]/receipt/route.ts", "utf8");

test("account invoice tab shows ordinary court receipts without a personal-id form", () => {
  const start = portal.indexOf("Banbokningskvitton");
  const end = portal.indexOf("Tränings- och kursfakturor");
  const courtSection = portal.slice(start, end);
  assert.match(courtSection, /Beachhallen Tropical AB/);
  assert.match(courtSection, /org\.nr 556699-2839/);
  assert.match(courtSection, /Inget personnummer behövs/);
  assert.doesNotMatch(courtSection, /friskvård/i);
  assert.doesNotMatch(courtSection, /TextInput/);
});

test("receipt BFF keeps the bearer server-side and checks same-origin plus booking id", () => {
  assert.match(route, /sameOrigin\(request\)/);
  assert.match(route, /accountToken\(\)/);
  assert.match(route, /validBookingId\(bookingId\)/);
  assert.match(route, /\/booking\/bookings\/\$\{encodeURIComponent\(bookingId\)\}\/receipt/);
  assert.doesNotMatch(route, /personnummer|friskvård/i);
});

test("course and training invoice receipt flow remains present", () => {
  assert.match(portal, /requestInvoiceReceipt/);
  assert.match(portal, /openInvoiceReceipt/);
  assert.match(portal, /Tränings- och kursfakturor/);
});
