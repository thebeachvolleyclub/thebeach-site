import Link from "next/link";
import Reveal from "@/components/Reveal";
import { type Ev } from "@/lib/kalender";
import { getMergedMonths } from "@/lib/profixio";

/**
 * Kommande händelser — sajtens egen, kompletta lista.
 * Datakälla: src/lib/kalender.ts (uppdateras där, ingenting annat).
 */

const BADGE: Record<Ev["type"], string> = {
  tournament: "bg-orange text-white",
  training: "bg-lime text-black",
  event: "bg-mint text-black",
  free: "bg-pink text-white",
  closed: "bg-black/10 text-black/40",
};

export default async function UpcomingEvents() {
  const MONTHS = await getMergedMonths();
  return (
    <section
      id="kommande"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Kommande
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Vad väntar
            <br />
            på The Beach
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
          Turneringar, kurser, seriespel och event — hela schemat, alltid
          uppdaterat. Bana bokar du via MATCHi.
        </p>
      </Reveal>

      {/* Full lista, månad för månad */}
      <Reveal delay={0.05} className="mx-auto max-w-3xl">
        {MONTHS.map((m) => (
          <div key={m.month}>
            <div className="mt-2 border-t border-black/10 pb-2.5 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35 first:border-t-0 first:pt-0">
              {m.month}
            </div>
            {m.events.map((e, i) => {
              const rowCls = `flex items-start gap-4 border-b border-black/[0.07] py-4 ${e.slug ? "cursor-pointer transition-colors hover:bg-black/[0.02]" : ""}`;
              const inner = (
                <>
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
                {e.slug ? <span aria-hidden="true" className="mt-1.5 text-black/25">→</span> : null}
                </>
              );
              return e.slug ? (
                <Link key={`${m.month}-${i}`} href={`/kalender/${e.slug}`} className={rowCls}>
                  {inner}
                </Link>
              ) : (
                <div key={`${m.month}-${i}`} className={rowCls}>
                  {inner}
                </div>
              );
            })}
          </div>
        ))}
      </Reveal>
    </section>
  );
}
