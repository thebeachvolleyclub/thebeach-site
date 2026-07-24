"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Locale } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";

export default function TranaHero({ locale }: { locale: Locale }) {
  const t = tranaDict[locale].hero;
  const reduce = useReducedMotion();

  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[72svh] flex-col justify-end overflow-hidden bg-black px-5 pb-16 pt-32 sm:px-10 sm:pb-20 lg:px-14"
    >
      {/* Topo-line SVG decoration — lime, brand-kit pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.09]"
        viewBox="0 0 1200 520"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="#D8FF77" strokeWidth="1.3">
          <path d="M0 90 Q300 40 600 90 T1200 90" />
          <path d="M0 150 Q300 100 600 150 T1200 150" />
          <path d="M0 210 Q300 160 600 210 T1200 210" />
          <path d="M0 270 Q300 220 600 270 T1200 270" />
          <path d="M0 330 Q300 280 600 330 T1200 330" />
          <path d="M0 390 Q300 340 600 390 T1200 390" />
          <path d="M0 450 Q300 400 600 450 T1200 450" />
        </g>
      </svg>

      {/* Lime glow blob */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-lime/10 blur-[120px]" />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-[1500px]"
      >
        {/* Eyebrow */}
        <motion.p variants={item} className="eyebrow mb-5">
          {t.eyebrow}
        </motion.p>

        {/* Giant headline */}
        <motion.h1
          variants={item}
          className="font-display text-[clamp(2.75rem,11vw,7rem)] leading-[0.9] text-bone"
        >
          {t.title1}
          <br />
          <span className="italic-accent">{t.titleAccent}</span>
        </motion.h1>

        {/* Sub-copy + CTA */}
        <motion.div
          variants={item}
          className="mt-8 flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-end sm:justify-between sm:gap-10"
        >
          <div>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-bone/55">
              {t.intro}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
            <a
              href="#traningsgrupper"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              {t.ctaGroups} <span aria-hidden="true">→</span>
            </a>
            <Link
              href={t.ctaEventsHref}
              className="cursor-pointer text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-bone/55 underline-offset-4 transition-colors hover:text-bone hover:underline"
            >
              {t.ctaEvents}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
