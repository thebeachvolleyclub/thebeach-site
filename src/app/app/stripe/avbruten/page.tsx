import type { Metadata } from "next";

export const metadata: Metadata = { title: "Betalning avbruten", robots: { index: false, follow: false } };

export default function MobileStripePaymentCancelledPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-5 py-20">
      <section className="w-full border border-black/15 bg-white p-8 text-black sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/45">Betalningen avbröts</p>
        <h1 className="mt-2 font-display text-4xl">Inget kort debiterades</h1>
        <p className="mt-4 text-black/60">Du kan återvända och försöka igen eller välja Swish.</p>
        <a href="thebeach://stripe-return" className="mt-7 inline-flex bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Tillbaka till appen</a>
      </section>
    </main>
  );
}
