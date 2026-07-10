import Link from "next/link";
import Reveal from "@/components/Reveal";

const INCLUDED = [
  "Nät och bollar",
  "Omklädningsrum & dusch",
  "Matservering",
  "Ledare på plats",
];

export default function SchoolsCompanies() {
  return (
    <section
      id="skolor-foretag"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Skolor &amp; företag
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Aktivitet för
            <br />
            hela gruppen
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
          1,5 h beachvolley med ledare — perfekt för idrottsdagar, klassaktiviteter
          och kickoffs. Allt ingår.
        </p>
      </Reveal>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        {/* Skolor */}
        <Reveal className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
          <span className="mb-3 self-start bg-black/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
            Skolor
          </span>
          <h3 className="mb-2 font-display text-3xl uppercase leading-none text-black lg:text-4xl">
            Skolaktivitet
          </h3>
          <div className="mb-4 text-[13px] text-black/40">
            <strong className="font-display text-xl text-black">
              100 kr
            </strong>{" "}
            / elev
          </div>
          <div className="mb-5 space-y-1 text-[13px] text-black/50">
            <p>
              Ledarpaket:{" "}
              <strong className="text-black">1 500 kr</strong> (upp till 40
              elever)
            </p>
            <p>
              Ledarpaket:{" "}
              <strong className="text-black">2 000 kr</strong> (fler än 40
              elever)
            </p>
          </div>

          <ul className="mb-6 flex-1 border-t border-black/10">
            {INCLUDED.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 border-b border-black/10 py-2 text-xs leading-snug text-black/55"
              >
                <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">
                  ↗
                </span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/skola"
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-colors hover:text-black/60"
          >
            Läs mer & boka skolbesök <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        {/* Företag */}
        <Reveal delay={0.08} className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
          <span className="mb-3 self-start bg-black/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
            Företag
          </span>
          <h3 className="mb-2 font-display text-3xl uppercase leading-none text-black lg:text-4xl">
            Kickoff &amp; event
          </h3>
          <div className="mb-4 text-[13px] leading-relaxed text-black/50">
            Vill ni ha ett fullt eventkoncept med middag, dryck och skräddarsytt
            upplägg? Vi har färdiga paket för alla gruppers storlek och budget.
          </div>

          <ul className="mb-6 flex-1 border-t border-black/10">
            {INCLUDED.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 border-b border-black/10 py-2 text-xs leading-snug text-black/55"
              >
                <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">
                  ↗
                </span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/events"
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-colors hover:text-black/60"
          >
            Se företagsevent <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
