import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const widget = readFileSync("src/components/booking/BookingWidget.tsx", "utf8");
const portal = readFileSync("src/components/account/AccountPortal.tsx", "utf8");
const courseEnrol = readFileSync("src/components/trana/CourseEnrolButton.tsx", "utf8");
const paymentOptions = readFileSync("src/components/payments/PaymentMethodOptions.tsx", "utf8");
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

test("booking keeps Swish first and passes only an allow-listed Stripe provider", () => {
  const checkoutRoute = readFileSync("src/app/api/booking/checkout/route.ts", "utf8");
  assert.ok(widget.indexOf('checkout("SWISH")') < widget.indexOf('checkout("STRIPE")'));
  assert.match(widget, /checkoutUrl/);
  assert.match(checkoutRoute, /body\.paymentProvider === "STRIPE" \? "STRIPE" : "SWISH"/);
});

test("customer payment surfaces visually prefer Swish and disclose card wallets as fallback", () => {
  assert.match(paymentOptions, /Övriga betalningsmetoder/);
  assert.match(paymentOptions, /<details/);
  assert.match(paymentOptions, /<rect x="6" y="2\.5"/);
  assert.match(widget, /<SwishButtonLabel>/);
  assert.match(widget, /<AlternativePaymentOption/);
  assert.match(courseEnrol, /<SwishButtonLabel>/);
  assert.match(courseEnrol, /<AlternativePaymentOption/);
  assert.match(portal, /<SwishButtonLabel>Betala med Swish<\/SwishButtonLabel>/);
  assert.match(portal, /<AlternativePaymentOption/);
  assert.doesNotMatch(widget, /border-2 border-black bg-white[^>]+checkout\("STRIPE"\)/);
});

test("booking configuration never invents a static base price", () => {
  assert.match(configRoute, /pricingMode: "SERVER_AUTHORITATIVE"/);
  assert.doesNotMatch(configRoute, /priceSek|slotLengthMinutes|\b400\b/);
});

test("account keeps courses separate from training groups and preserves invoice hand-off", () => {
  assert.match(portal, /api<CourseFeed>\("\/api\/courses\/mine"\)/);
  assert.match(portal, /\["training", "Träningsgrupper"\], \["courses", "Kurser"\], \["bookings", "Bokningar"\]/);
  assert.match(portal, /"#kurser": "courses"/);
  assert.match(portal, /tab === "courses" \? <AccountCourses/);
  assert.match(portal, /id="kurser"/);
  assert.match(portal, /Mina kurser/);
  assert.match(portal, /href="#fakturor"/);
  assert.match(portal, /status === "expired"/);
  const coursesPanel = portal.slice(portal.indexOf("function AccountCourses"), portal.indexOf("function AccountTraining"));
  const trainingPanel = portal.slice(portal.indexOf("function AccountTraining"), portal.indexOf("function TrainingGroupRecordingStrip"));
  assert.match(coursesPanel, /<CourseEnrolmentsCard/);
  assert.doesNotMatch(trainingPanel, /CourseEnrolmentsCard|köpta kurser|Träning och kurser/);
});

test("account overview stats follow the training, booking, invoice navigation order", () => {
  const stats = portal.slice(portal.indexOf("function AccountOverview"), portal.indexOf("function MembershipStatusCard"));
  const training = stats.indexOf('label="Träningsgrupper"');
  const booked = stats.indexOf('label="Banor bokade"');
  const upcoming = stats.indexOf('label="Kommande bantider"');
  const invoices = stats.indexOf('label="Fakturor att hantera"');
  assert.ok(training >= 0 && training < booked);
  assert.ok(booked < upcoming);
  assert.ok(upcoming < invoices);
});
