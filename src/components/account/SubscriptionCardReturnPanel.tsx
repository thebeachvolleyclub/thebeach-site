"use client";

import { useEffect, useState } from "react";
import { subscriptionsFromWire, validSubscriptionId, type CourtSubscription } from "@/lib/accountSubscription.core";

type Phase = "checking" | "paid" | "pending" | "cancelled" | "unknown";

/**
 * HQ #296: return page after Stripe hosted Checkout for a court subscription.
 * Only the signed webhook marks the subscription paid; this page just polls
 * the subscription until it is ACTIVE and tells the customer what happened.
 */
export default function SubscriptionCardReturnPanel() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [item, setItem] = useState<CourtSubscription | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const raw = query.get("subscription_id") ?? "";
    const subscriptionId = validSubscriptionId(raw) ? raw : null;
    const cancelled = query.get("stripe") === "cancelled";
    let stopped = false;
    let attempts = 0;
    let timer: number | undefined;
    // Resolve the initial phase asynchronously so the effect only synchronizes
    // with the URL/network and never sets state synchronously during render.
    const settle = (next: Phase) => { timer = window.setTimeout(() => { if (!stopped) setPhase(next); }, 0); };
    if (!subscriptionId) { settle("unknown"); return () => { stopped = true; if (timer) window.clearTimeout(timer); }; }
    if (cancelled) { settle("cancelled"); return () => { stopped = true; if (timer) window.clearTimeout(timer); }; }
    const poll = async () => {
      attempts += 1;
      try {
        const response = await fetch("/api/account/subscriptions", { cache: "no-store" });
        if (response.ok) {
          const found = subscriptionsFromWire(await response.json()).find((candidate) => candidate.id === subscriptionId) ?? null;
          if (found) {
            setItem(found);
            if (found.status === "ACTIVE") { setPhase("paid"); return; }
          }
        }
      } catch {
        // Stripe may redirect before its signed webhook reaches us; keep polling.
      }
      if (stopped) return;
      if (attempts >= 45) { setPhase("pending"); return; }
      timer = window.setTimeout(poll, 2000);
    };
    void poll();
    return () => { stopped = true; if (timer) window.clearTimeout(timer); };
  }, []);

  const heading = phase === "paid" ? "Betalt och klart"
    : phase === "cancelled" ? "Kortbetalningen avbröts"
    : phase === "pending" ? "Vi bekräftar betalningen"
    : phase === "unknown" ? "Hittar inte abonnemanget"
    : "Vi bekräftar betalningen";
  const body = phase === "paid" && item
    ? `${item.termName}: ${item.seriesName || item.courtName} kl. ${item.startTime} är betalt. Dina tider finns under Mina bokningar.`
    : phase === "paid" ? "Abonnemanget är betalt och aktivt."
    : phase === "cancelled" ? "Inget har dragits. Du kan betala med Swish eller försöka med kort igen från Mitt konto."
    : phase === "pending" ? "Betalningen är mottagen men inte bekräftad ännu. Det brukar ta någon minut — abonnemanget visas som aktivt i Mitt konto så snart bekräftelsen kommit."
    : phase === "unknown" ? "Öppna Mitt konto för att se dina banabonnemang."
    : "Stripe har skickat dig tillbaka. Vi väntar på bekräftelsen från banken…";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-5 py-20">
      <section className="w-full border-2 border-lime bg-white p-8 text-black sm:p-12" data-phase={phase}>
        <span className="grid h-14 w-14 place-items-center rounded-full bg-black text-2xl text-lime" aria-hidden="true">{phase === "cancelled" ? "↩" : "✓"}</span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-black/45">Banabonnemang</p>
        <h1 className="mt-2 font-display text-4xl">{heading}</h1>
        <p className="mt-4 leading-relaxed text-black/60">{body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/konto#subscriptions" className="bg-black px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Öppna Mitt konto</a>
          {phase === "paid" ? <a href="/konto#bookings" className="border-2 border-black px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em]">Mina bokningar</a> : null}
        </div>
      </section>
    </main>
  );
}
