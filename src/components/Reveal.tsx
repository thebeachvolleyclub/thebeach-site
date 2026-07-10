"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import useIsMobile from "./useIsMobile";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** seconds of delay — use index * 0.08 for staggered grids */
  delay?: number;
  /** distance travelled on entrance (px) */
  y?: number;
  /** how far into view before triggering */
  once?: boolean;
};

/**
 * Seamless scroll-reveal. Fades + lifts content into place when it enters
 * the viewport. Honors reduced-motion.
 *
 * MOBILE: swipe-scroll är snabbare än desktop-scroll — därför triggar vi
 * tidigt (innan elementet syns), kör kort duration och hoppar över blur.
 * Långsam desktop-reveal på mobil = "tomma block"-känsla. Ändra inte utan
 * att testa på riktig telefon.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();

  const initial = reduce
    ? { opacity: 0 }
    : mobile
      ? { opacity: 0, y: 10 }
      : { opacity: 0, y, filter: "blur(6px)" };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{
        once,
        // mobil: börja intoningen 25% av skärmhöjden INNAN elementet syns
        margin: mobile ? "0px 0px 25% 0px" : "-80px",
      }}
      transition={{
        duration: mobile ? 0.35 : 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : mobile ? Math.min(delay, 0.15) : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
