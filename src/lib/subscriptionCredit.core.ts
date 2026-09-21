export type SubscriptionCredit = {
  id: string;
  venueId: string;
  venueName: string;
  balanceOre: number;
  availableOre: number;
  validFrom: string | null;
  expiresAt: string | null;
  status: string;
};

export type SubscriptionCreditFeed = {
  totalAvailableOre: number;
  credits: SubscriptionCredit[];
};

export type CreditPriceQuote = {
  quoteId: string;
  priceSek: number;
  storedValueAppliedOre: number;
  remainingAmountOre: number;
  expiresAt: string;
};

export function creditPriceQuoteFromWire(value: unknown): CreditPriceQuote | null {
  const item = record(value);
  if (typeof item.quoteId !== "string" || !item.quoteId
    || typeof item.priceSek !== "number" || !Number.isFinite(item.priceSek) || item.priceSek < 0
    || typeof item.storedValueAppliedOre !== "number" || !Number.isSafeInteger(item.storedValueAppliedOre) || item.storedValueAppliedOre < 0
    || typeof item.remainingAmountOre !== "number" || !Number.isSafeInteger(item.remainingAmountOre) || item.remainingAmountOre < 0
    || item.storedValueAppliedOre + item.remainingAmountOre !== Math.round(item.priceSek * 100)
    || typeof item.expiresAt !== "string") return null;
  // The quote service returns a UTC datetime, sometimes without its suffix.
  const expiresAt = /(?:Z|[+-]\d{2}:\d{2})$/.test(item.expiresAt) ? item.expiresAt : `${item.expiresAt}Z`;
  if (Number.isNaN(Date.parse(expiresAt))) return null;
  return { quoteId: item.quoteId, priceSek: item.priceSek, storedValueAppliedOre: item.storedValueAppliedOre, remainingAmountOre: item.remainingAmountOre, expiresAt };
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

function ore(value: unknown): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function dateText(value: unknown): string | null {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) ? value : null;
}

/** Availability and expiry are evaluated by the backend in the venue's timezone. */
export function subscriptionCreditsFromWire(value: unknown): SubscriptionCreditFeed {
  const root = record(value);
  return {
    totalAvailableOre: ore(root.totalAvailableOre),
    credits: Array.isArray(root.credits) ? root.credits.flatMap((raw) => {
      const item = record(raw);
      if (typeof item.id !== "string" || typeof item.venueId !== "string") return [];
      return [{
        id: item.id,
        venueId: item.venueId,
        venueName: typeof item.venueName === "string" ? item.venueName : "The Beach",
        balanceOre: ore(item.balanceOre),
        availableOre: Math.min(ore(item.availableOre), ore(item.balanceOre)),
        validFrom: dateText(item.validFrom),
        expiresAt: dateText(item.expiresAt),
        status: typeof item.status === "string" ? item.status : "UNKNOWN",
      }];
    }) : [],
  };
}

export function availableSubscriptionCredit(feed: SubscriptionCreditFeed | null, venueId: string): number {
  if (!feed) return 0;
  return Math.min(feed.totalAvailableOre, feed.credits.reduce((sum, item) =>
    item.venueId === venueId && item.status === "ACTIVE" ? sum + item.availableOre : sum, 0));
}

export function creditMoney(amountOre: number, locale = "sv-SE"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "SEK", maximumFractionDigits: 2 }).format(amountOre / 100);
}
