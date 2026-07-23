import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventPlanner from "@/components/events/planner/EventPlanner";
import type { Locale } from "@/lib/i18n";
import { plannerDict } from "@/lib/i18n/planner";
import type { TierKey } from "@/lib/planner";

/** Eventplaneraren — en sida, två texter (/events/planera resp. /en/events/plan). */
export default function PlannerPage({ locale, initialTier }: { locale: Locale; initialTier?: TierKey }) {
  const t = plannerDict[locale];
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <header className="bg-black px-5 pt-28 sm:px-8 lg:px-14 lg:pt-36">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-lime">
              {t.header.eyebrow}
            </p>
            <h1 className="mb-4 font-display text-[clamp(2.5rem,10vw,4rem)] uppercase leading-[0.9] tracking-[-0.02em] text-white lg:text-[clamp(3.5rem,6vw,5.5rem)]">
              {t.header.titleTop} <span className="italic-accent">{t.header.titleAccent}</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/50">
              {t.header.intro}
            </p>
          </div>
        </header>
        <EventPlanner locale={locale} initialTier={initialTier} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
