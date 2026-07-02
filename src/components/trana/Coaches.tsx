import Reveal from "@/components/Reveal";

const COACHES = [
  {
    name: "Mattias Magnusson",
    role: "Sportchef & medgrundare",
    bio: "Förbundskapten för det svenska damlandslaget. Utsedd till \"Coach of the Year\" av Svenska Volleybollförbundet.",
  },
  {
    name: "Rasmus Jonsson",
    role: "Landslags­coach",
    bio: "Coach för det svenska herrlandslaget. Utbildar även andra tränare internt på The Beach.",
  },
];

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

        {/* Coach cards */}
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
          {COACHES.map((coach, i) => (
            <Reveal
              key={coach.name}
              delay={i * 0.08}
              className="flex flex-col border border-line p-7 lg:p-10"
            >
              {/* Image placeholder: coach.webp (only one image available) */}
              {i === 0 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/media/coach.webp"
                  alt={`Porträtt av ${coach.name}`}
                  loading="lazy"
                  className="mb-6 h-48 w-full object-cover object-top lg:h-64"
                />
              )}
              {i === 1 && (
                /* FLAG: no second coach photo in /public/media — brand-color placeholder */
                <div
                  className="mb-6 flex h-48 w-full items-center justify-center bg-panel lg:h-64"
                  aria-hidden="true"
                >
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-line"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                </div>
              )}

              <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40">
                {coach.role}
              </span>
              <h3 className="mb-3 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">
                {coach.name}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-bone/55">
                {coach.bio}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Coach culture note */}
        <Reveal delay={0.16}>
          <div className="mt-0.5 flex items-center gap-4 border border-line bg-panel p-6 lg:p-8">
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
