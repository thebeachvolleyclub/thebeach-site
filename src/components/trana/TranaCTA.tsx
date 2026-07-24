import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";

export default function TranaCTA({ locale }: { locale: Locale }) {
  const t = tranaDict[locale].cta;
  return (
    <section
      id="kom-igang"
      className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          {/* eyebrow override on lime */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.eyebrow}
          </p>
          <h2 className="mb-6 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.title1}
            <br />
            <span className="italic-accent !text-black/70">{t.titleAccent}</span>
          </h2>
          <p className="mb-10 max-w-md text-sm leading-relaxed text-black/60">
            {t.body}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="https://www.matchi.se/facilities/thebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors duration-300 hover:bg-black/80"
            >
              {t.ctaMatchi} <span aria-hidden="true">→</span>
            </a>
            <a
              href="mailto:boka@thebeach.one"
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 border border-black/30 px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:border-black hover:bg-black/5"
            >
              {t.ctaContact}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-8 text-[0.75rem] text-black/50">
            {t.competePre}
            <Link
              href={t.competeHref}
              className="font-semibold underline underline-offset-4 transition-colors hover:text-black/80"
            >
              {t.competeLabel}
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
