import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const widget = readFileSync("src/components/booking/BookingWidget.tsx", "utf8");
const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");

test("booking login and incomplete profile actions return to the booking page", () => {
  assert.match(widget, /const bookingPath = locale === "en" \? "\/en\/book" : "\/boka"/);
  assert.match(widget, /const accountHref = `\/konto\?next=/);
  assert.doesNotMatch(widget, /href="\/konto"/);
  assert.doesNotMatch(widget, /href="\/konto#profil"/);
  assert.match(portal, /accountReturnNeedsSwish\(nextPath\)/);
});

test("court selection reveals the payment panel on phone sized screens", () => {
  assert.match(widget, /paymentPanel\.current\?\.scrollIntoView/);
  assert.match(widget, /max-width: 1023px/);
  assert.match(widget, /prefers-reduced-motion: reduce/);
  assert.match(widget, /ref=\{paymentPanel\}/);
});
