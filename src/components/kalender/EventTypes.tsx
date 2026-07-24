import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Volleyball, Trophy, Users } from "@/components/icons";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { kalenderDict } from "@/lib/i18n/kalender";

/**
 * Så funkar det / Event-typer — evergreen overview of the three main
 * activity categories on The Beach calendar. Texterna kommer ur ordboken;
 * ikonerna hör till layouten och bor kvar här (indexerade i kortordning).
 */

const ICONS: ReactNode[] = [
  <Users key="users" className="h-5 w-5" />,
  <Trophy key="trophy" className="h-5 w-5" />,
  <Volleyball key="volleyball" className="h-5 w-5" />,
];

export default function EventTypes({ locale }: { locale: Locale }) {
  const t = kalenderDict[locale].types;
  return (
    <section
      id="sa-funkar-det"
      className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.title1}
            <br />
            <span className="italic-accent">{t.titleAccent}</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-bone/45 sm:text-right">
          {t.lead}
        </p>
      </Reveal>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
        {t.items.map((item, i) => (
          <Reveal
            key={item.no}
            delay={i * 0.08}
            className="flex flex-col border border-line bg-black p-7 lg:p-9"
          >
            {/* Number + icon row */}
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-bone/35">
                {item.no}
              </span>
              <span className="text-lime/60">{ICONS[i]}</span>
            </div>

            {/* Title */}
            <h3 className="mb-3 font-display text-2xl uppercase leading-[0.95] text-bone lg:text-3xl">
              {item.title}
            </h3>

            {/* Body */}
            <p className="mb-4 flex-1 text-[13px] leading-relaxed text-bone/50 lg:text-sm">
              {item.body}
            </p>

            {/* Optional note / quote */}
            {item.note && (
              <p className="mb-5 border-l-2 border-lime/40 pl-4 text-[12px] italic leading-snug text-bone/40">
                {item.note}
              </p>
            )}

            {/* CTA link */}
            {item.external ? (
              <a
                href={item.linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright"
              >
                {item.linkLabel}
              </a>
            ) : (
              <Link
                href={item.linkHref}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright"
              >
                {item.linkLabel}
              </Link>
            )}
          </Reveal>
        ))}
      </div>

      {/* Profixio external link note */}
      <Reveal delay={0.3}>
        <div className="mt-4 border border-white/10 bg-panel-2 p-5 lg:px-7">
          <p className="text-[13px] text-bone/40">
            {t.profixio.pre}
            <a
              href="https://profixio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone/70 underline underline-offset-2 hover:text-lime"
            >
              {t.profixio.label}
            </a>
            {t.profixio.mid}
            <Link href={t.profixio.trainHref} className="text-bone/70 underline underline-offset-2 hover:text-lime">
              {t.profixio.trainLabel}
            </Link>
            {t.profixio.post}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
