"use client";

import { useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";

export type EventPkg = {
  img: string;
  tag: string;
  name: string;
  price: string;
  desc: string;
  features: string[];
  featured?: boolean;
};

/* ---- shared card (identical style to the desktop grid) -------------- */
function EventCard({ pkg }: { pkg: EventPkg }) {
  return (
    <article
      className={`flex h-full flex-col overflow-hidden ${
        pkg.featured ? "bg-lime" : "bg-cream"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pkg.img}
        alt={pkg.name}
        loading="lazy"
        className="h-28 w-full object-cover lg:h-44"
      />
      <div className="flex flex-1 flex-col p-5 lg:p-11">
        <span
          className={`mb-3 self-start px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] lg:mb-8 lg:py-1.5 ${
            pkg.featured ? "bg-black text-lime" : "bg-black/[0.07] text-black/45"
          }`}
        >
          {pkg.tag}
        </span>
        <h3 className="mb-1 font-display text-3xl uppercase leading-none tracking-[-0.01em] text-black lg:mb-1.5 lg:text-5xl">
          {pkg.name}
        </h3>
        <div className={`mb-3 text-[13px] font-semibold lg:mb-6 ${pkg.featured ? "text-black/45" : "text-black/40"}`}>
          från{" "}
          <strong className={`font-display text-xl lg:text-2xl ${pkg.featured ? "text-black" : "text-orange"}`}>
            {pkg.price}
          </strong>{" "}
          /person
        </div>
        <p className={`mb-4 flex-1 text-[13px] leading-snug lg:mb-6 lg:text-sm lg:leading-relaxed ${pkg.featured ? "text-black/60" : "text-black/50"}`}>
          {pkg.desc}
        </p>
        <ul className="mb-4 border-t border-black/10 lg:mb-8">
          {pkg.features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 border-b border-black/10 py-1.5 text-xs leading-snug text-black/60 lg:gap-2.5 lg:py-2.5 lg:text-[13px]"
            >
              <span className="shrink-0 pt-0.5 opacity-40">↗</span>
              {f}
            </li>
          ))}
        </ul>
        <a
          href="/events#forfragan"
          className="inline-flex cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-black"
        >
          Skicka förfrågan →
        </a>
      </div>
    </article>
  );
}

/* ---- carousel ------------------------------------------------------- */
export default function EventCarousel({ packages }: { packages: EventPkg[] }) {
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
      {/* MOBILE — centred infinite rotor */}
      <div className="overflow-hidden lg:hidden">
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
                className={`col-start-1 row-start-1 w-[82%] justify-self-center ${
                  isCenter ? "" : "cursor-pointer"
                }`}
                animate={{
                  x: `${p * 88}%`,
                  scale: isCenter ? 1 : 0.86,
                  opacity: isCenter ? 1 : 0.45,
                  zIndex: isCenter ? 30 : 10,
                }}
                transition={spring}
                onClick={() => {
                  if (p === 1) next();
                  else if (p === -1) prev();
                }}
                aria-hidden={!isCenter}
                inert={!isCenter || undefined}
              >
                <EventCard pkg={pkg} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* dots — 44px touch targets, dark on the white section */}
        <div className="mt-6 flex items-center justify-center gap-1">
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
                  active === i ? "w-7 bg-black" : "w-2 bg-black/25"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP — static 3-up grid */}
      <div className="hidden gap-0.5 lg:grid lg:grid-cols-3">
        {packages.map((pkg) => (
          <EventCard key={pkg.name} pkg={pkg} />
        ))}
      </div>
    </>
  );
}
