import type { CoursePersonalPriceStatus } from "@/lib/coursePricing";

export type CoursePromotionLookupResult =
  | { valid: false; lookupVersion: number }
  | {
      valid: true;
      lookupVersion: number;
      discountPercent: number;
      /** Authoritative post-campaign ordinary price from App API. */
      priceSek: number;
      /** Authoritative post-campaign public tier prices from App API. */
      priceTiers: { birthYearFrom: number; priceSek: number }[];
      /** Authoritative post-campaign price for the signed-in player. */
      personalPriceSek: number | null;
      personalPriceStatus: CoursePersonalPriceStatus;
      /** Campaign floor metadata. Null also covers legacy responses without it. */
      minPriceSek: number | null;
      endsAt: string | null;
    };

function amountSek(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function lookupVersion(value: unknown): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : 1;
}

/**
 * Validate the App API preview without reproducing its pricing algorithm.
 *
 * `priceSek`, tier prices and `personalPriceSek` are final preview amounts.
 * In particular, the website must never apply `discountPercent` or
 * `minPriceSek` itself: enrolment/invoicing remains authoritative under the
 * App API's database locks. Missing `minPriceSek` is the legacy null-floor
 * contract and therefore remains backwards compatible.
 */
export function parseCoursePromotionLookup(
  data: Record<string, unknown>,
): CoursePromotionLookupResult {
  const version = lookupVersion(data.lookupVersion);
  if (data.valid !== true) return { valid: false, lookupVersion: version };

  const priceSek = amountSek(data.priceSek);
  const personalPriceSek = data.personalPriceSek === null ? null : amountSek(data.personalPriceSek);
  const minPriceSek = data.minPriceSek == null ? null : amountSek(data.minPriceSek);
  const priceTiers = Array.isArray(data.priceTiers)
    ? data.priceTiers.flatMap((tier) => {
        if (!tier || typeof tier !== "object") return [];
        const birthYearFrom = (tier as Record<string, unknown>).birthYearFrom;
        const tierPrice = amountSek((tier as Record<string, unknown>).priceSek);
        return Number.isSafeInteger(birthYearFrom) && tierPrice !== null
          ? [{ birthYearFrom: birthYearFrom as number, priceSek: tierPrice }]
          : [];
      })
    : [];
  const discountPercent = data.discountPercent;
  if (
    priceSek === null
    || typeof discountPercent !== "number"
    || !Number.isSafeInteger(discountPercent)
    || discountPercent < 0
    || discountPercent > 100
    || (data.personalPriceSek !== null && personalPriceSek === null)
    || (data.minPriceSek != null && minPriceSek === null)
  ) {
    throw new Error("invalid promotion response");
  }

  return {
    valid: true,
    lookupVersion: version,
    discountPercent,
    priceSek,
    priceTiers,
    personalPriceSek,
    personalPriceStatus: data.personalPriceStatus as CoursePersonalPriceStatus,
    minPriceSek,
    endsAt: typeof data.endsAt === "string" ? data.endsAt : null,
  };
}
