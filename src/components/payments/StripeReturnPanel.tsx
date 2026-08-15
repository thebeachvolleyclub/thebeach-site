"use client";

import { useEffect, useState } from "react";
import {
  stripeBookingIsClosed,
  stripeBookingIsPaid,
  stripeReturnBooking,
  type StripeReturnBooking,
} from "@/lib/bookingStripeReturn.core";

export default function StripeReturnPanel({ mobile = false }: { mobile?: boolean }) {
  const [booking, setBooking] = useState<StripeReturnBooking | null>(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (mobile) {
      const timer = window.setTimeout(() => window.location.assign("thebeach://stripe-return"), 600);
      return () => window.clearTimeout(timer);
    }

    const rawBookingId = new URLSearchParams(window.location.search).get("booking_id");
    const bookingId = rawBookingId && /^[a-z0-9]{10,40}$/i.test(rawBookingId)
      ? rawBookingId
      : null;
    let stopped = false;
    let timer: number | undefined;
    const poll = async () => {
      try {
        const endpoint = bookingId
          ? `/api/booking/${encodeURIComponent(bookingId)}`
          : "/api/booking/mine";
        const response = await fetch(endpoint, { cache: "no-store" });
        if (!response.ok) throw new Error("Booking status unavailable");
        const candidate = stripeReturnBooking(await response.json(), bookingId);
        if (candidate) {
          setBooking(candidate);
          if (stripeBookingIsPaid(candidate)) return;
          if (stripeBookingIsClosed(candidate)) {
            setClosed(true);
            return;
          }
        }
      } catch {
        // Stripe may redirect before its signed webhook reaches us. Retrying
        // also covers a short staging API restart without showing a false fail.
      }
      if (!stopped) timer = window.setTimeout(poll, 2000);
    };
    poll();
    return () => {
      stopped = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [mobile]);

  const paid = booking ? stripeBookingIsPaid(booking) : false;
  const eyebrow = mobile
    ? "Betalningen är klar"
    : paid
      ? "Betalning registrerad"
      : "Betalning mottagen";
  const heading = mobile
    ? "Tillbaka till The Beach"
    : paid
      ? "Betalt och bokat"
      : closed
        ? "Betalningen kunde inte bekräftas"
        : "Vi bekräftar betalningen";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-5 py-20">
      <section className="w-full border-2 border-lime bg-white p-8 text-black sm:p-12">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-black text-2xl text-lime">✓</span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-black/45">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl">{heading}</h1>
        <p className="mt-4 leading-relaxed text-black/60">
          {mobile
            ? "Du skickas nu tillbaka till appen, där din bekräftade bokning visas. Om appen inte öppnas automatiskt kan du använda knappen nedan."
            : paid && booking
            ? `${booking.courtName}, ${booking.date} kl. ${booking.startTime}–${booking.endTime}. ${booking.priceSek} kr är betalt.`
            : closed
              ? "Bokningen är inte aktiv. Ingen ny betalning ska göras innan du har kontrollerat Mitt konto."
              : "Stripe har skickat betalningen till oss. Sidan uppdateras automatiskt när den signerade bekräftelsen är klar."}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {mobile ? (
            <a href="thebeach://stripe-return" className="inline-flex bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Öppna The Beach</a>
          ) : (
            <a href="/konto" className="bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Öppna Mitt konto</a>
          )}
          {!mobile ? <a href="/boka" className="border-2 border-black px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em]">Till bokningen</a> : null}
        </div>
      </section>
    </main>
  );
}
