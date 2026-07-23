import Link from "next/link";
import Reveal from "./Reveal";
import { type Ev } from "@/lib/kalender";
import { getMergedMonths } from "@/lib/profixio";
import type { Locale } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";


const BADGE: Record<Ev["type"], string> = {
  tournament: "bg-orange text-white",
  training: "bg-lime text-black",
  event: "bg-mint text-black",
  free: "bg-pink text-white",
  closed: "bg-black/10 text-black/40",
};

const TONE: Record<NonNullable<Ev["badgeTone"]>, string> = {
  teal: "bg-teal text-white",
};


/** Ramtexterna ur ordboken — själva händelserna (Profixio/lib/kalender)
 *  är svenska i båda språkversionerna. */
export default async function Calendar({ locale = "sv" }: { locale?: Locale }) {
  const t = homeDict[locale].calendar;
  const MONTHS = await getMergedMonths();
  return (
    <section id="calendar" className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <Reveal>
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
          {t.eyebrow}
        </span>
        <h2 className="mb-8 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
          {t.title1}
          <br />
          {t.title2}
        </h2>
      </Reveal>

      <Reveal delay={0.05} className="mx-auto max-w-3xl">
        {MONTHS.map((m) => (
          <div key={m.month}>
            <div className="mt-2 border-t border-black/10 pb-2.5 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-black/35 first:border-t-0 first:pt-0">
              {m.month}
            </div>
            {m.events.map((e, i) => (
              <Link
                key={`${m.month}-${i}`}
                href={e.slug ? `/kalender/${e.slug}` : "/kalender#kommande"}
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
                  className={`mt-1 shrink-0 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${e.badgeTone ? TONE[e.badgeTone] : BADGE[e.type]}`}
                >
                  {e.badge}
                </span>
              </Link>
            ))}
          </div>
        ))}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 bg-white p-5">
          <p className="text-[13px] text-black/50">
            {t.subscribe}
          </p>
          <Link
            href={t.seeAllHref}
            className="cursor-pointer whitespace-nowrap border-b border-black pb-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-black"
          >
            {t.seeAll}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
