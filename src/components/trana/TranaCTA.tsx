import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function TranaCTA() {
  return (
    <section
      id="kom-igang"
      className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          {/* eyebrow override on lime */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Nästa steg
          </p>
          <h2 className="mb-6 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Redo att
            <br />
            <span className="italic-accent !text-black/70">börja?</span>
          </h2>
          <p className="mb-10 max-w-md text-sm leading-relaxed text-black/60">
            Anmäl dig direkt via MATCHi — där hittar du kurser, träningsgrupper
            och medlemskap på ett ställe. Frågor? Hör av dig till oss.
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
              Anmäl dig via MATCHi <span aria-hidden="true">→</span>
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
            Vill du tävla?{" "}
            <Link
              href="/kalender"
              className="font-semibold underline underline-offset-4 transition-colors hover:text-black/80"
            >
              Se kalendern →
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
