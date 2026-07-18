import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SkolaFormClient from "@/components/skola/SkolaFormClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/skola",
    languages: { sv: "/skola", en: "/en/school", "x-default": "/skola" },
  },
  title: "Skolor — The Beach | En roligare idrottslektion i Huddinge",
  description:
    "Ta med klassen till Stockholms beachvolleyarena. 100 kr/elev för 1,5 timme — allt ingår. Instruktörsledd beachvolleyskola, turneringar och gratis fortbildning för idrottslärare.",
  openGraph: {
    title: "Skolor — The Beach",
    description:
      "En roligare idrottslektion: beachvolley för skolklasser på The Beach i Huddinge. 100 kr/elev, allt ingår.",
    type: "website",
  },
};

const INGAR = [
  "10 banor inomhus — plats för hela klassen",
  "Nät, linjer, antenner och bollar",
  "14 duschar och omklädningsrum",
  "Medföljande lärare deltar gratis",
  "Värme året runt — sommar även i januari",
  "Parkering och pendel (Flemingsberg/Stuvsta) nära",
];

const PRISER = [
  { rubrik: "Spela själva", pris: "100 kr", enhet: "/elev · 1,5 h", desc: "Läraren håller i trådarna, vi står för banor och allt material. Förläng med 30 kr/elev per extra halvtimme." },
  { rubrik: "Beachvolleyskola + turnering", pris: "1 500 kr", enhet: "upp till 40 elever", desc: "Vår instruktör kör uppvärmning, teknikskola och avslutande turnering. 2 000 kr för fler än 40 elever. Tillkommer utöver elevpriset." },
  { rubrik: "Fortbildning för idrottslärare", pris: "Gratis", enhet: "för grupper", desc: "Är ni några idrottslärare som vill lära er mer om beachvolley? Vi bjuder på fortbildning — hör av dig så bokar vi in ett pass." },
];

export default function SkolaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Skolor"
          title={<>En roligare<br /><span className="italic-accent">idrottslektion</span></>}
          intro="Ta med klassen till Stockholms beachvolleyarena i Huddinge. Sand mellan tårna, rörelse och spel för alla — inga förkunskaper krävs, allt material ingår."
          cta={
            <a
              href="#forfragan"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Skicka förfrågan <span aria-hidden="true">→</span>
            </a>
          }
        />

        {/* Vad ingår */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              Allt ingår
            </p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              Kom som ni är —<br />vi har resten
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
            {INGAR.map((f, i) => (
              <Reveal key={f} delay={i * 0.05} className="border border-black/10 bg-white p-6 lg:p-8">
                <span className="mb-3 block text-lime [text-shadow:0_0_1px_rgba(0,0,0,0.35)]">↗</span>
                <p className="text-[15px] leading-snug text-black/70">{f}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Priser */}
        <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">Pris</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Enkelt att räkna på
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
            {PRISER.map((p, i) => (
              <Reveal key={p.rubrik} delay={i * 0.06} className="flex flex-col border border-white/10 bg-white/[0.03] p-7 lg:p-10">
                <h3 className="mb-4 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">
                  {p.rubrik}
                </h3>
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-lime lg:text-5xl">{p.pris}</span>
                  <span className="text-[13px] text-bone/45">{p.enhet}</span>
                </div>
                <p className="text-sm leading-relaxed text-bone/55">{p.desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-8 border-l-2 border-lime/60 bg-white/[0.03] p-6 lg:p-8">
            <p className="max-w-3xl text-sm leading-relaxed text-bone/55">
              <strong className="text-bone/80">Bra att veta:</strong> för att kunna
              hålla skolpriset lågt kör vi enkel service dagtid — ansvarig lärare
              följer med klassen och hjälper till med ordningen. Bäst tillgång på
              banor är vardagar 07–16.
            </p>
          </Reveal>
        </section>

        {/* Förfrågan */}
        <section id="forfragan" className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
                Boka skolbesök
              </p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black lg:text-[clamp(2.75rem,4.5vw,4.5rem)]">
                Skicka en förfrågan —<br />vi löser resten
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-black/60">
                Berätta när ni vill komma och hur många ni är, så återkommer vi
                inom 24 timmar med förslag. Det går lika bra att mejla direkt
                till boka@thebeach.one.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <SkolaFormClient />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
