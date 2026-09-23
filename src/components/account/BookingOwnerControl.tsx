"use client";

import { bookingOwnerAction, type SubscriptionLinkedBooking } from "@/lib/accountSubscription.core";

export type OwnerControlBooking = SubscriptionLinkedBooking & { id: string };

/**
 * HQ #295: the one action a customer may take on a booking row in Mina bokningar.
 * Regular bookings → "Avboka". Paid court-subscription times → "Släpp tiden"
 * (credit rule). Unpaid subscription times → a hint that points to the subscription.
 */
export default function BookingOwnerControl<T extends OwnerControlBooking>({ booking, onAction, busy, className, longLabel }: {
  booking: T;
  onAction: (booking: T) => void;
  busy: boolean;
  className?: string;
  longLabel?: boolean;
}) {
  const action = bookingOwnerAction(booking);
  if (action.kind === "none") return null;
  if (action.kind === "subscription-pending") {
    return <div className={`text-xs ${className ?? ""}`} data-owner-action="subscription-pending">
      <span className="block font-bold uppercase tracking-[0.08em] text-teal">{action.label}</span>
      <button type="button" onClick={() => onAction(booking)} className="mt-1 cursor-pointer text-black/60 underline underline-offset-4 hover:text-black">Öppna abonnemanget</button>
    </div>;
  }
  const label = action.kind === "release"
    ? (busy ? "Släpper…" : "Släpp tiden")
    : (busy ? "Avbokar…" : longLabel ? "Avboka bokning" : "Avboka");
  return <div className={className} data-owner-action={action.kind}>
    <button type="button" onClick={() => onAction(booking)} disabled={busy} className="min-h-10 w-full cursor-pointer border border-orange px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-orange transition-colors hover:bg-orange hover:text-white disabled:cursor-wait disabled:opacity-50 sm:w-auto">{label}</button>
    {action.kind === "release" ? <span className="mt-1 block text-xs text-black/45">Abonnemangstid · släpps med tillgodo, avbokas inte</span> : null}
  </div>;
}
