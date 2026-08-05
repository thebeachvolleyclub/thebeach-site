import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const widget = readFileSync("src/components/booking/BookingWidget.tsx", "utf8");
const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");
const availabilityRoute = readFileSync("src/app/api/booking/availability/route.ts", "utf8");
const configRoute = readFileSync("src/app/api/booking/config/route.ts", "utf8");
const quoteRoute = readFileSync("src/app/api/booking/quotes/route.ts", "utf8");

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

test("logged-in availability resolves personal pricing through App API", () => {
  assert.match(availabilityRoute, /const token = await accountToken\(\)/);
  assert.match(availabilityRoute, /appApi\(`\/booking\/availability\?/);
  assert.match(availabilityRoute, /\{ token \}/);
  assert.match(availabilityRoute, /bookingApi\(`\/availability\?/);
  assert.doesNotMatch(availabilityRoute, /customerScopes|priceSek.*searchParams/);
});

test("booking price UI accepts server-authored personal pricing metadata", () => {
  assert.match(widget, /ordinaryPriceSek\?:/);
  assert.match(widget, /priceLabel\?:/);
  assert.match(widget, /quoteExpiresAt\?:/);
  assert.match(widget, /\["PRICE_CHANGED", "QUOTE_EXPIRED", "SLOT_TAKEN"\]/);
  assert.match(widget, /"\/api\/booking\/quotes"/);
  assert.match(quoteRoute, /appApi\("\/booking\/quotes"/);
  assert.doesNotMatch(quoteRoute, /priceSek|entitlementCode|customerScopes/);
  assert.doesNotMatch(widget, /body: JSON\.stringify\([^)]*priceSek/);
});

test("booking configuration never invents a static base price", () => {
  assert.match(configRoute, /pricingMode: "SERVER_AUTHORITATIVE"/);
  assert.doesNotMatch(configRoute, /priceSek|slotLengthMinutes|\b400\b/);
});

test("account training renders purchased courses and invoice hand-off", () => {
  assert.match(portal, /api<CourseFeed>\("\/api\/courses\/mine"\)/);
  assert.match(portal, /id="kurser"/);
  assert.match(portal, /Mina kurser/);
  assert.match(portal, /href="#fakturor"/);
  assert.match(portal, /status === "expired"/);
});
