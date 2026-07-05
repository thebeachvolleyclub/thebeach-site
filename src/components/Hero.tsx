"use client";

import { useRef } from "react";
import { useIsDesktop } from "./useIsMobile";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * HERO — mirrors the brand sketch.
 * Sunset photo, giant Acorn headline "DÄR DET / ALLTID / ÄR SOMMAR",
 * eyebrow chips, and a bottom info bar with the lime CTA.
 *
 *  Background: public/media/hero-sunset.webp  (swap to hero.mp4 if you want motion)
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);

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
      ref={ref}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black px-5 pb-16 pt-28 sm:px-10 sm:pb-20 lg:px-14"
    >
      {/* Background film with subtle parallax */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 z-0">
        {!desktop ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/media/hero-sunset.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/hero-sunset.webp"
            aria-hidden="true"
          >
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
        )}
      </motion.div>
      {/* legibility grades */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-[1500px]"
      >
        {/* eyebrow chips */}
        <motion.div
          variants={item}
          className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-lime"
        >
          <span>Beachvolley &amp; Event</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>Novavägen 35 · Huddinge</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>Sedan 2006</span>
        </motion.div>

        {/* giant headline */}
        <motion.h1
          variants={item}
          className="font-display text-[clamp(3.5rem,13vw,9.5rem)] leading-[0.88] text-white"
        >
          Där det
          <br />
          <span className="text-lime">Alltid</span>
          <br />
          Är sommar
        </motion.h1>

        {/* bottom info bar */}
        <motion.div
          variants={item}
          className="mt-9 flex flex-col gap-6 border-t border-white/15 pt-7 sm:flex-row sm:items-end sm:justify-between sm:gap-10"
        >
          <p className="max-w-md text-[0.95rem] leading-relaxed text-white/55">
            10 inomhusbanor, 7 utomhusbanor och ett community som ingen annan kan
            matcha. 15 min från Stockholm.
          </p>
          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
            <a
              href="#event"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Boka ett event <span aria-hidden="true">→</span>
            </a>
            <a
              href="https://www.matchi.se/facilities/thebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 border border-white/40 px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Boka bana <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
