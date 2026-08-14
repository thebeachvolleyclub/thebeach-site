export type StripeReturnBooking = {
  id: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  priceSek: number;
  createdAt: string;
};

function isBooking(value: unknown): value is StripeReturnBooking {
  if (!value || typeof value !== "object") return false;
  const booking = value as Partial<StripeReturnBooking>;
  return typeof booking.id === "string"
    && typeof booking.status === "string"
    && typeof booking.paymentMethod === "string"
    && typeof booking.paymentStatus === "string"
    && typeof booking.courtName === "string"
    && typeof booking.date === "string"
    && typeof booking.startTime === "string"
    && typeof booking.endTime === "string"
    && typeof booking.priceSek === "number"
    && typeof booking.createdAt === "string";
}

export function stripeReturnBooking(
  payload: unknown,
  requestedBookingId: string | null,
): StripeReturnBooking | null {
  const root = payload && typeof payload === "object"
    ? payload as { booking?: unknown }
    : null;
  if (root && isBooking(root.booking)) {
    return !requestedBookingId || root.booking.id === requestedBookingId
      ? root.booking
      : null;
  }
  if (!Array.isArray(payload)) return null;
  const candidates = payload.filter(isBooking).filter((booking) => (
    booking.paymentMethod.toUpperCase() === "STRIPE"
    && (!requestedBookingId || booking.id === requestedBookingId)
  ));
  return candidates.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null;
}

export function stripeBookingIsPaid(booking: StripeReturnBooking): boolean {
  return booking.status.toUpperCase() === "CONFIRMED"
    && booking.paymentStatus.toUpperCase() === "PAID";
}

export function stripeBookingIsClosed(booking: StripeReturnBooking): boolean {
  return ["EXPIRED", "CANCELLED"].includes(booking.status.toUpperCase());
}
