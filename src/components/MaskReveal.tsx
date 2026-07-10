"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import useIsMobile from "./useIsMobile";

/**
 * Headline mask reveal — text slides up from behind a clipped edge.
 * The crafted alternative to fade-up. Wrap inside an <h1>/<h2>.
 *
 * NOTE: the in-view observer is attached to the STABLE outer wrapper, not the
 * translated inner span — observing the transformed element makes the viewport
 * detector mis-read its position and the reveal can get stuck off-screen.
 *
 * MOBILE: tidigare trigger + snabbare glid, se kommentar i Reveal.tsx.
 */
export default function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, {
    once: true,
    margin: mobile ? "0px 0px 15% 0px" : "0px 0px -12% 0px",
  });

  if (reduce) return <span className={className}>{children}</span>;

  return (
    // extra bottom room so descenders (g, p, å) aren't clipped, cancelled in layout
    <span
      ref={ref}
      className={`block overflow-hidden pb-[0.18em] -mb-[0.18em] ${className ?? ""}`}
    >
      <motion.span
        className="block"
        initial={{ y: "118%" }}
        animate={inView ? { y: "0%" } : { y: "118%" }}
        transition={{
          duration: mobile ? 0.5 : 0.95,
          ease: [0.22, 1, 0.36, 1],
          delay: mobile ? Math.min(delay, 0.1) : delay,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
