import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";

export default function YouthTraining({ locale }: { locale: Locale }) {
  const t = tranaDict[locale].youth;
  return (
    <section
      id="ungdom"
      className="relative overflow-hidden bg-mint px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Light topo decoration on mint */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.08]"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="#14160f" strokeWidth="1.3">
          <path d="M0 80 Q300 40 600 80 T1200 80" />
          <path d="M0 150 Q300 110 600 150 T1200 150" />
          <path d="M0 220 Q300 180 600 220 T1200 220" />
          <path d="M0 300 Q300 260 600 300 T1200 300" />
          <path d="M0 370 Q300 330 600 370 T1200 370" />
        </g>
      </svg>

      <div className="relative">
        {/* Header */}
        <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
          <div>
            {/* eyebrow override on mint */}
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              {t.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              {t.title1}{" "}
              <span className="text-black/65">
                {t.title2}
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-black/55 sm:text-right">
            {t.lead}
          </p>
        </Reveal>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
          {/* Quote card */}
          <Reveal className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
            <blockquote className="flex-1 text-sm leading-relaxed text-black/60">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-black/35">
              {t.attribution}
            </div>
          </Reveal>

          {/* Info card */}
          <Reveal delay={0.08} className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
            <h3 className="mb-4 font-display text-2xl uppercase leading-none text-black">
              {t.infoTitle}
            </h3>
            <p className="mb-5 flex-1 text-sm leading-relaxed text-black/60">
              {t.infoBody}
            </p>
            <ul className="mb-6 border-t border-black/10">
              {t.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 border-b border-black/10 py-2 text-xs leading-snug text-black/55"
                >
                  <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">
                    ↗
                  </span>
                  {item}
                </li>
              ))}
              <li className="flex items-start gap-2 border-b border-black/10 py-2 text-xs leading-snug text-black/55">
                <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">
                  ↗
                </span>
                {t.contactPre}
                <a
                  href="mailto:mans@thebeach.one"
                  className="underline underline-offset-4 transition-colors hover:text-black/80"
                >
                  mans@thebeach.one
                </a>
              </li>
            </ul>
            <a
              href="https://www.svenskalag.se/thebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-colors hover:text-black/60"
            >
              {t.cta} <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
