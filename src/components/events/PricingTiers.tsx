"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal";
import { Sun } from "@/components/icons";

// Moon SVG (not in icons.tsx yet — inline here)
function Moon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

type Mode = "eve" | "day";

type Tier = {
  tag: string;
  name: string;
  img: string;
  imgPos?: string;
  evePrice: string;
  dayPrice: string;
  desc: string;
  features: {
    text: string;
    eveVariant?: string;
    dayVariant?: string;
  }[];
  popular?: boolean;
};

const TIERS: Tier[] = [
  {
    tag: "Enkelt & socialt",
    name: "Las Palmas",
    img: "/media/event-laspalmas.webp",
    imgPos: "center 80%",
    evePrice: "745",
    dayPrice: "670",
    desc: "After work, kickoff eller social aktivitet. Det enkla valet som alltid funkar — oavsett om ni är 10 eller 50.",
    features: [
      { text: "1,5 h beachvolleyturnering med instruktör" },
      { text: "Tapas — ost & chark" },
      {
        eveVariant: "1 dryckesenhet (öl, vin eller alkoholfritt)",
        dayVariant: "1 dryckesenhet — alkoholfritt",
        text: "",
      },
      { text: "Pris till King & Queen of The Beach" },
      { text: "Rekommenderat: 10–50 pers" },
    ],
  },
  {
    tag: "Mest bokad",
    name: "Algarve",
    img: "/media/event-algarve.webp",
    evePrice: "945",
    dayPrice: "850",
    desc: "Vårt mest bokade koncept. Aktivitet + middag — perfekt för företag som vill kombinera sport med ett riktigt socialt häng.",
    features: [
      { text: "1,5 h beachvolleyturnering med instruktör" },
      {
        eveVariant: "Middagsbuffé i loungen",
        dayVariant: "Lunchbuffé i loungen",
        text: "",
      },
      {
        eveVariant: "1 dryckesenhet (öl, vin eller alkoholfritt)",
        dayVariant: "1 dryckesenhet — alkoholfritt",
        text: "",
      },
      { text: "Pris till King & Queen of The Beach" },
      { text: "10–250 gäster" },
    ],
    popular: true,
  },
  {
    tag: "Helkväll",
    name: "Miami",
    img: "/media/event-miami.webp",
    evePrice: "1 195",
    dayPrice: "1 075",
    desc: "När ni vill maxa upplevelsen. Mat, dryck, tempo och stämning — för den grupp som inte nöjer sig med halvmesyrer.",
    features: [
      { text: "1,5 h beachvolleyturnering med instruktör" },
      {
        eveVariant: "Generös BBQ-buffé",
        dayVariant: "Generös BBQ-lunch",
        text: "",
      },
      {
        eveVariant: "2 dryckesenheter",
        dayVariant: "2 dryckesenheter — alkoholfritt",
        text: "",
      },
      { text: "Pris till King & Queen of The Beach" },
      { text: "15–250 gäster" },
    ],
  },
];

function featureText(
  f: Tier["features"][number],
  mode: Mode
): string {
  if (f.eveVariant !== undefined || f.dayVariant !== undefined) {
    return mode === "eve" ? (f.eveVariant ?? "") : (f.dayVariant ?? "");
  }
  return f.text;
}

/** Stable key from feature: prefer eveVariant text, then text itself. */
function featureKey(f: Tier["features"][number]): string {
  return f.eveVariant ?? f.text;
}

export default function PricingTiers() {
  const [mode, setMode] = useState<Mode>("eve");
  const reduce = useReducedMotion();

  const isDay = mode === "day";

  return (
    <section
      id="foretag"
      className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header row with toggle */}
      <Reveal className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
        <div>
          <p className="eyebrow mb-4">Företag &amp; organisation</p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
            Tre nivåer
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/45">
            Samma spel och instruktör — skillnaden ligger i maten och drycken.
          </p>
        </div>

        {/* Day/Evening toggle — sharp-edged per site convention */}
        <div
          role="group"
          aria-label="Välj tid på dagen"
          className="inline-flex shrink-0 items-center gap-0.5 rounded-sm border border-white/15 bg-base p-1"
        >
          <button
            type="button"
            onClick={() => setMode("eve")}
            aria-pressed={!isDay}
            className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-sm px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.09em] transition-colors duration-200 ${
              !isDay
                ? "bg-black text-bone"
                : "text-bone/50 hover:text-bone/80"
            }`}
          >
            <Moon />
            Kväll
          </button>
          <button
            type="button"
            onClick={() => setMode("day")}
            aria-pressed={isDay}
            className={`flex min-h-[44px] cursor-pointer items-center gap-2 rounded-sm px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.09em] transition-colors duration-200 ${
              isDay
                ? "bg-lime text-black"
                : "text-bone/50 hover:text-bone/80"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            Dagtid
            <span
              className={`rounded-sm px-2 py-0.5 text-[10px] font-bold ${
                isDay ? "bg-black text-lime" : "bg-lime/20 text-lime"
              }`}
            >
              −10%
            </span>
          </button>
        </div>
      </Reveal>

      {/* Tier cards */}
      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
        {TIERS.map((tier, i) => {
          const price = isDay ? tier.dayPrice : tier.evePrice;
          const strikePrice = isDay ? `${tier.evePrice} kr` : null;

          return (
            <Reveal
              key={tier.name}
              delay={reduce ? 0 : i * 0.08}
              className="flex flex-col overflow-hidden border border-line bg-base"
            >
              {/* Tier image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tier.img}
                alt={tier.name}
                loading="lazy"
                style={{ objectPosition: tier.imgPos ?? "center" }}
                className="h-36 w-full object-cover lg:h-52"
              />

              <div className="flex flex-1 flex-col p-6 lg:p-9">
                {/* Tag — non-popular gets a readable distinct badge */}
                <span
                  className={`mb-4 self-start px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                    tier.popular
                      ? "bg-lime text-black"
                      : "bg-white/[0.08] text-bone/60"
                  }`}
                >
                  {tier.tag}
                </span>

                {/* Name */}
                <h3 className="mb-2 font-display text-3xl uppercase leading-none text-bone lg:text-4xl">
                  {tier.name}
                </h3>

                {/* Price row */}
                <div className="mb-4 flex items-baseline gap-1.5 text-[13px] text-bone/40">
                  från{" "}
                  {strikePrice && (
                    <s className="text-bone/30">{strikePrice}</s>
                  )}
                  <strong className="font-display text-xl text-lime lg:text-2xl">
                    {price} kr
                  </strong>{" "}
                  /person
                </div>

                {/* Description */}
                <p className="mb-5 flex-1 text-[13px] leading-snug text-bone/50 lg:text-sm lg:leading-relaxed">
                  {tier.desc}
                </p>

                {/* Features */}
                <ul className="mb-6 border-t border-line">
                  {tier.features.map((f) => {
                    const text = featureText(f, mode);
                    return (
                      <li
                        key={featureKey(f)}
                        className="flex items-start gap-2 border-b border-line py-2 text-xs leading-snug text-bone/55 lg:py-2.5 lg:text-[13px]"
                      >
                        <span className="shrink-0 pt-0.5 text-lime/60" aria-hidden="true">
                          ↗
                        </span>
                        {text}
                      </li>
                    );
                  })}
                </ul>

                {/* CTA — min 44px tap height per WCAG 2.5.8 */}
                <a
                  href="#forfragan"
                  className="inline-flex cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright"
                >
                  Skicka förfrågan →
                </a>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
