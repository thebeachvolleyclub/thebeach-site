"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

/**
 * "Hitta din väg" — hjälper nya besökare direkt till rätt spår.
 * Två frågor (ålder + erfarenhet) → rekommendation med rätt CTA.
 */

type Age = "under21" | "adult";
type Exp = "never" | "comeback" | "regular";

type Path = {
  title: string;
  body: string;
  ctas: { label: string; href: string; external?: boolean }[];
  note?: string;
};

function getPath(age: Age, exp: Exp): Path {
  if (age === "under21") {
    return {
      title: "Du kan välja båda spåren",
      body:
        exp === "regular"
          ? "Under 21 och spelar redan? Juniorträningen via klubben tränar hela terminen med jämnåriga — eller sikta på träningsgrupperna (anmälan öppnar 1 aug 20:00)."
          : "Under 21? Du har två vägar in — juniorträning via klubben (terminsanmälan, lägre pris, medlemskap i föreningen) eller grundkursen som är öppen för alla åldrar (5 kvällspass på tisdagar eller torsdagar). Välj det som passar dig bäst.",
      ctas:
        exp === "regular"
          ? [
              { label: "Juniorträning via Svenska Lag", href: "https://www.svenskalag.se/thebeach", external: true },
              { label: "Se träningsgrupperna", href: "#traningsgrupper" },
            ]
          : [
              { label: "Juniorträning via Svenska Lag", href: "https://www.svenskalag.se/thebeach", external: true },
              { label: "Grundkursen", href: "#kurser" },
            ],
    };
  }
  if (exp === "never") {
    return {
      title: "Grundkursen är din väg in",
      body:
        "5 pass × 1,5 h där du lär dig teknik, fotarbete, taktik och spel från grunden. Ingen erfarenhet krävs — ta bara med motivation.",
      ctas: [{ label: "Se grundkursen", href: "#kurser" }],
    };
  }
  if (exp === "comeback") {
    return {
      title: "Fortsättningskursen — perfekt för comeback",
      body:
        "Spelat förr men det var länge sen? Du behöver inte börja om från noll. Fortsättningskursen fräschar upp grunderna och tar dig vidare i matchtempo — de flesta comeback-spelare landar rätt här.",
      ctas: [{ label: "Se fortsättningskursen", href: "#kurser" }],
      note: "Osäker på nivån? Mejla traning@thebeach.one så hjälper vi dig välja.",
    };
  }
  return {
    title: "Träningsgrupperna är nästa steg",
    body:
      "Spelar du regelbundet placeras du i en grupp som matchar din nivå — jämna grupper, 15 pass per säsong. Anmälan öppnar 1 aug kl 20:00.",
    ctas: [{ label: "Se träningsgrupperna", href: "#traningsgrupper" }],
  };
}

const AGE_OPTIONS: { value: Age; label: string }[] = [
  { value: "under21", label: "Under 21 år" },
  { value: "adult", label: "21 år eller äldre" },
];

const EXP_OPTIONS: { value: Exp; label: string }[] = [
  { value: "never", label: "Aldrig spelat" },
  { value: "comeback", label: "Spelat förr — men det var ett tag sen" },
  { value: "regular", label: "Spelar regelbundet" },
];

export default function PathFinder() {
  const [age, setAge] = useState<Age | null>(null);
  const [exp, setExp] = useState<Exp | null>(null);
  const path = age && exp ? getPath(age, exp) : null;

  const pill = (active: boolean) =>
    `min-h-[44px] cursor-pointer border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${
      active
        ? "border-lime bg-lime text-black"
        : "border-white/20 bg-transparent text-white/70 hover:border-white/50 hover:text-white"
    }`;

  return (
    <section id="hitta-din-vag" className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <Reveal className="mb-10 lg:mb-12">
        <p className="eyebrow mb-4">Ny här?</p>
        <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] text-white lg:text-[clamp(3rem,5.5vw,5rem)]">
          Hitta din väg
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
          Två snabba frågor — så pekar vi direkt på rätt kurs eller grupp för dig.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-8">
          <Reveal>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              1. Hur gammal är du?
            </p>
            <div className="flex flex-wrap gap-2">
              {AGE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setAge(o.value)}
                  aria-pressed={age === o.value}
                  className={pill(age === o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              2. Har du spelat beachvolley?
            </p>
            <div className="flex flex-wrap gap-2">
              {EXP_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setExp(o.value)}
                  aria-pressed={exp === o.value}
                  className={pill(exp === o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div
            aria-live="polite"
            className={`flex h-full min-h-[220px] flex-col justify-between border p-7 transition-colors lg:p-10 ${
              path ? "border-lime/60 bg-white/[0.04]" : "border-white/10 bg-transparent"
            }`}
          >
            {path ? (
              <>
                <div>
                  <h3 className="mb-3 font-display text-2xl uppercase leading-none text-white lg:text-3xl">
                    {path.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">{path.body}</p>
                  {path.note && (
                    <p className="mt-3 text-[12px] leading-snug text-white/40">{path.note}</p>
                  )}
                </div>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {path.ctas.map((c) => (
                    <a
                      key={c.href}
                      href={c.href}
                      {...(c.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="inline-flex min-h-[44px] items-center gap-2 bg-lime px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-opacity hover:opacity-80"
                    >
                      {c.label} <span aria-hidden="true">→</span>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <p className="m-auto max-w-[220px] text-center text-sm leading-relaxed text-white/30">
                Svara på frågorna så visar vi din väg in i sanden.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
