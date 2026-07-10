import Reveal from "@/components/Reveal";

export default function Coaches() {
  return (
    <section
      id="coacher"
      className="relative overflow-hidden bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Topo decoration */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06]"
        viewBox="0 0 1200 440"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="#D8FF77" strokeWidth="1.3">
          <path d="M0 70 Q300 30 600 70 T1200 70" />
          <path d="M0 140 Q300 100 600 140 T1200 140" />
          <path d="M0 210 Q300 170 600 210 T1200 210" />
          <path d="M0 290 Q300 250 600 290 T1200 290" />
          <path d="M0 370 Q300 330 600 370 T1200 370" />
        </g>
      </svg>

      <div className="relative">
        {/* Header */}
        <Reveal className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
          <div>
            <p className="eyebrow mb-4">Världsklass</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Våra{" "}
              <span className="italic-accent">coacher</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-bone/45 sm:text-right">
            The Beach grundades av coacher — och leds fortfarande av människor
            som lever och andas beachvolley på elitnivå.
          </p>
        </Reveal>

        {/* Feature: Mattias Magnusson */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/coach.webp"
              alt="Mattias Magnusson med Tina och Sanna Thurin på The Beach"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover object-top"
            />
            <p className="mt-3 text-[12px] leading-relaxed text-bone/40">
              På bilden: Mattias med Tina &amp; Sanna Thurin — sexfaldiga
              SM-vinnare och tränare hos oss.
            </p>
          </Reveal>

          <Reveal delay={0.08} className="border border-line p-7 lg:p-10">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40">
              Sportchef &amp; medgrundare
            </span>
            <h3 className="mb-4 font-display text-3xl uppercase leading-none text-bone lg:text-4xl">
              Mattias Magnusson
            </h3>
            <p className="text-[15px] leading-relaxed text-bone/60">
              Förbundskapten för det svenska damlandslaget och utsedd till
              &ldquo;Coach of the Year&rdquo; av Svenska Volleybollförbundet.
              Här leder han tränarstaben — spelare och coacher som lever och
              andas beachvolley på elitnivå.
            </p>
          </Reveal>
        </div>

        {/* Coach culture note */}
        <Reveal delay={0.16}>
          <div className="mt-10 flex items-center gap-4 border border-line bg-panel p-6 lg:mt-14 lg:p-8">
            <span className="shrink-0 text-2xl text-lime" aria-hidden="true">
              ↗
            </span>
            <p className="text-sm leading-relaxed text-bone/55">
              Våra coacher utbildar även andra tränare internt — kompetensen
              sprids i hela anläggningen.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
