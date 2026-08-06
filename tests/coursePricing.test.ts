import assert from "node:assert/strict";
import test from "node:test";

import {
  coursePriceHeadline,
  coursePriceNeedsBirthdate,
  coursePublicPriceOptions,
  coursePriceResolved,
} from "../src/lib/coursePricing.ts";
import { tranaDict } from "../src/lib/i18n/trana.ts";

test("shows a qualified public price table instead of a misleading from price", () => {
  const course = {
    priceSek: 795,
    fromPriceSek: 395,
    priceTiers: [{ birthYearFrom: 2001, priceSek: 395 }],
    personalPriceSek: null,
    personalPriceStatus: "sign_in_required" as const,
  };

  assert.equal(coursePriceHeadline(course, "sv"), "795 kr");
  assert.deepEqual(coursePublicPriceOptions(course, "sv"), [
    "395 kr · född 2001 eller senare",
  ]);
  assert.doesNotMatch(coursePriceHeadline(course, "sv"), /Från/);
  assert.equal(coursePriceResolved(course), false);
});

test("renders non-overlapping public birth-year ranges", () => {
  const course = {
    priceSek: 3695,
    priceTiers: [
      { birthYearFrom: 2001, priceSek: 2955 },
      { birthYearFrom: 2007, priceSek: 2585 },
    ],
    personalPriceSek: null,
    personalPriceStatus: "sign_in_required" as const,
  };

  assert.deepEqual(coursePublicPriceOptions(course, "sv"), [
    "2 585 kr · född 2007 eller senare",
    "2 955 kr · född 2001–2006",
  ]);
});

test("shows only the signed-in players resolved continuation price", () => {
  const course = {
    priceSek: 3695,
    personalPriceSek: 2955,
    personalPriceStatus: "resolved" as const,
  };

  assert.equal(coursePriceHeadline(course, "sv"), "2 955 kr");
  assert.deepEqual(coursePublicPriceOptions(course, "sv"), []);
  assert.equal(coursePriceHeadline(course, "en"), "2,955 kr");
  assert.equal(coursePriceResolved(course), true);
});

test("keeps the simple price when a course has no tiers", () => {
  assert.equal(coursePriceHeadline({ priceSek: 1200 }, "sv"), "1 200 kr");
  assert.equal(coursePriceResolved({ priceSek: 1200 }), true);
});

test("missing birthdate is a pricing error with no fallback amount", () => {
  const course = {
    priceSek: 3695,
    personalPriceSek: null,
    personalPriceStatus: "birthdate_required" as const,
  };

  assert.equal(coursePriceHeadline(course, "sv"), "Födelsedatum saknas");
  assert.equal(coursePriceNeedsBirthdate(course), true);
  assert.equal(coursePriceResolved(course), false);
});

test("fallback course cards do not enumerate youth prices", () => {
  const notes = [
    ...tranaDict.sv.courses.items.map((course) => course.priceNote ?? ""),
    ...tranaDict.en.courses.items.map((course) => course.priceNote ?? ""),
  ].join(" ");

  assert.doesNotMatch(notes, /tillgodo|back as credit/i);
  assert.doesNotMatch(notes, /395 kr|2 585 kr|2 955 kr/);
  assert.match(notes, /personliga pris|personal price/);
});
