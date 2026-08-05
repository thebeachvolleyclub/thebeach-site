import assert from "node:assert/strict";
import test from "node:test";

import { coursePriceHeadline, coursePriceLines } from "../src/lib/coursePricing.ts";
import { tranaDict } from "../src/lib/i18n/trana.ts";

test("shows the explicit beginner youth price before login", () => {
  const course = {
    priceSek: 795,
    fromPriceSek: 395,
    priceTiers: [{ birthYearFrom: 2001, priceSek: 395 }],
  };

  assert.equal(coursePriceHeadline(course, "sv"), "Från 395 kr");
  assert.deepEqual(coursePriceLines(course, "sv"), [
    "Född 2001 eller senare: 395 kr",
    "Ordinarie pris: 795 kr",
  ]);
});

test("renders every continuation tier as an unambiguous birth-year range", () => {
  const course = {
    priceSek: 3695,
    fromPriceSek: 2585,
    priceTiers: [
      { birthYearFrom: 2001, priceSek: 2955 },
      { birthYearFrom: 2007, priceSek: 2585 },
    ],
  };

  assert.deepEqual(coursePriceLines(course, "sv"), [
    "Född 2007 eller senare: 2 585 kr",
    "Född 2001–2006: 2 955 kr",
    "Ordinarie pris: 3 695 kr",
  ]);
  assert.equal(coursePriceHeadline(course, "en"), "From 2,585 kr");
});

test("keeps the simple price when a course has no tiers", () => {
  assert.equal(coursePriceHeadline({ priceSek: 1200 }, "sv"), "1 200 kr");
  assert.deepEqual(coursePriceLines({ priceSek: 1200 }, "sv"), []);
});

test("fallback course cards use direct youth prices rather than store credit", () => {
  const notes = [
    ...tranaDict.sv.courses.items.map((course) => course.priceNote ?? ""),
    ...tranaDict.en.courses.items.map((course) => course.priceNote ?? ""),
  ].join(" ");

  assert.doesNotMatch(notes, /tillgodo|back as credit/i);
  assert.match(notes, /395 kr/);
  assert.match(notes, /2 585 kr/);
  assert.match(notes, /2 955 kr/);
});
