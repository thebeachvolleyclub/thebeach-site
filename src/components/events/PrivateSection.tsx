import Reveal from "@/components/Reveal";

const PRIVATE_CARDS = [
  {
    title: "Privat",
    desc: "Bröllop, födelsedagar och privata fester. Sommarkänsla mitt i Stockholm, spel om man vill, god mat och er egen del av anläggningen. Vi bygger kvällen helt efter er.",
  },
  {
    title: "Skräddarsytt & större",
    desc: "Större företagsevent, eventbyråer och specialupplägg — upp till 900 gäster, scen, full bar och kökskapacitet. Egen kontaktperson från idé till genomförande, även säkerhetsklassat.",
  },
];

export default function PrivateSection() {
  return (
    <section
      id="privat"
      className="relative overflow-hidden bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Topo decoration */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06]"
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="#D8FF77" strokeWidth="1.3">
          <path d="M0 80 Q300 40 600 80 T1200 80" />
          <path d="M0 150 Q300 110 600 150 T1200 150" />
          <path d="M0 220 Q300 180 600 220 T1200 220" />
          <path d="M0 300 Q300 260 600 300 T1200 300" />
          <path d="M0 380 Q300 340 600 380 T1200 380" />
          <path d="M0 450 Q300 410 600 450 T1200 450" />
        </g>
      </svg>

      <div className="relative">
        {/* Header */}
        <Reveal className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
          <div>
            <p className="eyebrow mb-4">Privat &amp; skräddarsytt</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              När det ska vara
              <br />
              <span className="italic-accent">på riktigt</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-bone/40 sm:text-right">
            Två olika upplägg — privat fest eller fullskaligt skräddarsytt
            event. Båda offertbaserade.
          </p>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
          {PRIVATE_CARDS.map((card, i) => (
            <Reveal
              key={card.title}
              delay={i * 0.08}
              className="flex flex-col border border-line p-7 lg:p-10"
            >
              <h3 className="mb-4 font-display text-2xl uppercase leading-[0.95] text-bone lg:text-3xl">
                {card.title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-bone/50">
                {card.desc}
              </p>
              {/* CTA — min 44px tap height per WCAG 2.5.8 */}
              <a
                href="#forfragan"
                className="mt-8 inline-flex cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright"
              >
                Be om offert →
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
