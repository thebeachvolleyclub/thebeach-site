import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SolarStats from "@/components/SolarStats";

export const metadata: Metadata = {
  title: "Hållbarhet — The Beach | Soldriven beacharena i Huddinge",
  description:
    "Solen driver arenan, rörelsen driver människorna. The Beach körs till stor del på egen sol (72 kW + ~290 kWh batteri), och är en av Sveriges största beachvolleyklubbar. Hållbarhet vi mäter och visar — inte påstår.",
  alternates: { canonical: "/hallbarhet" },
};

// Sätts när grundarfotot (Årets Företagare) finns i public/media.
const FOUNDER_PHOTO: string | null = null;

export default function HallbarhetPage() {
  const cta = (
    <Link
      href="/events#forfragan"
      className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
    >
      Boka ett event <span aria-hidden="true">→</span>
    </Link>
  );

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Hållbarhet"
          title={<>Vi ger <span className="italic-accent">energi</span> — på riktigt</>}
          intro="Solen driver arenan. Rörelsen driver människorna. Hållbarhet hos oss är inget vi säger — det är något vi mäter och visar."
          cta={cta}
        />

        {/* Miljö */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-5">
              <p className="eyebrow mb-4" style={{ color: "#639922" }}>Miljö</p>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                Vi driver arenan på solen
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-[17px] leading-relaxed text-black/70">
                På taket sitter en solpark på 72 kW och ett batteri på ~290 kWh. Mitt på dagen går The Beach
                i princip helt på egen sol — det vi inte använder skickar vi ut på nätet till grannarna, och
                batteriet hjälper till att hålla hela elnätet i balans, själva förutsättningen för att Sverige
                ska kunna bygga ut mer förnybart. Huset värms med lokal fjärrvärme och byggdes med extra
                isolerade väggar. Att vi investerat i sol och batteri med 15–20 års återbetalning säger det
                viktigaste: vi menar allvar, och vi tänker vara kvar.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Live-siffror */}
        <SolarStats compact />

        {/* Socialt */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-5">
              <p className="eyebrow mb-4" style={{ color: "#639922" }}>Socialt</p>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                En arena ger energi åt två håll
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-[17px] leading-relaxed text-black/70">
                Här rör sig runt 800 människor i veckan, året runt, i alla åldrar från 3 till 99. Vår förening
                är en av Sveriges största — 443 medlemmar, nästan hälften kvinnor, och 250 barn och ungdomar.
                Vi är träningsbas för landslaget som tog OS-guld. Det är folkhälsa, gemenskap och jämställdhet
                på riktigt — motgift mot stillasittande och ensamhet.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Grundare / långsiktighet */}
        <section className="bg-base px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <p className="eyebrow mb-4">Långsiktighet</p>
              <h2 className="mb-5 font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-bone">
                Byggt och ägt av grundarna
              </h2>
              <p className="mb-6 text-[17px] leading-relaxed text-bone/60">
                Bakom The Beach står samma två personer sedan 2006. David och Mattias äger både anläggningen
                och bolaget som driver den, och har i 20 år återinvesterat allt i verksamheten. Mattias är
                förbundskapten för damlandslaget, och Rasmus Jonsson leder tillsammans med Anders herrlandslaget.
                Vi är en stolt medlem i Svenska Volleybollförbundet med ett djupt, väletablerat samarbete.
              </p>
              <p className="inline-flex items-center gap-3 border border-lime/40 bg-lime/10 px-5 py-3 text-sm font-semibold text-lime">
                Årets Företagare i Huddinge 2026
              </p>
              <div className="mt-8 flex items-center gap-4">
                <img src="/media/svenska-volleyboll.svg" alt="Svenska Volleybollförbundet" className="h-9 w-auto" />
                <span className="text-sm text-bone/50">Stolt medlem i Svenska Volleybollförbundet</span>
              </div>
            </Reveal>
            {FOUNDER_PHOTO ? (
              <Reveal delay={0.08}>
                <img
                  src={FOUNDER_PHOTO}
                  alt="David Cabrera och Mattias Magnusson med diplomen för Årets Företagare i Huddinge 2026"
                  className="w-full border border-white/10 object-cover"
                />
              </Reveal>
            ) : null}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-lime px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto flex max-w-[1500px] flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <Reveal>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                Vill ni lägga ert event under solen?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">
                Skicka en förfrågan så återkommer vi inom 24 timmar — och till varje företagsevent kan vi ta
                fram en rapport på hur mycket av dagen som drevs av sol.
              </p>
            </Reveal>
            <Reveal delay={0.06} className="shrink-0">
              <Link
                href="/events#forfragan"
                className="inline-flex cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                Skicka förfrågan <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
