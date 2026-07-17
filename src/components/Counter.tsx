"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Räknar upp till `to` när elementet kommer i vy. Robust på mobil:
 *  native IntersectionObserver + fallback om elementet redan syns +
 *  säkerhetsnät som garanterar slutvärdet (aldrig kvar på 0). */
export default function Counter({
  to,
  suffix = "",
  duration = 1.5,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const run = () => {
      if (started.current) return;
      started.current = true;
      if (reduce) {
        setVal(to);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(eased * to));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Ingen IntersectionObserver (äldre webbläsare) → visa slutvärdet direkt.
    if (typeof IntersectionObserver === "undefined") {
      run();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    // Fallback: redan i vy vid mount (t.ex. kort mobilskärm) → starta ändå.
    const fallback = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh && r.bottom > 0) run();
    }, 600);

    // Säkerhetsnät: landa aldrig på 0 om inget triggat inom 4 s.
    const safety = window.setTimeout(() => {
      if (!started.current) {
        started.current = true;
        setVal(to);
      }
    }, 4000);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      clearTimeout(safety);
    };
  }, [to, duration, reduce]);

  return (
    <span ref={ref}>
      {val.toLocaleString("sv-SE")}
      {suffix}
    </span>
  );
}
