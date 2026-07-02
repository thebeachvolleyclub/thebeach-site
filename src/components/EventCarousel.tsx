"use client";

import { useRef, useState } from "react";

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

/* ---- carousel --------------------------------------------------------
 * MOBIL: native scroll-snap i stället för JS-rotor. Känns som appen,
 * inga halvklippta grannkort, funkar utan JavaScript. Dots synkas via
 * onScroll. DESKTOP: oförändrad statisk 3-up-grid.
 * -------------------------------------------------------------------- */
export default function EventCarousel({ packages }: { packages: EventPkg[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    if (!slide) return;
    setActive(Math.round(el.scrollLeft / slide.offsetWidth));
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (el && slide)
      el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <>
      {/* MOBILE — native scroll-snap with peek */}
      <div className="lg:hidden">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollPaddingInline: "1.25rem" }}
        >
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="w-[85%] shrink-0 snap-start"
            >
              <EventCard pkg={pkg} />
            </div>
          ))}
          {/* liten svans så sista kortet kan snappa klart */}
          <div aria-hidden className="w-[10%] shrink-0" />
        </div>

        {/* dots — 44px touch targets, dark on the white section */}
        <div className="mt-4 flex items-center justify-center gap-1">
          {packages.map((pkg, i) => (
            <button
              key={pkg.name}
              type="button"
              onClick={() => goTo(i)}
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
