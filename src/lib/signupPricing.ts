export type JuniorPricingTier = {
  birth_year_from: number;
  discount_pct: number;
};

export type JuniorPricing = {
  birth_year_from: number;
  discount_pct: number;
  tiers?: JuniorPricingTier[];
  membership_required: boolean;
  membership_fee_sek: number;
};

export const DEFAULT_JUNIOR_PRICING: JuniorPricing = {
  birth_year_from: 2007,
  discount_pct: 30,
  tiers: [
    { birth_year_from: 2007, discount_pct: 30 },
    { birth_year_from: 2001, discount_pct: 20 },
  ],
  membership_required: true,
  membership_fee_sek: 190,
};

export function signupDiscountPct(birthdate: string, pricing: JuniorPricing): number {
  const normalized = birthdate.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return 0;
  const birthYear = Number(normalized.slice(0, 4));
  if (!Number.isInteger(birthYear)) return 0;
  const tiers = pricing.tiers?.length
    ? pricing.tiers
    : [{ birth_year_from: pricing.birth_year_from, discount_pct: pricing.discount_pct }];
  const tier = [...tiers]
    .sort((a, b) => b.birth_year_from - a.birth_year_from)
    .find((candidate) => birthYear >= candidate.birth_year_from);
  return tier?.discount_pct ?? 0;
}

export function discountedSignupPriceSek(priceSek: number, discountPct: number): number {
  const safePrice = Math.max(0, Number(priceSek) || 0);
  const safeDiscount = Math.min(100, Math.max(0, Number(discountPct) || 0));
  return Math.round(safePrice * (100 - safeDiscount) / 100);
}
