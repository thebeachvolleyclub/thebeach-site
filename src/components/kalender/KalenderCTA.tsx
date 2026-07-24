import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { kalenderDict } from "@/lib/i18n/kalender";

/**
 * Avslutande CTA — lime accent section.
 * Primary: Se hela kalendern → #kommande
 * Secondary: Boka bana → /boka resp. /en/book
 * Tertiary: Vill du träna regelbundet? → /trana resp. /en/training
 */

export default function KalenderCTA({ locale }: { locale: Locale }) {
  const t = kalenderDict[locale].cta;
  return (
    <section
      id="cta"
      className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          {/* eyebrow override: .eyebrow hard-codes lime color — fails on lime bg */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.eyebrow}
          </p>
          <h2 className="mb-8 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.title1}
            <br />
            <span className="italic-accent !text-black/70">{t.titleAccent}</span>
          </h2>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* Primary CTA */}
            <a
              href="#kommande"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors duration-300 hover:bg-black/80"
            >
              {t.ctaAll} <span aria-hidden="true">→</span>
            </a>

            {/* Secondary CTA */}
            <a
              href={t.ctaBookHref}
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-black/10"
            >
              {t.ctaBook} <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Tertiary link */}
          <div className="mt-6">
            <Link
              href={t.tertiaryHref}
              className="cursor-pointer text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-black/50 underline-offset-4 transition-colors hover:text-black hover:underline"
            >
              {t.tertiary}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
