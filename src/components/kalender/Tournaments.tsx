import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * Seriespel + Turneringar — dark section on bg-black.
 * Evergreen: describes format, not specific dates/prices.
 */

const TOURNAMENT_TYPES = [
  {
    tag: "SBT 1-stjärnig",
    stars: "1",
    desc: "Nybörjarvänlig rankingklassad tävling i Swedish Beach Tour-systemet. Bra startpunkt för dig som vill prova på tävlingsbeachvolley.",
  },
  {
    tag: "Mixed",
    stars: null,
    desc: "Blandat sällskaps- och klubbturnament. Kul format för alla nivåer — du behöver inte vara en rankad spelare.",
  },
  {
    tag: "U19",
    stars: null,
    desc: "Juniorturnering för spelare under 19 år. Bra scen att ta sina första tävlingssteg på.",
  },
];

export default function Tournaments() {
  return (
    <section
      id="turneringar"
      className="relative overflow-hidden bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Topo decoration */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="#D8FF77" strokeWidth="1.3">
          <path d="M0 80 Q300 40 600 80 T1200 80" />
          <path d="M0 160 Q300 120 600 160 T1200 160" />
          <path d="M0 240 Q300 200 600 240 T1200 240" />
          <path d="M0 320 Q300 280 600 320 T1200 320" />
          <path d="M0 400 Q300 360 600 400 T1200 400" />
          <path d="M0 460 Q300 420 600 460 T1200 460" />
        </g>
      </svg>

      <div className="relative">
        {/* Header */}
        <Reveal className="mb-10 border-b border-white/10 pb-10 lg:mb-14 lg:pb-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">Tävling</p>
              <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
                Seriespel &amp;
                <br />
                <span className="italic-accent">turneringar</span>
              </h2>
            </div>
            <blockquote className="max-w-sm border-l-2 border-lime/40 pl-5 text-sm italic leading-relaxed text-bone/45 sm:border-l-0 sm:border-r-2 sm:pl-0 sm:pr-5 sm:text-right">
              "Oavsett om det är din första turnering eller om du jagar
              rankingpoäng till de stora scenerna är vårt mål att du ska få en
              riktigt bra turneringsupplevelse hos oss."
            </blockquote>
          </div>
        </Reveal>

        {/* Seriespel band */}
        <Reveal delay={0.05}>
          <div className="mb-4 border border-line bg-panel p-7 lg:p-9">
            <div className="mb-3 flex items-center gap-3">
              <span className="bg-orange px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                Seriespel
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-bone/30">
                Återkommande
              </span>
            </div>
            <h3 className="mb-3 font-display text-2xl uppercase leading-[0.95] text-bone lg:text-3xl">
              Sommarsäsong
            </h3>
            <p className="mb-5 max-w-lg text-[13px] leading-relaxed text-bone/50 lg:text-sm">
              Seriespelet körs under sommarsäsongen —
              strukturerade omgångar med garanterat spel varje kväll. Du spelar
              mot likvärdiga motståndare och följer tabellen från vecka till
              vecka.
            </p>
            <a
              href="#kommande"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright"
            >
              Se aktuella omgångar →
            </a>
          </div>
        </Reveal>

        {/* Tournament type cards */}
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-3">
          {TOURNAMENT_TYPES.map((t, i) => (
            <Reveal
              key={t.tag}
              delay={0.1 + i * 0.07}
              className="flex flex-col border border-line bg-panel p-7 lg:p-8"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="bg-mint px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-black">
                  {t.tag}
                </span>
                {t.stars && (
                  <span
                    className="text-lime"
                    aria-label={`${t.stars} stjärna`}
                  >
                    {"★".repeat(Number(t.stars))}
                  </span>
                )}
              </div>
              <p className="flex-1 text-[13px] leading-relaxed text-bone/50">
                {t.desc}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Footer row: Profixio + licence info */}
        <Reveal delay={0.3}>
          <div className="mt-4 flex flex-col gap-0.5 sm:flex-row">
            <a
              href="https://profixio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[44px] flex-1 cursor-pointer items-center justify-between border border-line bg-panel p-5 transition-colors duration-200 hover:bg-panel-2 lg:px-7"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-bone/70">
                Turneringskalender på Profixio
              </span>
              <span
                className="text-bone/40 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <Link
              href="/trana"
              className="group flex min-h-[44px] flex-1 cursor-pointer items-center justify-between border border-line bg-panel p-5 transition-colors duration-200 hover:bg-panel-2 lg:px-7"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-bone/70">
                Tävlingslicens — så börjar du tävla
              </span>
              <span
                className="text-bone/40 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
