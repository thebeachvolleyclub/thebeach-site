import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_JUNIOR_PRICING,
  discountedSignupPriceSek,
  signupDiscountPct,
} from "../src/lib/signupPricing.ts";

test("signup youth discount uses both production birth-year tiers", () => {
  assert.equal(signupDiscountPct("2010-06-01", DEFAULT_JUNIOR_PRICING), 30);
  assert.equal(signupDiscountPct("2007-01-01", DEFAULT_JUNIOR_PRICING), 30);
  assert.equal(signupDiscountPct("2006-12-31", DEFAULT_JUNIOR_PRICING), 20);
  assert.equal(signupDiscountPct("2001-01-01", DEFAULT_JUNIOR_PRICING), 20);
  assert.equal(signupDiscountPct("2000-12-31", DEFAULT_JUNIOR_PRICING), 0);
  assert.equal(signupDiscountPct("invalid", DEFAULT_JUNIOR_PRICING), 0);
});

test("legacy one-tier API payloads remain supported", () => {
  const legacy = {
    birth_year_from: 2008,
    discount_pct: 35,
    membership_required: true,
    membership_fee_sek: 210,
  };
  assert.equal(signupDiscountPct("2008-01-01", legacy), 35);
  assert.equal(signupDiscountPct("2007-12-31", legacy), 0);
});

test("discounted signup price rounds to whole SEK for both tiers", () => {
  assert.equal(discountedSignupPriceSek(3995, 30), 2797);
  assert.equal(discountedSignupPriceSek(3995, 20), 3196);
  assert.equal(discountedSignupPriceSek(4295, 20), 3436);
});
