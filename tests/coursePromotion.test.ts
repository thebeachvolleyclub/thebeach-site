import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

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
