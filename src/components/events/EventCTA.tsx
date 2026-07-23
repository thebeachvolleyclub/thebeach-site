import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";
import EventRequestFormClient from "./EventRequestFormClient";

export default function EventCTA({ locale }: { locale: Locale }) {
  const t = eventsDict[locale];
  return (
    <section
      id={t.cta.sectionId}
      className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          {/* eyebrow override: .eyebrow hard-codes lime which fails contrast on lime bg */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.cta.eyebrow}
          </p>
          <h2 className="mb-6 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.cta.titleTop}
            <br />
            <span className="italic-accent !text-black/70">{t.cta.titleAccent}</span>
          </h2>
          <p className="mb-9 max-w-md text-sm leading-relaxed text-black/60">
            {t.cta.lead}
          </p>
          <p className="-mt-5 mb-9 text-sm font-semibold text-black">
            {t.cta.plannerLead}{" "}
            {/* Planeraren: /events/planera (sv) resp. /en/events/plan (en). */}
            <a href={locale === "en" ? "/en/events/plan" : "/events/planera"} className="underline underline-offset-4 hover:opacity-70">
              {t.cta.plannerLink}
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <EventRequestFormClient locale={locale} />
        </Reveal>
      </div>
    </section>
  );
}
