import Link from "next/link";
import Reveal from "@/components/Reveal";

/**
 * Avslutande CTA — lime accent section.
 * Primary: Boka bana → MATCHi
 * Secondary: Kontakta oss → mailto:boka@thebeach.se
 * Tertiary: Se träningsgrupper → /trana
 */

export default function OmOssCTA() {
  return (
    <section
      id="kom-forbi"
      className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          {/* eyebrow override: .eyebrow hard-codes lime color — fails on lime bg */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Kom förbi
          </p>
          <h2 className="mb-6 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Sanden{" "}
            <span className="italic-accent !text-black/70">är redo</span>
          </h2>
          <p className="mb-10 max-w-md text-sm leading-relaxed text-black/60">
            Boka en bana, hitta din träningsgrupp — eller låt oss bygga ditt
            nästa event. Sanden är redo.
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
              Boka bana <span aria-hidden="true">→</span>
            </a>
            <a
              href="mailto:boka@thebeach.se"
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 border border-black/30 px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:border-black hover:bg-black/5"
            >
              Kontakta oss
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.18}>
          <p className="mt-8 text-[0.75rem] text-black/50">
            Vill du träna regelbundet?{" "}
            <Link
              href="/trana"
              className="font-semibold underline underline-offset-4 transition-colors hover:text-black/80"
            >
              Se träningsgrupperna →
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
