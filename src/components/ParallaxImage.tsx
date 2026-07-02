"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Background image that drifts slower than the scroll for cinematic depth.
 * The image is oversized so the vertical travel never exposes an edge.
 * Drop-in for an absolutely-positioned background layer.
 */
export default function ParallaxImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : ["-10%", "10%"],
  );

  return (
    <div ref={ref} className="absolute inset-0 -z-10 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        loading="lazy"
        className={`absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover object-center ${className ?? ""}`}
      />
    </div>
  );
}
