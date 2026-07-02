"use client";

import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react";
import { useRef } from "react";

const WORDS = [
  "Beachvolley",
  "Footvolley",
  "Beach tennis",
  "Event & företag",
  "Träning",
  "Sommar året runt",
];

// keep a value within [min, max)
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function Track({ baseVelocity = 1.4 }: { baseVelocity?: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smooth, [0, 1000], [0, 4], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) direction.current = -1;
    else if (velocityFactor.get() > 0) direction.current = 1;
    moveBy += direction.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  // duplicated runs so the loop never shows a gap
  const run = (key: string) =>
    WORDS.map((w, i) => (
      <span key={`${key}-${i}`} className="flex items-center">
        <span className="font-display text-bone">{w}</span>
        <span className="mx-8 text-brass sm:mx-12" aria-hidden="true">
          &#10022;
        </span>
      </span>
    ));

  return (
    <motion.div className="flex whitespace-nowrap" style={{ x }}>
      <div className="flex shrink-0">{run("a")}</div>
      <div className="flex shrink-0">{run("b")}</div>
    </motion.div>
  );
}

export default function Marquee() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Det vi gör"
      className="overflow-hidden border-y border-line bg-base py-7 text-3xl sm:py-9 sm:text-4xl"
    >
      {reduce ? (
        <div className="flex justify-center gap-10 px-4 text-center">
          {WORDS.slice(0, 4).map((w) => (
            <span key={w} className="font-display text-bone">
              {w}
            </span>
          ))}
        </div>
      ) : (
        <Track />
      )}
    </section>
  );
}
