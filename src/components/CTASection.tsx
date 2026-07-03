import { ArrowRight, Phone, MapPin } from "./icons";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function CTASection() {
  return (
    <section id="kontakt" className="bg-base py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-brass/25 bg-[radial-gradient(120%_140%_at_50%_-20%,#15414a_0%,#0f2a33_55%,#0b1a22_100%)] px-6 py-16 text-center sm:px-12 sm:py-24">
            {/* brass glow */}
            <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-brass/15 blur-[110px]" />

            <div className="relative mx-auto max-w-2xl">
              <p className="eyebrow mb-5">Redo för sanden?</p>
              <h2 className="text-4xl text-bone sm:text-6xl">
                Boka en bana — eller
                <br />
                <span className="italic-accent text-brass">hela stranden.</span>
              </h2>
              <p className="mt-6 text-lg font-light text-bone/70">
                Boka på minuten via MATCHi, eller hör av dig så planerar vi ditt
                nästa event tillsammans.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Magnetic className="w-full sm:w-auto">
                  <a
                    href="https://www.matchi.se/facilities/thebeach"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-brass px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-base transition-colors duration-300 hover:bg-brass-bright sm:w-auto"
                  >
                    Boka bana
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Magnetic>
                <a
                  href="mailto:boka@thebeach.one"
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-bone/25 px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:border-bone/45 hover:bg-bone/5 sm:w-auto"
                >
                  Skicka eventförfrågan
                </a>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 text-sm text-bone/60 sm:flex-row sm:gap-8">
                <a
                  href="tel:+46704322028"
                  className="inline-flex cursor-pointer items-center gap-2 transition-colors hover:text-bone"
                >
                  <Phone className="h-4 w-4 text-brass" />
                  070-432 20 28
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brass" />
                  Novavägen 35, Huddinge
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
