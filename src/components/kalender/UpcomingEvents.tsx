import Reveal from "@/components/Reveal";

/**
 * Kommande händelser — link-first block.
 * Shows a few recurring event types as illustrative examples only;
 * explicitly tells visitors the live, always-updated schedule lives
 * on thebeach.se/kalender/. No hardcoded dated event list.
 */

const EXAMPLES = [
  {
    type: "Träning",
    label: "Träningsgrupper",
    desc: "Återkommande pass — sommar (mån/ons) och höst (sön/mån/ons). Se aktuella tider på kalendern.",
    badge: "Träning",
    badgeCls: "bg-lime text-black",
  },
  {
    type: "Tävling",
    label: "Seriespel",
    desc: "Torsdagskvällar, strukturerade matcher med garanterat spel varje omgång.",
    badge: "Seriespel",
    badgeCls: "bg-orange text-white",
  },
  {
    type: "Turnering",
    label: "Turneringar (SBT / Mixed / U19)",
    desc: "The Beach arrangerar SBT 1-stjärniga turneringar, Mixed och juniorturneringar under säsong.",
    badge: "Turnering",
    badgeCls: "bg-mint text-black",
  },
];

export default function UpcomingEvents() {
  return (
    <section
      id="kommande"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header + primary CTA */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override: .eyebrow hard-codes lime — fails contrast on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Kommande
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Vad väntar
            <br />
            på The Beach
          </h2>
        </div>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
            Den fullständiga och alltid uppdaterade kalendern finns på
            thebeach.se — nedan ser du de återkommande aktivitetstyperna.
          </p>
          <a
            href="https://thebeach.se/kalender/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-black bg-black px-7 py-3 text-xs font-bold uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:bg-black/80"
          >
            Se hela kalendern <span aria-hidden="true">→</span>
          </a>
        </div>
      </Reveal>

      {/* Illustrative event type rows */}
      <div className="flex flex-col gap-0.5">
        {EXAMPLES.map((ex, i) => (
          <Reveal key={ex.type} delay={i * 0.07}>
            <a
              href="https://thebeach.se/kalender/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex cursor-pointer items-center gap-5 border border-black/10 bg-white p-5 transition-colors duration-200 hover:bg-lime/10 sm:gap-8 lg:px-7 lg:py-6"
            >
              {/* Badge */}
              <span
                className={`shrink-0 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${ex.badgeCls}`}
              >
                {ex.badge}
              </span>

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 font-display text-lg uppercase leading-tight tracking-[-0.01em] text-black">
                  {ex.label}
                </div>
                <div className="text-xs leading-relaxed text-black/45">
                  {ex.desc}
                </div>
              </div>

              <span
                className="ml-auto shrink-0 text-lg text-black/30 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      {/* Bottom CTA strip */}
      <Reveal delay={0.25}>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border border-black/10 bg-white p-5 lg:px-7">
          <p className="text-[13px] text-black/50">
            Prenumerera på kalendern och missa aldrig ett event.
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
