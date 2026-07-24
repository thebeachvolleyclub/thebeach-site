import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { kalenderDict } from "@/lib/i18n/kalender";

/**
 * Säsongsrytm — evergreen breakdown of training group seasons.
 * Light (cream) section between two dark sections.
 */

export default function SeasonRhythm({ locale }: { locale: Locale }) {
  const t = kalenderDict[locale].seasons;
  return (
    <section
      id="sasonger"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override: lime fails contrast on cream */}
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
          {t.lead1}<strong className="font-semibold text-black">{t.leadStrong}</strong>{t.lead2}
        </p>
      </Reveal>

      {/* Season cards */}
      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        {t.items.map((s, i) => (
          <Reveal
            key={s.name}
            delay={i * 0.08}
            className="flex flex-col border border-black/10 bg-white p-7 lg:p-10"
          >
            {/* Period tag */}
            <span className="mb-3 self-start bg-black/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
              {s.tag}
            </span>

            {/* Season name */}
            <h3 className="mb-4 font-display text-3xl uppercase leading-none text-black lg:text-4xl">
              {s.name}
            </h3>

            {/* Days + passes */}
            <ul className="mb-5 border-t border-black/10">
              <li className="flex items-start gap-2 border-b border-black/10 py-2.5 text-xs leading-snug text-black/55">
                <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">↗</span>
                <span>
                  <strong className="font-semibold text-black">{t.daysLabel}</strong>{" "}
                  {s.days}
                </span>
              </li>
              <li className="flex items-start gap-2 border-b border-black/10 py-2.5 text-xs leading-snug text-black/55">
                <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">↗</span>
                <span>
                  <strong className="font-semibold text-black">{t.passesLabel}</strong>{" "}
                  {s.passes}
                </span>
              </li>
            </ul>

            <p className="flex-1 text-[13px] leading-snug text-black/50">
              {s.note}
            </p>
          </Reveal>
        ))}
      </div>

      {/* Contact + cross-link row */}
      <Reveal delay={0.2}>
        <div className="mt-4 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
          <div className="flex items-center gap-3 border border-black/10 bg-white p-5 lg:px-7">
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 text-black/30"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            <p className="text-[13px] text-black/50">
              {t.contactPre}
              <a
                href="mailto:traning@thebeach.one"
                className="font-semibold text-black underline underline-offset-2 hover:text-black/60"
              >
                traning@thebeach.one
              </a>
            </p>
          </div>
          <Link
            href={t.crossLinkHref}
            className="group flex min-h-[44px] cursor-pointer items-center justify-between border border-black/10 bg-white p-5 transition-colors duration-200 hover:bg-lime/10 lg:px-7"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-black">
              {t.crossLink}
            </span>
            <span
              className="text-black/40 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
