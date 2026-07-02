"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

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
 * Seamless scroll-reveal. Fades + lifts content into place with an
 * ease-out curve when it enters the viewport. Honors reduced-motion.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduce ? { opacity: 0 } : { opacity: 0, y, filter: "blur(6px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
