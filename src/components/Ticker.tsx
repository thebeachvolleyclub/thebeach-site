const ITEMS = [
  "800 spelare per vecka",
  "OS-guld Paris 2024 — Åhman / Hellvig",
  "VM-guld Adelaide 2025",
  "10 inomhusbanor · 7 utomhusbanor",
  "Nationell träningsbas",
  "Event för 10–250 gäster",
  "Sedan 2006",
  "15 min från Stockholms City",
];

/** Lime credibility ticker (black text), looping. */
export default function Ticker() {
  const run = (key: string) =>
    ITEMS.map((t, i) => (
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
