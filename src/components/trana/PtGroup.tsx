import Reveal from "@/components/Reveal";

export default function PtGroup() {
  return (
    <section
      id="pt-grupp"
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
          <path d="M0 80 Q300 40 600 80 T1200 80" />
          <path d="M0 150 Q300 110 600 150 T1200 150" />
          <path d="M0 220 Q300 180 600 220 T1200 220" />
          <path d="M0 300 Q300 260 600 300 T1200 300" />
          <path d="M0 380 Q300 340 600 380 T1200 380" />
        </g>
      </svg>

      <div className="relative">
        {/* Header */}
        <Reveal className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
          <div>
            <p className="eyebrow mb-4">Privat gruppträning</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              PT-grupp
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-bone/45 sm:text-right">
            Gå ihop 6–8 spelare som vill träna tillsammans och hyr en egen
            coach. Räknas som friskvård.
          </p>
        </Reveal>

        {/* Content */}
        <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
          {/* Pricing breakdown */}
          <Reveal className="flex flex-col border border-white/10 p-7 lg:p-10">
            <h3 className="mb-6 font-display text-2xl uppercase leading-none text-bone">
              Vad ingår
            </h3>
            <ul className="mb-6 flex-1 border-t border-white/10">
              <li className="flex items-start justify-between gap-4 border-b border-white/10 py-3 text-sm">
                <span className="text-bone/60">Coachavgift</span>
                <span className="shrink-0 font-semibold text-bone">
                  1 500–1 800 kr / pass
                </span>
              </li>
              <li className="flex items-start justify-between gap-4 border-b border-white/10 py-3 text-sm">
                <span className="text-bone/60">Banavgift (kvällstid)</span>
                <span className="shrink-0 font-semibold text-bone">
                  100 kr / person
                </span>
              </li>
              <li className="flex items-start justify-between gap-4 border-b border-white/10 py-3 text-sm">
                <span className="text-bone/60">Banavgift (dagtid vardag)</span>
                <span className="shrink-0 font-semibold text-bone">
                  50 kr / person
                </span>
              </li>
              <li className="flex items-start justify-between gap-4 py-3 text-sm">
                <span className="text-bone/60">Flexibla tider</span>
                <span className="shrink-0 font-semibold text-lime">
                  Ja
                </span>
              </li>
            </ul>
            <p className="text-xs text-bone/40">
              Räknas som friskvård — kolla med din arbetsgivare.
            </p>
          </Reveal>

          {/* Example calculation */}
          <Reveal delay={0.08} className="flex flex-col bg-panel p-7 lg:p-10">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/40">
              Räkneexempel
            </p>
            <p className="mb-8 text-sm leading-relaxed text-bone/55">
              6 personer, coach 1 500 kr/pass:
            </p>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-3 text-sm">
                <span className="text-bone/60">Coach (6 pers)</span>
                <span className="text-bone">250 kr / person</span>
              </div>
              <div className="flex items-center justify-between border-b border-line pb-3 text-sm">
                <span className="text-bone/60">Bana</span>
                <span className="text-bone">100 kr / person</span>
              </div>
              <div className="flex items-center justify-between pt-1 text-sm font-bold">
                <span className="text-bone">Totalt</span>
                <span className="font-display text-2xl text-lime">
                  350 kr / person
                </span>
              </div>
            </div>
            <a
              href="mailto:david@thebeach.one"
              className="mt-8 inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Kontakta David <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
