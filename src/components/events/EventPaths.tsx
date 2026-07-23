import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";

export default function EventPaths({ locale }: { locale: Locale }) {
  const t = eventsDict[locale];
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      {/* Header row */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override: .eyebrow hard-codes lime which fails contrast on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.paths.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.paths.title}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
          {t.paths.lead}
        </p>
      </Reveal>

      {/* Grid of entrance cards */}
      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
        {t.paths.items.map((p, i) => (
          <Reveal key={p.no} delay={i * 0.07}>
            <a
              href={p.href}
              className="group flex h-full flex-col justify-between border border-black/10 bg-white p-7 transition-colors duration-200 hover:bg-lime/10 lg:p-9"
            >
              <div>
                <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.22em] text-black/40">
                  {p.no}
                </span>
                <h3 className="mb-3 font-display text-xl leading-[0.95] text-black lg:text-2xl">
                  {p.title}
                </h3>
                <p className="text-[13px] leading-snug text-black/50">
                  {p.desc}
                </p>
              </div>
              <span
                className="mt-6 block text-lg text-black/40 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
