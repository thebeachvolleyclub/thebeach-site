export type CoursePriceTier = {
  birthYearFrom: number;
  priceSek: number;
};

type PricedCourse = {
  priceSek: number;
  fromPriceSek?: number;
  priceTiers?: CoursePriceTier[];
};

function money(value: number, locale: "sv" | "en"): string {
  return `${value.toLocaleString(locale === "sv" ? "sv-SE" : "en-GB")} kr`;
}

export function coursePriceHeadline(course: PricedCourse, locale: "sv" | "en"): string {
  const tiers = course.priceTiers ?? [];
  const lowest = course.fromPriceSek ?? Math.min(course.priceSek, ...tiers.map((tier) => tier.priceSek));
  if (!tiers.length || lowest === course.priceSek) return money(course.priceSek, locale);
  return `${locale === "sv" ? "Från" : "From"} ${money(lowest, locale)}`;
}

export function coursePriceLines(course: PricedCourse, locale: "sv" | "en"): string[] {
  const tiers = [...(course.priceTiers ?? [])].sort(
    (a, b) => b.birthYearFrom - a.birthYearFrom,
  );
  if (!tiers.length) return [];

  const lines = tiers.map((tier, index) => {
    const upper = index === 0 ? null : tiers[index - 1].birthYearFrom - 1;
    const years = upper === null
      ? locale === "sv"
        ? `Född ${tier.birthYearFrom} eller senare`
        : `Born ${tier.birthYearFrom} or later`
      : locale === "sv"
        ? `Född ${tier.birthYearFrom}–${upper}`
        : `Born ${tier.birthYearFrom}–${upper}`;
    return `${years}: ${money(tier.priceSek, locale)}`;
  });
  lines.push(
    `${locale === "sv" ? "Ordinarie pris" : "Standard price"}: ${money(course.priceSek, locale)}`,
  );
  return lines;
}
