export type SubscriptionSwishAttempt = {
  id: string;
  status: "CREATING" | "CREATED" | "PAID" | "DECLINED" | "ERROR" | "CANCELLED" | "RECONCILIATION_REQUIRED";
  amountOre: number;
  paymentVerificationPending: boolean;
  providerReference: string | null;
};

export type SubscriptionPayment = {
  subscriptionId: string;
  subscriptionStatus: string;
  orderStatus: string;
  paymentDueOn: string | null;
  paymentExpired: boolean;
  paymentMethod: string;
  paymentStatus: string;
  amountOre: number;
  swish: SubscriptionSwishAttempt | null;
  /** HQ #296: latest Stripe hosted Checkout attempt (secondary to Swish). */
  card: SubscriptionCardAttempt | null;
};

export type SubscriptionCardAttempt = {
  transactionId: string;
  status: "CREATING" | "CREATED" | "PAID" | "FAILED" | "EXPIRED";
  checkoutUrl: string | null;
};

export function subscriptionCardAttemptFromWire(value: unknown): SubscriptionCardAttempt | null {
  const item = record(value);
  const statuses = ["CREATING", "CREATED", "PAID", "FAILED", "EXPIRED"] as const;
  if (!statuses.includes(item.status as typeof statuses[number]) || typeof item.transactionId !== "string") return null;
  const checkoutUrl = nullableText(item.checkoutUrl);
  return {
    transactionId: item.transactionId,
    status: item.status as SubscriptionCardAttempt["status"],
    checkoutUrl: checkoutUrl && /^https:\/\/checkout\.stripe\.com\//.test(checkoutUrl) ? checkoutUrl : null,
  };
}

export type CourtSubscription = {
  id: string;
  termName: string;
  startsOn: string;
  endsOn: string;
  seriesName: string;
  courtName: string;
  weekday: number;
  startTime: string;
  durationMin: number;
  priceClass: string;
  pricePerOccurrenceOre: number;
  totalPriceOre: number;
  status: string;
  paymentDueOn: string | null;
  termsVersion: string;
  personalUseAccepted: boolean;
  payment: SubscriptionPayment;
  occurrences: Array<{ id: string; bookingId: string; date: string; startTime: string; courtName: string; status: string; creditAmountOre: number }>;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function nullableText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function finite(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function subscriptionSwishAttemptFromWire(value: unknown): SubscriptionSwishAttempt | null {
  const item = record(value);
  const statuses = ["CREATING", "CREATED", "PAID", "DECLINED", "ERROR", "CANCELLED", "RECONCILIATION_REQUIRED"] as const;
  if (!statuses.includes(item.status as typeof statuses[number]) || typeof item.id !== "string") return null;
  return {
    id: item.id,
    status: item.status as SubscriptionSwishAttempt["status"],
    amountOre: finite(item.amountOre),
    paymentVerificationPending: item.paymentVerificationPending === true,
    providerReference: nullableText(item.providerReference),
  };
}

export function subscriptionPaymentFromWire(
  value: unknown,
  subscriptionId: string,
  fallbackAmount: number,
): SubscriptionPayment {
  const item = record(value);
  return {
    subscriptionId: text(item.subscriptionId, subscriptionId),
    subscriptionStatus: text(item.subscriptionStatus),
    orderStatus: text(item.orderStatus),
    paymentDueOn: nullableText(item.paymentDueOn),
    paymentExpired: item.paymentExpired === true,
    paymentMethod: text(item.paymentMethod, "SWISH"),
    paymentStatus: text(item.paymentStatus, "SELECTED"),
    amountOre: finite(item.amountOre) || fallbackAmount,
    swish: subscriptionSwishAttemptFromWire(item.swish),
    card: subscriptionCardAttemptFromWire(item.card),
  };
}

export function subscriptionsFromWire(value: unknown): CourtSubscription[] {
  const root = record(value);
  if (!Array.isArray(root.subscriptions)) return [];
  return root.subscriptions.flatMap((candidate) => {
    const item = record(candidate);
    if (typeof item.id !== "string" || typeof item.status !== "string") return [];
    const amount = finite(item.totalPriceOre);
    return [{
      id: item.id,
      termName: text(item.termName, "Banabonnemang"),
      startsOn: text(item.startsOn),
      endsOn: text(item.endsOn),
      seriesName: text(item.seriesName),
      courtName: text(item.courtName),
      weekday: finite(item.weekday),
      startTime: text(item.startTime),
      durationMin: finite(item.durationMin),
      priceClass: text(item.priceClass),
      pricePerOccurrenceOre: finite(item.pricePerOccurrenceOre),
      totalPriceOre: amount,
      status: item.status,
      paymentDueOn: nullableText(item.paymentDueOn),
      termsVersion: text(item.termsVersion),
      personalUseAccepted: item.personalUseAccepted === true,
      payment: subscriptionPaymentFromWire(item.payment, item.id, amount),
      occurrences: Array.isArray(item.occurrences) ? item.occurrences.flatMap((raw) => {
        const occurrence = record(raw);
        return typeof occurrence.id === "string" ? [{
          id: occurrence.id,
          bookingId: text(occurrence.bookingId),
          date: text(occurrence.date),
          startTime: text(occurrence.startTime),
          courtName: text(occurrence.courtName),
          status: text(occurrence.status),
          creditAmountOre: finite(occurrence.creditAmountOre),
        }] : [];
      }) : [],
    }];
  });
}

export function subscriptionCanAccept(item: CourtSubscription): boolean {
  return item.status === "OFFERED" && Boolean(item.paymentDueOn) && !item.payment.paymentExpired;
}

function subscriptionPaymentOpen(item: CourtSubscription): boolean {
  return item.status === "AWAITING_PAYMENT"
    && !item.payment.paymentExpired
    && !["CREATING", "CREATED", "PAID", "RECONCILIATION_REQUIRED"].includes(item.payment.swish?.status ?? "");
}

/** Swish (primary). A card choice the customer never completed is switched back server-side. */
export function subscriptionCanPay(item: CourtSubscription): boolean {
  return subscriptionPaymentOpen(item)
    && item.payment.paymentStatus === "SELECTED"
    && ["SWISH", "CARD"].includes(item.payment.paymentMethod);
}

/** HQ #296: card via Stripe hosted Checkout (secondary). Same gates as Swish, plus an open link may be resumed. */
export function subscriptionCanPayByCard(item: CourtSubscription): boolean {
  if (!subscriptionPaymentOpen(item)) return false;
  if (subscriptionOpenCardCheckoutUrl(item)) return true;
  return item.payment.paymentStatus === "SELECTED" && ["SWISH", "CARD"].includes(item.payment.paymentMethod);
}

export function subscriptionOpenCardCheckoutUrl(item: CourtSubscription): string | null {
  const card = item.payment.card;
  if (!card || card.status !== "CREATED" || !card.checkoutUrl) return null;
  return item.payment.paymentMethod === "CARD" && item.payment.paymentStatus === "EXTERNAL_CREATED" ? card.checkoutUrl : null;
}

export function subscriptionPaymentNeedsPolling(item: CourtSubscription): boolean {
  return item.status === "AWAITING_PAYMENT"
    && ["CREATING", "CREATED"].includes(item.payment.swish?.status ?? "");
}

export function validSubscriptionId(value: string): boolean {
  return /^[A-Za-z0-9_-]{1,25}$/.test(value);
}

export function subscriptionOccurrenceCanRelease(
  item: CourtSubscription,
  occurrence: CourtSubscription["occurrences"][number],
  now = new Date(),
): boolean {
  if (item.status !== "ACTIVE" || occurrence.status !== "SCHEDULED") return false;
  // Court dates are Swedish wall time, regardless of the browser's timezone.
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const part = (name: string) => parts.find((value) => value.type === name)?.value ?? "";
  const localNow = `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(occurrence.date)
    && /^\d{2}:\d{2}$/.test(occurrence.startTime)
    && `${occurrence.date}T${occurrence.startTime}` > localNow;
}

// --- HQ #295: subscription times inside "Mina bokningar" ---

export type SubscriptionLinkedBooking = {
  status: string;
  subscriptionId?: string | null;
  subscriptionOccurrenceId?: string | null;
  subscriptionStatus?: string | null;
  subscriptionOccurrenceStatus?: string | null;
};

export type BookingOwnerAction =
  | { kind: "cancel" }
  | { kind: "release"; occurrenceId: string; subscriptionId: string }
  | { kind: "subscription-pending"; subscriptionId: string; label: string }
  | { kind: "none" };

/**
 * Decide what the owner may do with a booking row. Regular confirmed bookings
 * are cancelled; court-subscription times are never cancelled — they are
 * released via the subscription (credit rule) once the subscription is paid.
 */
export function bookingOwnerAction(booking: SubscriptionLinkedBooking): BookingOwnerAction {
  if (booking.status !== "CONFIRMED") return { kind: "none" };
  const subscriptionId = booking.subscriptionId ?? null;
  const occurrenceId = booking.subscriptionOccurrenceId ?? null;
  if (!subscriptionId || !occurrenceId) return { kind: "cancel" };
  if (booking.subscriptionStatus === "ACTIVE") {
    return booking.subscriptionOccurrenceStatus === "SCHEDULED"
      ? { kind: "release", occurrenceId, subscriptionId }
      : { kind: "none" };
  }
  if (booking.subscriptionStatus === "OFFERED" || booking.subscriptionStatus === "AWAITING_PAYMENT") {
    return { kind: "subscription-pending", subscriptionId, label: "Ingår i banabonnemang · väntar på betalning" };
  }
  return { kind: "none" };
}

export const SUBSCRIPTION_RELEASE_CONFIRM_TEXT = (courtName: string, date: string, startTime: string) =>
  `Släppa ${courtName} den ${date} kl. ${startTime}? Tiden blir tillgänglig för andra. Om den säljs och betalas får du 90 % av försäljningspriset i personlig kredit, minst 50 % och högst 100 % av ditt ursprungliga pris. Krediten gäller i 12 månader.`;
