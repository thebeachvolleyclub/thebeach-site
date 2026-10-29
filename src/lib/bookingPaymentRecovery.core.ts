/** Reservation state must never be mistaken for proof that no money moved. */
export type BookingPaymentState = {
  booking: { status: string; paymentStatus?: string };
  paymentStatus?: string | null;
  paymentError?: string | null;
  paymentReviewRequired?: boolean;
  paymentVerificationPending?: boolean;
  customerMessage?: string | null;
};

export function bookingPaymentNotice(value: BookingPaymentState, locale: "sv" | "en" = "sv") {
  const sv = locale === "sv";
  if (value.booking.paymentStatus === "REFUNDED") return { keepAttempt: false, complete: false, message: sv ? "Betalningen har återbetalats. Bokningen är avslutad." : "The payment has been refunded. The booking is closed." };
  const paid = value.paymentStatus === "PAID" || value.booking.paymentStatus === "PAID";
  if (value.paymentReviewRequired || (paid && ["EXPIRED", "CANCELLED"].includes(value.booking.status))) return {
    keepAttempt: true, complete: false,
    message: paid
      ? (sv ? "Betalningen har kommit in men bokningen är inte bekräftad. Kontakta receptionen innan du betalar igen." : "Payment was received, but the booking is not confirmed. Contact reception before paying again.")
      : (sv ? "Betalningen måste kontrolleras av receptionen. Starta inte en ny betalning." : "Reception must check the payment. Do not start another payment."),
  };
  if (value.booking.status === "CONFIRMED") return { keepAttempt: false, complete: true, message: "" };
  if (["EXPIRED", "CANCELLED"].includes(value.booking.status)) return { keepAttempt: false, complete: false, message: sv ? (value.paymentError || "Betalningen slutfördes inte. Bokningen är avslutad.") : "The payment was not completed. The booking is closed." };
  return { keepAttempt: true, complete: false, message: sv ? (value.customerMessage || "Bokningen uppdateras automatiskt när betalningsbeskedet kommer. Starta inte en ny betalning.") : "Your booking updates automatically when the payment result arrives. Do not start another payment." };
}

export function safeBookingPaymentUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.stripe.com" && !url.username && !url.password;
  } catch { return false; }
}

export function bookingFailureProvesNoAllocation(status: number, code: string): boolean {
  return [409, 422].includes(status) && ["PRICE_CHANGED", "QUOTE_EXPIRED", "SLOT_TAKEN", "SUBSCRIPTION_CREDIT_CHANGED"].includes(code);
}

export function checkoutBookingId(value: unknown): string {
  if (typeof value !== "string" || !value.trim() || value.length > 100) throw new Error("The booking result was incomplete");
  return value;
}

/** Retry the same authorized submission only; this never creates a new key. */
export function startBookingRecovery(options: {
  current: () => boolean;
  recover: () => Promise<boolean>;
  exhausted: () => void;
  schedule?: (run: () => void, delay: number) => ReturnType<typeof setTimeout>;
  cancel?: (timer: ReturnType<typeof setTimeout>) => void;
}) {
  const schedule = options.schedule ?? setTimeout;
  const cancel = options.cancel ?? clearTimeout;
  const delays = [0, 1000, 2000, 4000, 8000];
  let timer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  let inFlight = false;
  let attempt = 0;
  const run = async () => {
    timer = undefined;
    if (stopped || inFlight || !options.current()) return;
    inFlight = true;
    let complete = false;
    try { complete = await options.recover(); } catch { /* Preserve uncertain submissions. */ }
    finally { inFlight = false; }
    if (complete) stopped = true;
    if (stopped || !options.current()) return;
    attempt += 1;
    if (attempt >= delays.length) options.exhausted();
    else timer = schedule(() => { void run(); }, delays[attempt]);
  };
  timer = schedule(() => { void run(); }, 0);
  return () => { stopped = true; if (timer !== undefined) cancel(timer); };
}
