"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertia / smooth scrolling — the single biggest "premium feel" lever.
 * Desktop wheel only (touch keeps native scroll, which feels better on phones),
 * and fully disabled when the user prefers reduced motion. Anchor links are
 * handled by Lenis so in-page jumps glide instead of snapping.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out expo
      smoothWheel: true,
      anchors: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
