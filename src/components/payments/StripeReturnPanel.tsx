"use client";

import { useEffect } from "react";

export default function StripeReturnPanel({ mobile = false }: { mobile?: boolean }) {
  useEffect(() => {
    if (!mobile) return;
    const timer = window.setTimeout(() => window.location.assign("thebeach://stripe-return"), 600);
    return () => window.clearTimeout(timer);
  }, [mobile]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-5 py-20">
      <section className="w-full border-2 border-lime bg-white p-8 text-black sm:p-12">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-black text-2xl text-lime">✓</span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-black/45">Betalning mottagen</p>
        <h1 className="mt-2 font-display text-4xl">Vi bekräftar betalningen</h1>
        <p className="mt-4 leading-relaxed text-black/60">
          Stripe har skickat betalningen till oss. Bokningen eller fakturan uppdateras automatiskt när bekräftelsen är klar.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          {mobile ? (
            <a href="thebeach://stripe-return" className="bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Tillbaka till appen</a>
          ) : (
            <a href="/konto" className="bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Öppna Mitt konto</a>
          )}
          <a href="/boka" className="border-2 border-black px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em]">Till bokningen</a>
        </div>
      </section>
    </main>
  );
}
