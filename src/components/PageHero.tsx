"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Gemensam hero för undersidor (skola, om oss, barnkalas, julbord m.fl.).
 * Samma formspråk som TranaHero: mörk bas, topo-linjer, lime-blob,
 * jätterubrik + intro + CTA-yta.
 */
export default function PageHero({
  eyebrow,
  title,
  intro,
  cta,
  minH = "min-h-[62svh]",
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  cta?: ReactNode;
  minH?: string;
}) {
  const reduce = useReducedMotion();

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.1 } },
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
      className={`relative isolate flex ${minH} flex-col justify-end overflow-hidden bg-base px-5 pb-16 pt-32 sm:px-10 sm:pb-20 lg:px-14`}
    >
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
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-lime/10 blur-[120px]" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-[1500px]"
      >
        <motion.p variants={item} className="eyebrow mb-5">
          {eyebrow}
        </motion.p>
        <motion.h1
          variants={item}
          className="font-display text-[clamp(2.75rem,11vw,7rem)] leading-[0.9] text-bone"
        >
          {title}
        </motion.h1>
        <motion.div
          variants={item}
          className="mt-8 flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-end sm:justify-between sm:gap-10"
        >
          <p className="max-w-md text-[0.95rem] leading-relaxed text-bone/55">
            {intro}
          </p>
          {cta ? (
            <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
              {cta}
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </section>
  );
}
