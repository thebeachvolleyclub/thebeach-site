export type CoursePriceTier = {
  birthYearFrom: number;
  priceSek: number;
};

export type CoursePersonalPriceStatus =
  | "resolved"
  | "birthdate_required"
  | "sign_in_required";

type PricedCourse = {
  priceSek: number;
  fromPriceSek?: number;
  priceTiers?: CoursePriceTier[];
  personalPriceSek?: number | null;
  personalPriceStatus?: CoursePersonalPriceStatus;
};

function money(value: number, locale: "sv" | "en"): string {
  return `${value.toLocaleString(locale === "sv" ? "sv-SE" : "en-GB")} kr`;
}

export function coursePriceHeadline(course: PricedCourse, locale: "sv" | "en"): string {
  const status = coursePersonalPriceStatus(course);
  if (status === "birthdate_required") {
    return locale === "sv" ? "Födelsedatum saknas" : "Date of birth required";
  }
  if (status === "sign_in_required") {
    return money(course.priceSek, locale);
  }
  return money(course.personalPriceSek ?? course.priceSek, locale);
}

/**
 * Generic product terms for signed-out visitors. These are explicit,
 * birth-year-qualified alternatives to the ordinary price — never a lowest
 * "from" price. Once identity is known the UI shows only personalPriceSek.
 */
export function coursePublicPriceOptions(
  course: PricedCourse,
  locale: "sv" | "en",
): string[] {
  if (coursePersonalPriceStatus(course) !== "sign_in_required") return [];
  const tiers = [...(course.priceTiers ?? [])]
    .filter((tier) => Number.isSafeInteger(tier.birthYearFrom) && Number.isSafeInteger(tier.priceSek))
    .sort((a, b) => b.birthYearFrom - a.birthYearFrom);

  return tiers.map((tier, index) => {
    const upperYear = index === 0 ? null : tiers[index - 1].birthYearFrom - 1;
    const eligibility = upperYear === null
      ? locale === "sv"
        ? `född ${tier.birthYearFrom} eller senare`
        : `born ${tier.birthYearFrom} or later`
      : locale === "sv"
        ? `född ${tier.birthYearFrom}–${upperYear}`
        : `born ${tier.birthYearFrom}–${upperYear}`;
    return `${money(tier.priceSek, locale)} · ${eligibility}`;
  });
}

export function coursePersonalPriceStatus(course: PricedCourse): CoursePersonalPriceStatus {
  if (course.personalPriceStatus) return course.personalPriceStatus;
  if (Number.isSafeInteger(course.personalPriceSek) && Number(course.personalPriceSek) >= 0) {
    return "resolved";
  }
  // Compatibility with the brief legacy API window that exposed tier ladders.
  return course.priceTiers?.length ? "sign_in_required" : "resolved";
}

export function coursePriceNeedsBirthdate(course: PricedCourse): boolean {
  return coursePersonalPriceStatus(course) === "birthdate_required";
}

export function coursePriceResolved(course: PricedCourse): boolean {
  if (course.personalPriceStatus === "resolved") {
    return Number.isSafeInteger(course.personalPriceSek) && Number(course.personalPriceSek) >= 0;
  }
  return !course.personalPriceStatus && !course.priceTiers?.length;
}
