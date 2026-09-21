"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { creditMoney, subscriptionCreditsFromWire, type SubscriptionCreditFeed } from "@/lib/subscriptionCredit.core";

export default function SubscriptionCreditPanel() {
  const [feed, setFeed] = useState<SubscriptionCreditFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestGeneration = useRef(0);
  const refresh = useCallback(async (signal?: AbortSignal) => {
    const generation = ++requestGeneration.current;
    const stale = () => signal?.aborted || generation !== requestGeneration.current;
    setLoading(true);
    try {
      const response = await fetch("/api/account/subscriptions/credits", { cache: "no-store", signal });
      if (!response.ok) throw new Error("Ditt tillgodohavande kunde inte hämtas. Försök igen.");
      const next = subscriptionCreditsFromWire(await response.json());
      if (stale()) return;
      setFeed(next);
      setError("");
    } catch (cause) {
      if (stale()) return;
      setFeed(null);
      setError(cause instanceof Error ? cause.message : "Ditt tillgodohavande kunde inte hämtas.");
    } finally {
      if (!stale()) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void refresh(controller.signal), 0);
    const onFocus = () => void refresh(controller.signal);
    window.addEventListener("focus", onFocus);
    return () => { controller.abort(); window.clearTimeout(timer); window.removeEventListener("focus", onFocus); };
  }, [refresh]);

  return <section className="border-x border-b border-black/10 bg-mint p-6 sm:p-8" aria-label="Abonnemangskredit">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">Ditt tillgodohavande</p><h3 className="mt-2 font-display text-3xl">{loading ? "Hämtar…" : feed ? creditMoney(feed.totalAvailableOre) : "Saldo ej tillgängligt"}</h3></div>
      <button type="button" disabled={loading} onClick={() => void refresh()} className="min-h-11 cursor-pointer px-3 text-xs font-bold uppercase underline underline-offset-4 disabled:opacity-40">Uppdatera saldo</button>
    </div>
    {error ? <p role="alert" className="mt-4 text-sm text-orange">{error}</p> : null}
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-black/65">När din frigjorda abonnemangstid säljs och betalas får du 90 % av försäljningspriset i tillgodohavande, minst 50 % och högst 100 % av ditt ursprungliga pris. Krediten är personlig och gäller i 12 månader.</p>
    {feed?.credits.length ? <ul className="mt-5 divide-y divide-black/10 border-y border-black/10">{feed.credits.map((item) => <li key={item.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
      <span><strong className="block">{item.venueName}</strong><span className="text-black/60">{item.expiresAt ? `Gäller till ${item.expiresAt.slice(0, 10)}` : "Inget slutdatum"}{!item.availableOre ? " · Ej tillgängligt" : ""}</span></span>
      <span className="font-semibold">{creditMoney(item.balanceOre)}</span>
    </li>)}</ul> : !loading && feed ? <p className="mt-4 text-sm text-black/60">Du har ännu ingen abonnemangskredit.</p> : null}
    {feed && feed.totalAvailableOre > 0 ? <Link href="/boka" className="mt-5 inline-flex min-h-12 items-center bg-black px-6 text-xs font-bold uppercase tracking-wide text-lime">Boka med tillgodohavande</Link> : null}
  </section>;
}
