/** Keep one exact payment submission until its outcome is known. */
export type BookingCreditAttempt = {
  ownerId: string;
  courtName: string;
  body: {
    venueId: string;
    courtId: string;
    date: string;
    startTime: string;
    productId?: string | null;
    quoteId: string;
    streamRequested: boolean;
    paymentProvider: "SWISH" | "STRIPE";
    useStoredValue: boolean;
    expectedStoredValueAppliedOre: number;
    expectedRemainingAmountOre: number;
    clientReference: string;
  };
};

export function bookingCreditAttemptFromStorage(raw: string | null, ownerId: string): BookingCreditAttempt | null {
  if (!raw || raw.length > 8000) return null;
  try {
    const item = JSON.parse(raw);
    const body = item?.body;
    if (item?.ownerId !== ownerId || typeof item.courtName !== "string" || !body
      || !["venueId", "courtId", "date", "startTime", "quoteId", "clientReference"].every((key) => typeof body[key] === "string" && body[key].length > 0 && body[key].length <= 100)
      || !["SWISH", "STRIPE"].includes(body.paymentProvider)
      || typeof body.useStoredValue !== "boolean" || typeof body.streamRequested !== "boolean"
      || !Number.isSafeInteger(body.expectedStoredValueAppliedOre) || body.expectedStoredValueAppliedOre < 0
      || !Number.isSafeInteger(body.expectedRemainingAmountOre) || body.expectedRemainingAmountOre < 0) return null;
    return item as BookingCreditAttempt;
  } catch { return null; }
}

export function bookingCreditAttemptKey(ownerId: string): string {
  return `tb-booking-attempt:${ownerId}`;
}
