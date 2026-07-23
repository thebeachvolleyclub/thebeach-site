import Reveal from "./Reveal";
import Counter from "./Counter";
import type { Locale } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";

/** Lime credibility section — kompakt: ett stycke, stats, quote, CTA.
 *  Texterna ur startsidans ordbok (src/lib/i18n/home.ts). */
export default function Story({ locale = "sv" }: { locale?: Locale }) {
  const t = homeDict[locale].story;
  return (
    <section
      id="om-oss"
      className="grid grid-cols-1 gap-12 bg-lime px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-14 lg:py-28"
    >
      <Reveal>
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
          {t.eyebrow}
        </span>
        <h2 className="mb-6 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
          {t.title1}
          <br />
          {t.title2}
        </h2>

        <p className="mb-4 max-w-lg text-[15px] leading-[1.7] text-black/65 lg:text-[17px]">
          {t.lead}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {t.badges.map((b) => (
            <span key={b} className="bg-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-lime">{b}</span>
          ))}
        </div>
        <div className="my-8 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-black/15 pt-8 sm:grid-cols-4 lg:my-10">
          {t.stats.map((s) => (
            <div key={s.lbl}>
              <div className="font-display text-[40px] uppercase leading-none text-black lg:text-[48px]">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black/45">
                {s.lbl}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8 border-l-[2.5px] border-black pl-5">
          <p className="mb-2 text-[17px] italic leading-snug text-black">
            {t.quote}
          </p>
          <cite className="text-[10px] font-bold uppercase not-italic tracking-[0.15em] text-black/45">
            {t.cite}
          </cite>
        </div>

        {/* CTA — nästa steg direkt i sektionen */}
        <div className="flex flex-wrap gap-3">
          <a
            href={t.ctaBookHref}
            className="inline-flex cursor-pointer items-center gap-2 bg-black px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-opacity duration-300 hover:opacity-80"
          >
            {t.ctaBook} <span aria-hidden="true">→</span>
          </a>
          <a
            href={t.ctaStoryHref}
            className="inline-flex cursor-pointer items-center gap-2 border border-black/30 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-black hover:text-lime"
          >
            {t.ctaStory} <span aria-hidden="true">→</span>
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-black lg:aspect-[3/4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/landslag-fotosession.webp"
              alt={t.imgAlt}
              className="h-full w-full object-cover object-[50%_18%]"
              loading="lazy"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/patterns/linePatternB-green.svg"
              alt=""
              aria-hidden="true"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to top, #000 0%, #000 22%, transparent 58%)",
                maskImage:
                  "linear-gradient(to top, #000 0%, #000 22%, transparent 58%)",
              }}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-screen"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-5 pt-8 text-xs font-semibold text-white/90">
              {t.imgCaption}
            </div>
          </div>
          <div className="absolute -right-3 -top-3 flex h-24 w-24 items-center justify-center bg-black text-center font-display text-[11px] uppercase leading-tight tracking-[0.08em] text-lime">
            {t.cornerBadge[0]}
            <br />
            {t.cornerBadge[1]}
            <br />
            {t.cornerBadge[2]}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
