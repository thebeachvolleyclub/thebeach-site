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
    return locale === "sv" ? "Logga in för att se ditt pris" : "Sign in to see your price";
  }
  return money(course.personalPriceSek ?? course.priceSek, locale);
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
