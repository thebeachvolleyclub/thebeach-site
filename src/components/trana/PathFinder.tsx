"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { tranaDict, type PathRec } from "@/lib/i18n/trana";

/**
 * "Hitta din väg" — hjälper nya besökare direkt till rätt spår.
 * Två frågor (ålder + erfarenhet) → rekommendation med rätt CTA.
 */

type Age = "under21" | "adult";
type Exp = "never" | "comeback" | "regular";

const PATH_KEY: Record<Age, Record<Exp, keyof typeof tranaDict.sv.pathfinder.paths>> = {
  under21: { never: "under21Never", comeback: "under21Comeback", regular: "under21Regular" },
  adult: { never: "adultNever", comeback: "adultComeback", regular: "adultRegular" },
};

export default function PathFinder({ locale }: { locale: Locale }) {
  const t = tranaDict[locale].pathfinder;
  const [age, setAge] = useState<Age | null>(null);
  const [exp, setExp] = useState<Exp | null>(null);
  const path: PathRec | null = age && exp ? t.paths[PATH_KEY[age][exp]] : null;

  const AGE_OPTIONS: { value: Age; label: string }[] = [
    { value: "under21", label: t.ageOptions.under21 },
    { value: "adult", label: t.ageOptions.adult },
  ];

  const EXP_OPTIONS: { value: Exp; label: string }[] = [
    { value: "never", label: t.expOptions.never },
    { value: "comeback", label: t.expOptions.comeback },
    { value: "regular", label: t.expOptions.regular },
  ];

  const pill = (active: boolean) =>
    `min-h-[44px] cursor-pointer border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-colors ${
      active
        ? "border-lime bg-lime text-black"
        : "border-white/20 bg-transparent text-white/70 hover:border-white/50 hover:text-white"
    }`;

  return (
    <section id="hitta-din-vag" className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <Reveal className="mb-10 lg:mb-12">
        <p className="eyebrow mb-4">{t.eyebrow}</p>
        <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] text-white lg:text-[clamp(3rem,5.5vw,5rem)]">
          {t.title}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
          {t.lead}
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-8">
          <Reveal>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              {t.q1}
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
              {t.q2}
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
                {t.placeholder}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
