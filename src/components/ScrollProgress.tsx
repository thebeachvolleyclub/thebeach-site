"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Thin brass reading-progress bar pinned to the very top — a quiet,
 * premium signal of how far through the page you are.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      style={{ scaleX }}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brass to-brass-bright"
    />
  );
}
