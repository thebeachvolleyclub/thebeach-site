import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";

export default function Membership({ locale }: { locale: Locale }) {
  const t = tranaDict[locale].membership;
  return (
    <section
      id="bli-medlem"
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
            {t.titlePre}{" "}
            <span className="text-black/55">
              {t.titleAccent}
            </span>
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-black/50">
            {t.lead}
          </p>
        </div>

        {/* Price tier badges */}
        <div className="flex shrink-0 gap-3">
          {t.tiers.map((tier) => (
            <div
              key={tier.label}
              className="flex flex-col items-center border border-black/10 bg-white px-6 py-5"
            >
              <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                {tier.label}
              </span>
              <span className="font-display text-2xl text-black">{tier.price}</span>
              <span className="text-[11px] text-black/40">{tier.unit}</span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Benefits + CTA */}
      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">
        {/* Benefits list */}
        <Reveal className="border border-black/10 bg-white p-7 lg:p-10">
          <h3 className="mb-5 font-display text-2xl uppercase leading-none text-black">
            {t.benefitsTitle}
          </h3>
          <ul className="border-t border-black/10">
            {t.benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 border-b border-black/10 py-3 text-sm leading-snug text-black/60"
              >
                <span className="mt-0.5 shrink-0 text-black/30" aria-hidden="true">
                  ↗
                </span>
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* CTA panel */}
        <Reveal
          delay={0.08}
          className="relative flex flex-col justify-between overflow-hidden border border-black/10 bg-white p-7 lg:p-10"
        >
          {/* coach.webp used as subtle background accent */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/coach.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.07]"
          />
          <div className="relative">
            <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              {t.panel.eyebrow}
            </p>
            <h3 className="mb-4 font-display text-3xl uppercase leading-none text-black">
              {t.panel.title1}
              <br />
              {t.panel.title2}
            </h3>
            <p className="mb-8 text-sm leading-relaxed text-black/55">
              {t.panel.body}
            </p>
            <a
              href="https://www.matchi.se/facilities/thebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors duration-300 hover:bg-black/80"
            >
              {t.panel.cta} <span aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
