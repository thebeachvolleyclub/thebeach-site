"use client";

import { useState } from "react";
import {
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { Check, ArrowRight } from "./icons";

export type Pkg = {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  popular?: boolean;
};

/* ---- shared card ---------------------------------------------------- */
function PackageCard({ pkg, lift = false }: { pkg: Pkg; lift?: boolean }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-3xl p-8 ${
        pkg.popular
          ? `bg-bone text-base shadow-2xl shadow-black/40 ring-1 ring-brass/40 ${
              lift ? "lg:-mt-5 lg:mb-[-1.25rem]" : ""
            }`
          : "border border-line bg-panel-2 text-bone"
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-3 left-8 rounded-full bg-brass px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-base">
          Populärast
        </span>
      )}

      <h3 className={`font-display text-3xl ${pkg.popular ? "text-base" : "text-bone"}`}>
        {pkg.name}
      </h3>
      <p className={`mt-1.5 text-sm ${pkg.popular ? "text-base/70" : "text-bone/65"}`}>
        {pkg.tagline}
      </p>

      <div className="mt-7 flex items-baseline gap-1.5">
        <span
          className={`font-display text-6xl leading-none ${
            pkg.popular ? "text-base" : "text-brass"
          }`}
        >
          {pkg.price}
        </span>
        <span className={`text-sm ${pkg.popular ? "text-base/70" : "text-bone/65"}`}>
          kr / pers
        </span>
      </div>

      <ul className="mt-8 flex-1 space-y-3.5">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <Check
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                pkg.popular ? "text-base/80" : "text-seafoam"
              }`}
            />
            <span className={pkg.popular ? "text-base/80" : "text-bone/70"}>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href="#kontakt"
        className={`group mt-9 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${
          pkg.popular
            ? "bg-black text-bone hover:bg-panel"
            : "border border-bone/25 text-bone hover:border-brass hover:text-brass"
        }`}
      >
        Boka event
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </article>
  );
}

/* ---- carousel ------------------------------------------------------- */
export default function PackageCarousel({ packages }: { packages: Pkg[] }) {
  const n = packages.length;
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  const next = () => setActive((a) => (a + 1) % n);
  const prev = () => setActive((a) => (a - 1 + n) % n);

  // signed shortest distance from active → slot (-1 left, 0 centre, 1 right)
  const slot = (i: number) => {
    let d = (i - active) % n;
    if (d < 0) d += n;
    if (d > n / 2) d -= n;
    return d;
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (offset.x < -50 || velocity.x < -400) next();
    else if (offset.x > 50 || velocity.x > 400) prev();
  };

  const spring = reduce
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 320, damping: 36 };

  return (
    <>
      {/* MOBILE — infinite rotor: centre card locks, neighbours peek both sides */}
      <div className="lg:hidden">
        <motion.div
          className="relative grid select-none pt-3"
          drag="x"
          dragSnapToOrigin
          dragElastic={0.16}
          onDragEnd={onDragEnd}
          style={{ touchAction: "pan-y" }}
        >
          {packages.map((pkg, i) => {
            const p = slot(i);
            const isCenter = p === 0;
            return (
              <motion.div
                key={pkg.name}
                className={`col-start-1 row-start-1 w-[78%] justify-self-center ${
                  isCenter ? "" : "cursor-pointer"
                }`}
                animate={{
                  x: `${p * 90}%`,
                  scale: isCenter ? 1 : 0.84,
                  opacity: isCenter ? 1 : 0.4,
                  zIndex: isCenter ? 30 : 10,
                }}
                transition={spring}
                onClick={() => {
                  if (p === 1) next();
                  else if (p === -1) prev();
                }}
                // off-centre cards are non-interactive until swiped into focus
                aria-hidden={!isCenter}
                inert={!isCenter || undefined}
              >
                <PackageCard pkg={pkg} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* dots — 44px touch targets */}
        <div className="mt-7 flex items-center justify-center gap-1">
          {packages.map((pkg, i) => (
            <button
              key={pkg.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Visa ${pkg.name}`}
              aria-current={active === i}
              className="flex h-11 w-11 cursor-pointer items-center justify-center"
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? "w-7 bg-brass" : "w-2 bg-bone/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP — static 3-up grid */}
      <div className="hidden gap-6 lg:grid lg:grid-cols-3">
        {packages.map((pkg) => (
          <PackageCard key={pkg.name} pkg={pkg} lift />
        ))}
      </div>
    </>
  );
}
