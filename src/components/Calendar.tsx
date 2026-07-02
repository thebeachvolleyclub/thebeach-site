import Reveal from "./Reveal";

type Ev = {
  day: string;
  wd: string;
  title: string;
  meta: string;
  badge: string;
  type: "tournament" | "training" | "event" | "free" | "closed";
};

const MONTHS: { month: string; events: Ev[] }[] = [
  {
    month: "Juni 2026",
    events: [
      { day: "17", wd: "Ons", title: "Seriespel Sommar 2026", meta: "Pågår hela sommaren · Boka via MATCHi", badge: "Tävling", type: "tournament" },
      { day: "19", wd: "Fre", title: "Stängt — Midsommar", meta: "Midsommarafton · Anläggningen håller stängt", badge: "Stängt", type: "closed" },
      { day: "27", wd: "Lör", title: "SBT1 — Stockholm Beach Tour", meta: "Rankingtävling · Anmälan stängd", badge: "SBT", type: "tournament" },
      { day: "28", wd: "Sön", title: "Prova på beachvolley — Gratis", meta: "15:00–16:30 · Öppet för alla nybörjare · Begränsat antal platser", badge: "Gratis", type: "free" },
    ],
  },
  {
    month: "Juli 2026",
    events: [
      { day: "4", wd: "Lör", title: "Mixed Tournament", meta: "Intern tävling för alla nivåer · Anmälan öppnar snart", badge: "Mixed", type: "event" },
      { day: "11", wd: "Lör", title: "SBT1 — Stockholm Beach Tour", meta: "Rankingtävling · Anmälan öppnar 1 juli", badge: "SBT", type: "tournament" },
      { day: "25", wd: "Lör", title: "Mixed Tournament", meta: "Intern tävling · Anmälan öppnar 11 juli", badge: "Mixed", type: "event" },
    ],
  },
  {
    month: "Augusti 2026",
    events: [
      { day: "1", wd: "Lör", title: "SBT1 + Träningsgrupper öppnar", meta: "Rankingtävling · Anmälan till träningsgrupper 20:00", badge: "SBT + Träning", type: "tournament" },
      { day: "8", wd: "Lör", title: "SBT1 — Stockholm Beach Tour", meta: "Rankingtävling · Anmälan öppnar 25 juli", badge: "SBT", type: "tournament" },
    ],
  },
];

const BADGE: Record<Ev["type"], string> = {
  tournament: "bg-orange text-white",
  training: "bg-lime text-black",
  event: "bg-mint text-black",
  free: "bg-pink text-white",
  closed: "bg-black/10 text-black/40",
};

export default function Calendar() {
  return (
    <section id="calendar" className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <Reveal>
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
          Kalender
        </span>
        <h2 className="mb-8 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
          Vad händer
          <br />
          på The Beach
        </h2>
      </Reveal>

      <Reveal delay={0.05} className="mx-auto max-w-3xl">
        {MONTHS.map((m) => (
          <div key={m.month}>
            <div className="mt-2 border-t border-black/10 pb-2.5 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35 first:border-t-0 first:pt-0">
              {m.month}
            </div>
            {m.events.map((e, i) => (
              <a
                key={`${m.month}-${i}`}
                href="https://thebeach.se/kalender/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex cursor-pointer items-start gap-4 border-b border-black/[0.07] py-4 transition-colors hover:bg-black/[0.02]"
              >
                <div className="w-12 shrink-0 text-center">
                  <div className="font-display text-[28px] uppercase leading-none text-black">
                    {e.day}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-black/30">
                    {e.wd}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-1 font-display text-lg uppercase leading-tight tracking-[-0.01em] text-black">
                    {e.title}
                  </div>
                  <div className="text-xs leading-relaxed text-black/45">{e.meta}</div>
                </div>
                <span
                  className={`mt-1 shrink-0 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${BADGE[e.type]}`}
                >
                  {e.badge}
                </span>
              </a>
            ))}
          </div>
        ))}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 bg-white p-5">
          <p className="text-[13px] text-black/50">
            Missa aldrig ett event — prenumerera på kalendern
          </p>
          <a
            href="https://thebeach.se/kalender/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer whitespace-nowrap border-b border-black pb-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-black"
          >
            Se hela kalendern →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
