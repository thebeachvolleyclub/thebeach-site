import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";

export default function SchoolsCompanies({ locale }: { locale: Locale }) {
  const t = tranaDict[locale].schools;
  return (
    <section
      id="skolor-foretag"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.title1}
            <br />
            {t.title2}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
          {t.lead}
        </p>
      </Reveal>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        {/* Skolor */}
        <Reveal className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
          <span className="mb-3 self-start bg-black/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
            {t.school.tag}
          </span>
          <h3 className="mb-2 font-display text-3xl uppercase leading-none text-black lg:text-4xl">
            {t.school.title}
          </h3>
          <div className="mb-4 text-[13px] text-black/40">
            <strong className="font-display text-xl text-black">
              {t.school.price}
            </strong>{" "}
            {t.school.priceUnit}
          </div>
          <div className="mb-5 space-y-1 text-[13px] text-black/50">
            <p>
              {t.school.pkg1.pre}
              <strong className="text-black">{t.school.pkg1.strong}</strong>
              {t.school.pkg1.post}
            </p>
            <p>
              {t.school.pkg2.pre}
              <strong className="text-black">{t.school.pkg2.strong}</strong>
              {t.school.pkg2.post}
            </p>
          </div>

          <ul className="mb-6 flex-1 border-t border-black/10">
            {t.included.map((f) => (
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

          <Link
            href={t.school.ctaHref}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-colors hover:text-black/60"
          >
            {t.school.cta} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        {/* Företag */}
        <Reveal delay={0.08} className="flex flex-col border border-black/10 bg-white p-7 lg:p-10">
          <span className="mb-3 self-start bg-black/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
            {t.company.tag}
          </span>
          <h3 className="mb-2 font-display text-3xl uppercase leading-none text-black lg:text-4xl">
            {t.company.title}
          </h3>
          <div className="mb-4 text-[13px] leading-relaxed text-black/50">
            {t.company.body}
          </div>

          <ul className="mb-6 flex-1 border-t border-black/10">
            {t.included.map((f) => (
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

          <Link
            href={t.company.ctaHref}
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-colors hover:text-black/60"
          >
            {t.company.cta} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
