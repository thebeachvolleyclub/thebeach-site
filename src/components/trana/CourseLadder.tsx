import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";

export default function CourseLadder({ locale }: { locale: Locale }) {
  const t = tranaDict[locale].courses;
  return (
    <section
      id="kurser"
      className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          {/* eyebrow override: .eyebrow lime fails contrast on cream */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            {t.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            {t.title}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-black/50 sm:text-right">
          {t.lead}
        </p>
      </Reveal>

      {/* Course cards */}
      <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
        {t.items.map((c, i) => (
          <Reveal
            key={c.title}
            delay={i * 0.08}
            className="flex flex-col border border-black/10 bg-white p-7 lg:p-10"
          >
            {/* Number + tag row */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/30">
                {c.no}
              </span>
              <span className="bg-black/[0.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/60">
                {c.tag}
              </span>
            </div>

            {/* Title */}
            <h3 className="mb-3 font-display text-3xl uppercase leading-none text-black lg:text-4xl">
              {c.title}
            </h3>

            {/* Price */}
            {c.price ? (
              <div className="mb-1 flex items-baseline gap-1.5 text-[13px] text-black/40">
                <strong className="font-display text-xl text-black lg:text-2xl">
                  {c.price}
                </strong>
              </div>
            ) : (
              <div className="mb-1 text-[13px] text-black/40">
                {t.noPriceLabel}
              </div>
            )}
            {c.priceNote && (
              <p className="mb-4 text-[12px] leading-snug text-black/45">
                {c.priceNote}
              </p>
            )}
            {!c.priceNote && <div className="mb-4" />}

            {/* Details list */}
            <ul className="mb-5 flex-1 border-t border-black/10">
              {c.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 border-b border-black/10 py-2 text-xs leading-snug text-black/55"
                >
                  <span className="shrink-0 pt-0.5 text-black/30" aria-hidden="true">
                    ↗
                  </span>
                  {d}
                </li>
              ))}
            </ul>

            {/* Quote */}
            {c.quote && (
              <blockquote className="mb-5 border-l-2 border-lime pl-4 text-[13px] italic leading-snug text-black/50">
                &ldquo;{c.quote}&rdquo;
              </blockquote>
            )}

            {/* CTAs — deep links to each MATCHi course form */}
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
              {c.ctas.map((cta) => (
                <a
                  key={cta.href}
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 py-3 text-xs font-bold uppercase tracking-[0.1em] text-black transition-colors hover:text-black/60"
                >
                  {cta.label} <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Notis (endast en): MATCHi-flödet är på svenska */}
      {t.signupNote && (
        <Reveal delay={0.16}>
          <p className="mt-6 text-[13px] leading-snug text-black/50">
            {t.signupNote.pre}
            <a
              href={`mailto:${t.signupNote.email}`}
              className="font-semibold text-black underline underline-offset-2 hover:text-black/60"
            >
              {t.signupNote.email}
            </a>
            {t.signupNote.post}
          </p>
        </Reveal>
      )}
    </section>
  );
}
