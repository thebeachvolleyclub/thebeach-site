import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * Avslutande CTA — lime accent section.
 * Primary: Se hela kalendern → thebeach.se/kalender/
 * Secondary: Boka bana → MATCHi
 * Tertiary: Vill du träna regelbundet? → /trana
 */

export default function KalenderCTA() {
  return (
    <section
      id="cta"
      className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          {/* eyebrow override: .eyebrow hard-codes lime color — fails on lime bg */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Kom igång
          </p>
          <h2 className="mb-8 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Redo att spela
            <br />
            <span className="italic-accent !text-black/70">på The Beach?</span>
          </h2>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* Primary CTA */}
            <a
              href="#kommande"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors duration-300 hover:bg-black/80"
            >
              Se hela kalendern <span aria-hidden="true">→</span>
            </a>

            {/* Secondary CTA */}
            <a
              href="/boka"
              className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 border border-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-black/10"
            >
              Boka bana <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Tertiary link */}
          <div className="mt-6">
            <Link
              href="/trana"
              className="cursor-pointer text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-black/50 underline-offset-4 transition-colors hover:text-black hover:underline"
            >
              Vill du träna regelbundet? Läs om träningsgrupperna →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
