import Reveal from "./Reveal";

const FEATURES = [
  "📅  Banbokning",
  "🤝  Hitta partner",
  "💸  Swish-betalning",
  "🏆  Turneringsinfo",
];

const ROWS: { label: string; hi?: boolean }[] = [
  { label: "Boka bana — tisdag 19:00", hi: true },
  { label: "Hitta partner" },
  { label: "Kalender" },
  { label: "SBT Rankingtävling — lör 10:00" },
  { label: "Afterbeach — fredag 17:00 🎉", hi: true },
  { label: "Träningsgrupp: Continue" },
  { label: "Betalning via Swish" },
];

export default function AppSection() {
  return (
    <section className="grid grid-cols-1 items-center gap-10 bg-mint px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-14 lg:py-28">
      <Reveal>
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
          The Beach App
        </span>
        <h2 className="mb-4 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
          Allt du
          <br />
          behöver
          <br />
          i fickan
        </h2>
        <p className="mb-8 max-w-md text-[15px] leading-[1.7] text-black/60 lg:text-[17px]">
          Boka bana, hitta en partner att spela med, betala via Swish och håll
          koll på din kalender — direkt i appen.
        </p>
        <div className="mb-8 grid grid-cols-2 gap-0.5">
          {FEATURES.map((f) => (
            <div key={f} className="bg-black/[0.07] px-4 py-3.5 text-[13px] font-semibold text-black">
              {f}
            </div>
          ))}
        </div>
        <a
          href="#"
          className="inline-block cursor-pointer bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90"
        >
          Ladda ner appen →
        </a>
      </Reveal>

      <Reveal delay={0.1} className="flex justify-center">
        <div className="flex h-[440px] w-[220px] items-center justify-center rounded-[32px] bg-black shadow-2xl shadow-black/20 lg:h-[520px] lg:w-[260px]">
          <div className="flex h-[412px] w-[194px] flex-col gap-2.5 overflow-hidden rounded-[24px] bg-[#1a1c11] px-4 pb-4 pt-8 lg:h-[490px] lg:w-[230px]">
            <div className="mb-1.5 font-display text-sm uppercase tracking-wide text-white/15">
              The Beach
            </div>
            {ROWS.map((r, i) => (
              <div
                key={i}
                className={`rounded-md px-3.5 py-3 text-[11px] font-semibold ${
                  r.hi ? "bg-lime text-black" : "bg-lime/[0.08] text-white/40"
                }`}
              >
                {r.label}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
