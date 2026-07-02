import Reveal from "@/components/Reveal";
import { Calendar } from "@/components/icons";

/**
 * Prenumerera på kalendern — evergreen, dark panel section.
 * Links to the live subscribe options on thebeach.se/kalender/.
 * We do NOT fabricate direct .ics URLs per scope constraints.
 */

const PLATFORMS = [
  { label: "Google Calendar" },
  { label: "iCalendar" },
  { label: "Outlook 365" },
  { label: "Outlook Live" },
  { label: "Ladda ner .ics" },
];

export default function SubscribeCalendar() {
  return (
    <section
      id="prenumerera"
      className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-14">
        {/* Copy side */}
        <Reveal>
          <div>
            <p className="eyebrow mb-4">Missa inget</p>
            <h2 className="mb-5 font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Prenumerera på
              <br />
              <span className="italic-accent">kalendern</span>
            </h2>
            <p className="mb-7 max-w-md text-[0.95rem] leading-relaxed text-bone/50">
              Lägg till The Beach-kalendern direkt i din app — ny händelse
              dyker upp automatiskt utan att du behöver kolla hemsidan. Stöd
              för Google Calendar, iCalendar, Outlook 365, Outlook Live och
              nedladdningsbar .ics-fil.
            </p>
            <a
              href="https://thebeach.se/kalender/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Gå till prenumerationsalternativ <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>

        {/* Platform chips */}
        <Reveal delay={0.1}>
          <div className="border border-line bg-base p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-lime/60" />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-bone/40">
                Stöds av
              </p>
            </div>
            <ul className="flex flex-col gap-0.5">
              {PLATFORMS.map((p) => (
                <li key={p.label}>
                  <a
                    href="https://thebeach.se/kalender/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[44px] cursor-pointer items-center justify-between border border-line bg-panel px-5 py-3 transition-colors duration-200 hover:bg-panel-2"
                    aria-label={`Prenumerera via ${p.label}`}
                  >
                    <span className="text-[13px] font-semibold text-bone/70 group-hover:text-bone">
                      {p.label}
                    </span>
                    <span
                      className="text-bone/30 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-snug text-bone/30">
              Prenumerationsalternativen finns på thebeach.se/kalender/ —
              klicka valfri rad ovan för att komma dit.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
