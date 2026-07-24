import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { kalenderDict } from "@/lib/i18n/kalender";

/**
 * Seriespel + Turneringar — dark section on bg-black.
 * Evergreen: describes format, not specific dates/prices.
 */

export default function Tournaments({ locale }: { locale: Locale }) {
  const t = kalenderDict[locale].tournaments;
  return (
    <section
      id="turneringar"
      className="relative overflow-hidden bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Topo decoration */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <g fill="none" stroke="#D8FF77" strokeWidth="1.3">
          <path d="M0 80 Q300 40 600 80 T1200 80" />
          <path d="M0 160 Q300 120 600 160 T1200 160" />
          <path d="M0 240 Q300 200 600 240 T1200 240" />
          <path d="M0 320 Q300 280 600 320 T1200 320" />
          <path d="M0 400 Q300 360 600 400 T1200 400" />
          <path d="M0 460 Q300 420 600 460 T1200 460" />
        </g>
      </svg>

      <div className="relative">
        {/* Header */}
        <Reveal className="mb-10 border-b border-white/10 pb-10 lg:mb-14 lg:pb-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4">{t.eyebrow}</p>
              <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
                {t.title1}
                <br />
                <span className="italic-accent">{t.titleAccent}</span>
              </h2>
            </div>
            <blockquote className="max-w-sm border-l-2 border-lime/40 pl-5 text-sm italic leading-relaxed text-bone/45 sm:border-l-0 sm:border-r-2 sm:pl-0 sm:pr-5 sm:text-right">
              {t.quote}
            </blockquote>
          </div>
        </Reveal>

        {/* Seriespel band */}
        <Reveal delay={0.05}>
          <div className="mb-4 border border-line bg-panel p-7 lg:p-9">
            <div className="mb-3 flex items-center gap-3">
              <span className="bg-orange px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                {t.band.badge}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-bone/30">
                {t.band.recurring}
              </span>
            </div>
            <h3 className="mb-3 font-display text-2xl uppercase leading-[0.95] text-bone lg:text-3xl">
              {t.band.title}
            </h3>
            <p className="mb-5 max-w-lg text-[13px] leading-relaxed text-bone/50 lg:text-sm">
              {t.band.body}
            </p>
            <a
              href="#kommande"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright"
            >
              {t.band.cta}
            </a>
          </div>
        </Reveal>

        {/* Tournament type cards */}
        <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-3">
          {t.items.map((item, i) => (
            <Reveal
              key={item.tag}
              delay={0.1 + i * 0.07}
              className="flex flex-col border border-line bg-panel p-7 lg:p-8"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="bg-mint px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-black">
                  {item.tag}
                </span>
                {item.stars && (
                  <span
                    className="text-lime"
                    aria-label={`${item.stars} ${t.starWord}`}
                  >
                    {"★".repeat(Number(item.stars))}
                  </span>
                )}
              </div>
              <p className="flex-1 text-[13px] leading-relaxed text-bone/50">
                {item.desc}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Footer row: Profixio + licence info */}
        <Reveal delay={0.3}>
          <div className="mt-4 flex flex-col gap-0.5 sm:flex-row">
            <a
              href="https://profixio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[44px] flex-1 cursor-pointer items-center justify-between border border-line bg-panel p-5 transition-colors duration-200 hover:bg-panel-2 lg:px-7"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-bone/70">
                {t.profixioLabel}
              </span>
              <span
                className="text-bone/40 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <a
              href="https://tv.thebeach.one"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[44px] flex-1 cursor-pointer items-center justify-between border border-line bg-panel p-5 transition-colors duration-200 hover:bg-panel-2 lg:px-7"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-bone/70">
                {t.tvLabel}
              </span>
              <span
                className="text-bone/40 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <Link
              href={t.licenseHref}
              className="group flex min-h-[44px] flex-1 cursor-pointer items-center justify-between border border-line bg-panel p-5 transition-colors duration-200 hover:bg-panel-2 lg:px-7"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-bone/70">
                {t.licenseLabel}
              </span>
              <span
                className="text-bone/40 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
