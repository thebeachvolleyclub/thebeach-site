import type { Locale } from "@/lib/i18n";

const ITEMS: Record<Locale, string[]> = {
  sv: [
    "800 spelare per vecka",
    "OS-guld Paris 2024 — Åhman / Hellvig",
    "VM-guld Adelaide 2025",
    "10 inomhusbanor · 7 utomhusbanor",
    "Nationell träningsbas",
    "Event för upp till 900 gäster",
    "Sedan 2006",
    "15 min från Stockholms City",
  ],
  en: [
    "800 players a week",
    "Olympic gold Paris 2024 — Åhman / Hellvig",
    "World Championship gold Adelaide 2025",
    "10 indoor courts · 7 outdoor courts",
    "National training base",
    "Events for up to 900 guests",
    "Since 2006",
    "15 min from Stockholm City",
  ],
};

/** Lime credibility ticker (black text), looping. */
export default function Ticker({ locale = "sv" }: { locale?: Locale }) {
  const run = (key: string) =>
    ITEMS[locale].map((t, i) => (
      <span key={`${key}-${i}`} className="flex items-center whitespace-nowrap">
        <span className="px-5 text-xs font-semibold text-black lg:px-8 lg:text-sm">
          {t}
        </span>
        <span className="text-black/30" aria-hidden="true">
          ✦
        </span>
      </span>
    ));

  return (
    <div className="overflow-hidden border-y border-black/10 bg-lime py-3">
      <div className="flex w-max animate-ticker">
        <div className="flex shrink-0">{run("a")}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {run("b")}
        </div>
      </div>
    </div>
  );
}
