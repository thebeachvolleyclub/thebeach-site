import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// @ts-expect-error Node's native TypeScript runner needs the explicit extension.
import { parseCoursePromotionLookup } from "../src/lib/coursePromotion.ts";

const route = readFileSync(
  "src/app/api/courses/promotions/lookup/route.ts",
  "utf8",
);
const enrolmentRoute = readFileSync(
  "src/app/api/courses/[courseId]/enrol/route.ts",
  "utf8",
);
const component = readFileSync(
  "src/components/trana/CourseEnrolButton.tsx",
  "utf8",
);
const courses = readFileSync("src/lib/courses.ts", "utf8");
const promotionContract = readFileSync("src/lib/coursePromotion.ts", "utf8");

test("promotion lookup is a same-origin, signed-IP BFF with no local pricing truth", () => {
  assert.match(route, /sameOrigin\(request\)/);
  assert.match(route, /signClientIp\(trustedClientIp\(request\)\)/);
  assert.match(route, /"\/training\/promotions\/lookup"/);
  assert.match(route, /accountToken\(\)/);
  assert.match(route, /proxyAppJson/);
  assert.doesNotMatch(route, /discountPercent\s*[*/+-]|priceSek\s*[*/+-]/);
  assert.doesNotMatch(route, /X-API-Key|Authorization/);
});

test("campaign price is checked before login and preserved through inline login", () => {
  const lookup = component.indexOf("lookupPromotion(courseId, linkedCode");
  const signedOut = component.indexOf("if (!loggedIn) return");
  assert.ok(lookup >= 0 && signedOut >= 0 && lookup < signedOut);
  assert.match(component, /searchParams\.set\("kampanjkod", code\)/);
  assert.match(component, /searchParams\.set\("kurs", String\(courseId\)\)/);
  assert.match(component, /promotionNeedsValidation/);
  assert.match(component, /personalPriceSek/);
  assert.match(component, /priceTiers\.map/);
  assert.match(component, /parseCoursePromotionLookup\(data\)/);
});

test("David's age price stays at the campaign floor", () => {
  const preview = parseCoursePromotionLookup({
    valid: true,
    lookupVersion: 1,
    discountPercent: 50,
    minPriceSek: 395,
    // These are the App API's post-campaign preview amounts. The site must
    // display them directly instead of applying 50% a second time.
    priceSek: 397,
    priceTiers: [{ birthYearFrom: 2001, priceSek: 395 }],
    personalPriceSek: 395,
    personalPriceStatus: "resolved",
    endsAt: null,
  });

  assert.equal(preview.valid, true);
  if (!preview.valid) return;
  assert.equal(preview.minPriceSek, 395);
  assert.equal(preview.personalPriceSek, 395);
  assert.equal(preview.priceSek, 397);
  assert.equal(preview.priceTiers[0]?.priceSek, 395);
});

test("logged-out campaign preview keeps authoritative public floor prices", () => {
  const preview = parseCoursePromotionLookup({
    valid: true,
    lookupVersion: 1,
    discountPercent: 50,
    minPriceSek: 395,
    priceSek: 397,
    priceTiers: [{ birthYearFrom: 2001, priceSek: 395 }],
    personalPriceSek: null,
    personalPriceStatus: "sign_in_required",
    endsAt: null,
  });

  assert.equal(preview.valid, true);
  if (!preview.valid) return;
  assert.equal(preview.personalPriceSek, null);
  assert.deepEqual(preview.priceTiers, [{ birthYearFrom: 2001, priceSek: 395 }]);
  const lookup = component.indexOf("lookupPromotion(courseId, linkedCode");
  const signedOut = component.indexOf("if (!loggedIn) return");
  assert.ok(lookup >= 0 && lookup < signedOut);
});

test("legacy null-floor preview preserves age and campaign stacking", () => {
  const preview = parseCoursePromotionLookup({
    valid: true,
    lookupVersion: 1,
    discountPercent: 50,
    // Older App API responses omitted minPriceSek. The already-computed
    // personal amount remains untouched.
    priceSek: 397,
    priceTiers: [{ birthYearFrom: 2001, priceSek: 197 }],
    personalPriceSek: 197,
    personalPriceStatus: "resolved",
    endsAt: null,
  });

  assert.equal(preview.valid, true);
  if (!preview.valid) return;
  assert.equal(preview.minPriceSek, null);
  assert.equal(preview.personalPriceSek, 197);
  assert.equal(preview.priceTiers[0]?.priceSek, 197);
});

test("website consumes authoritative previews without local floor arithmetic", () => {
  assert.doesNotMatch(promotionContract, /discountPercent\s*[*/+-]/);
  assert.doesNotMatch(promotionContract, /minPriceSek\s*[*/+-]/);
  assert.doesNotMatch(promotionContract, /\[(?:50|100)(?:,\s*(?:50|100))*\]\.includes/);
});

test("referral attribution remains separate from promotion pricing", () => {
  assert.match(component, /submittedReferral/);
  assert.match(component, /\{ referralCode: submittedReferral \}/);
  assert.match(component, /referralAttribution/);
  assert.match(enrolmentRoute, /promotionCode/);
  assert.match(enrolmentRoute, /referralCode/);
});

test("course copy consumes platform English fields with Swedish fallback", () => {
  assert.match(courses, /nameEn\?: string \| null/);
  assert.match(courses, /descriptionEn\?: string \| null/);
  assert.match(courses, /course\.nameEn\?\.trim\(\)/);
  assert.match(courses, /course\.descriptionEn\?\.trim\(\)/);
});
