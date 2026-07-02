import Reveal from "@/components/Reveal";

const TEAM = [
  {
    initials: "DC",
    name: "David Cabrera",
    role: "VD & medgrundare",
    bio: "En av grundarna bakom The Beach. Leder anläggningen och den strategiska utvecklingen.",
    // TODO(operator): headshots or group photo? Add src prop here if available
  },
  {
    initials: "MM",
    name: "Mattias Magnusson",
    role: "Sportchef & medgrundare",
    bio: "3× SM-guld. Förbundskapten för det svenska damlandslaget. Utsedd till Årets Tränare av Svenska Volleybollförbundet.", // TODO(operator): confirm "3× SM-guld" (carried from existing About.tsx copy)
  },
  {
    initials: "JA",
    name: "Jeybee Ahlkoury",
    role: "Anläggningschef",
    bio: "Ansvarar för anläggningens dagliga drift och ser till att sanden alltid är redo.",
  },
  {
    initials: "RJ",
    name: "Rasmus Jonsson",
    role: "VD BeachTravels",
    bio: "Leder systerbolaget BeachTravels — träningsresor för spelare som vill ta spelet till nästa nivå.",
  },
];

export default function Manniskorna() {
  return (
    <section
      id="manniskorna"
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
            <p className="eyebrow mb-4">Teamet</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Människorna{" "}
              <br />
              <span className="italic-accent">bakom</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-bone/45 sm:text-right">
            The Beach grundades av coacher och drivs fortfarande av människor
            som lever och andas beachvolley.
          </p>
        </Reveal>

        {/* Team cards — 2×2 grid */}
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
          {TEAM.map((person, i) => (
            <Reveal
              key={person.name}
              delay={i * 0.08}
              className="flex flex-col border border-line p-7 lg:p-10"
            >
              {/* Monogram / initials avatar */}
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center bg-panel"
                aria-hidden="true"
              >
                <span className="font-display text-lg text-lime">
                  {person.initials}
                </span>
              </div>

              <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40">
                {person.role}
              </span>
              <h3 className="mb-3 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">
                {person.name}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-bone/55">
                {person.bio}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Culture note */}
        <Reveal delay={0.16}>
          <div className="mt-0.5 flex items-center gap-4 border border-line bg-panel p-6 lg:p-8">
            <span className="shrink-0 text-2xl text-lime" aria-hidden="true">
              ↗
            </span>
            <p className="text-sm leading-relaxed text-bone/55">
              {/* TODO(operator): headshots or group photo? Replace monograms when ready */}
              The Beach är också hem för ett aktivt ungdomsprogram och daglig
              träning för hundratals spelare — alla i samma sand.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
