import Reveal from "@/components/Reveal";

const BENEFITS = [
  "Lägre banavgifter",
  "Rabatterade träningspriser (junior)",
  "Tillgång till exklusiva event och erbjudanden",
  "Tävlingslicens ingår",
  "Du stödjer ungdomsverksamheten",
];

const TIERS = [
  { label: "Vuxen", price: "350 kr", unit: "/ år" },
  { label: "Junior", price: "190 kr", unit: "/ år" },
];

export default function Membership() {
  return (
    <section
      id="bli-medlem"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Bli del av klubben
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Bli{" "}
            <span className="text-black/55">
              medlem
            </span>
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/50">
            Stöd ungdomsverksamheten och få rabatter — ett enkelt val om du
            spelar regelbundet på The Beach.
          </p>
        </div>

        {/* Price tier badges */}
        <div className="flex shrink-0 gap-3">
          {TIERS.map((t) => (
            <div
              key={t.label}
              className="flex flex-col items-center border border-black/10 bg-white px-6 py-5"
            >
              <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                {t.label}
              </span>
              <span className="font-display text-2xl text-black">{t.price}</span>
              <span className="text-[11px] text-black/40">{t.unit}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Benefits + CTA */}
      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
        {/* Benefits list */}
        <Reveal className="border border-black/10 bg-white p-7 lg:p-10">
          <h3 className="mb-5 font-display text-2xl uppercase leading-none text-black">
            Fördelar
          </h3>
          <ul className="border-t border-black/10">
            {BENEFITS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 border-b border-black/10 py-3 text-sm leading-snug text-black/60"
              >
                <span className="mt-0.5 shrink-0 text-black/30" aria-hidden="true">
                  ↗
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* CTA panel */}
        <Reveal
          delay={0.08}
          className="relative flex flex-col justify-between overflow-hidden border border-black/10 bg-white p-7 lg:p-10"
        >
          {/* coach.webp used as subtle background accent */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/coach.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
          />
          <div className="relative">
            <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              Redo att bli del av klubben?
            </p>
            <h3 className="mb-4 font-display text-3xl uppercase leading-none text-black">
              Anmäl dig via
              <br />
              MATCHi
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-black/55">
              Snabbt och enkelt — klicka nedan och välj medlemskap på The
              Beach-sidan i MATCHi.
            </p>
            <a
              href="https://www.matchi.se/facilities/thebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors duration-300 hover:bg-black/80"
            >
              Bli medlem via MATCHi <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
