"use client";

import { useEffect, useState } from "react";

type Item = { month: string; day: string; wd: string; title: string; badge: string; text: string };

/** Roterar skärmbilder var 12:e sekund — för Smartsign/anläggningsskärmarna. */
export default function SkarmRotator({ items }: { items: Item[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 12000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0)
    return <div className="flex h-screen w-screen items-center justify-center bg-[#14160F] font-display text-4xl uppercase text-lime">The Beach</div>;

  const ev = items[i];
  return (
    <div key={i} className="relative flex h-screen w-screen flex-col justify-between overflow-hidden bg-[#14160F] p-[4vw]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 1200 520" preserveAspectRatio="none" aria-hidden="true">
        <g fill="none" stroke="#D8FF77" strokeWidth="1.3">
          <path d="M0 90 Q300 40 600 90 T1200 90" />
          <path d="M0 210 Q300 160 600 210 T1200 210" />
          <path d="M0 330 Q300 280 600 330 T1200 330" />
          <path d="M0 450 Q300 400 600 450 T1200 450" />
        </g>
      </svg>
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-display text-[2vw] uppercase text-lime">The Beach</span>
        <span className="bg-lime px-[1.2vw] py-[0.5vw] text-[1.1vw] font-bold uppercase tracking-[0.15em] text-black">
          {ev.badge}
        </span>
      </div>
      <div className="relative z-10">
        <p className="mb-[1vw] text-[1.6vw] font-bold uppercase tracking-[0.25em] text-lime">
          {ev.wd} {ev.day} {ev.month}
        </p>
        <h1 className="font-display text-[7vw] uppercase leading-[0.9] text-white">{ev.title}</h1>
        <p className="mt-[1.5vw] max-w-[60vw] text-[1.8vw] leading-snug text-white/60">{ev.text}</p>
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[1.4vw] text-white/40">thebeach.se/kalender</span>
        <div className="flex items-center gap-[0.6vw]">
          {items.map((_, d) => (
            <span key={d} className={`h-[0.5vw] rounded-full ${d === i ? "w-[2.2vw] bg-lime" : "w-[0.5vw] bg-white/25"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
