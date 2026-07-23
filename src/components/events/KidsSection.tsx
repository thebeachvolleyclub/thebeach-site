import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";

export default function KidsSection({ locale }: { locale: Locale }) {
  const t = eventsDict[locale];
  return (
    <section
      id="barn"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override: .eyebrow hard-codes lime which fails contrast on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.kids.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.kids.title}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
          {t.kids.lead}
        </p>
      </Reveal>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        {t.kids.cards.map((card, i) => (
          <Reveal
            key={card.name}
            delay={i * 0.08}
            className="flex flex-col border border-black/10 bg-white p-7 lg:p-10"
          >
            <span className="mb-3 self-start bg-black/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
              {card.tag}
            </span>
            <h3 className="mb-2 font-display text-3xl uppercase leading-none text-black lg:text-4xl">
              {card.name}
            </h3>
            {/* Card price: text-black bold on white — clear contrast */}
            <div className="mb-4 flex items-baseline gap-1 text-[13px] text-black/40">
              <strong className="font-display text-xl text-black lg:text-2xl">
                {card.price}
              </strong>
              <span>{card.unit}</span>
            </div>
            <p className="mb-5 flex-1 text-[13px] leading-snug text-black/50">
              {card.desc}
            </p>
            <ul className="border-t border-black/10">
              {card.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 border-b border-black/10 py-2 text-xs leading-snug text-black/55"
                >
                  <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">
                    ↗
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            {/* CTA — min 44px tap height per WCAG 2.5.8 */}
            <a
              href={`#${t.cta.sectionId}`}
              className="mt-6 inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-colors hover:text-black/60"
            >
              {t.kids.cta}
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
