import Link from "next/link";
import Reveal from "./Reveal";
import EventCarousel from "./EventCarousel";
import type { Locale } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";

/** Startsidans eventsektion — paket och texter ur src/lib/i18n/home.ts.
 *  Planerarlänken följer språket: /events/planera (sv) resp. /en/events/plan (en). */
export default function Events({ locale = "sv" }: { locale?: Locale }) {
  const t = homeDict[locale].events;
  return (
    <section className="bg-white px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <Reveal className="mb-10 lg:mb-16 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
        <div>
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
            {t.eyebrow}
          </span>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.title1}
            <br />
            {t.title2}
          </h2>
        </div>
        <div className="mt-3 max-w-xs lg:mt-0 lg:text-right">
          <p className="mb-3 text-sm leading-relaxed text-black/40">
            {t.lead}
          </p>
          <div className="flex flex-col gap-1.5 lg:items-end">
            <Link href={t.linkPlannerHref} className="text-xs font-bold uppercase tracking-[0.1em] text-black underline-offset-4 hover:underline">
              {t.linkPlanner}
            </Link>
            <Link href={t.linkCustomHref} className="text-xs font-bold uppercase tracking-[0.1em] text-lime [text-shadow:0_0_1px_rgba(0,0,0,0.4)]">
              <span className="text-orange">{t.linkCustom}</span>
            </Link>
          </div>
        </div>
      </Reveal>

      <EventCarousel packages={t.packages} locale={locale} />

      {/* Conference add-on */}
      <div className="mt-0.5 flex flex-col items-start gap-4 bg-mint p-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:p-11">
        <div>
          <h3 className="mb-1.5 font-display text-[22px] uppercase text-black lg:text-[28px]">
            {t.confTitle}
          </h3>
          <p className="max-w-xl text-sm leading-snug text-black/50">
            {t.confDesc}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-6">
          <div className="font-display text-[28px] text-black lg:text-[32px]">
            {t.confPrice} <span className="font-body text-[13px] font-normal text-black/40">{t.confUnit}</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-10 flex flex-col items-start gap-4 border-t border-black/10 pt-8 lg:mt-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:pt-12">
        <p className="max-w-xl text-sm leading-relaxed text-black/40 lg:text-[15px]">
          {t.outro}
        </p>
        <Link
          href={t.outroCtaHref}
          className="shrink-0 cursor-pointer bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright"
        >
          <span className="sm:hidden">{t.outroCtaShort}</span>
          <span className="hidden sm:inline">{t.outroCtaLong}</span>
        </Link>
      </div>
    </section>
  );
}
