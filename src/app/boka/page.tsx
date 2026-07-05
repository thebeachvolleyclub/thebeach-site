import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CourtBooking from "@/components/kalender/CourtBooking";

export const metadata: Metadata = {
  alternates: {
    canonical: "/boka",
    languages: { sv: "/boka", en: "/en/book", "x-default": "/boka" },
  },
  title: "Boka bana — The Beach | Så funkar det",
  description:
    "Boka beachvolleybana i Huddinge — 10 banor inomhus, 7 utomhus, 1,5 h per pass, upp till 8 spelare. Priser, tider och allt du behöver veta innan du bokar via MATCHi.",
  openGraph: {
    title: "Boka bana — The Beach",
    description:
      "Så bokar du bana på The Beach: priser, tider och hur MATCHi funkar.",
    type: "website",
  },
};

const STEG = [
  { rubrik: "Välj tid", text: "Alla lediga tider ligger i MATCHi. Ett pass är 1,5 timme och banan rymmer upp till 8 spelare — priset är per bana, inte per person." },
  { rubrik: "Boka & betala", text: "Skapa ett gratis MATCHi-konto (funkar för alla racket- och bollhallar i Sverige) och betala direkt i appen eller på webben." },
  { rubrik: "Kom och spela", text: "Bollar ingår och finns i hallen. Omklädningsrum, 14 duschar och servering finns på plats. Kom ombytt eller byt om här — barfota i sanden gäller." },
];

export default function BokaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          minH="min-h-[56svh]"
          eyebrow="Boka bana"
          title={<>Sand, boll och<br /><span className="italic-accent">1,5 timme</span></>}
          intro="10 banor inomhus och 7 utomhus i Huddinge, 15 min från Stockholm C. Här är allt du behöver veta innan du bokar — själva bokningen sker tryggt via MATCHi."
          cta={
            <a
              href="https://www.matchi.se/facilities/thebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Öppna MATCHi <span aria-hidden="true">→</span>
            </a>
          }
        />

        {/* Så funkar det */}
        <section className="bg-base px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">Så funkar det</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Tre steg till sanden
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
            {STEG.map((s, i) => (
              <Reveal key={s.rubrik} delay={i * 0.06} className="border border-white/10 bg-white/[0.03] p-7 lg:p-10">
                <span className="mb-4 block font-display text-3xl text-lime/40">0{i + 1}</span>
                <h3 className="mb-3 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">{s.rubrik}</h3>
                <p className="text-sm leading-relaxed text-bone/55">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Priser + MATCHi-CTA (befintlig sektion) */}
        <CourtBooking />

        {/* Alternativ */}
        <section className="bg-mint px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <Reveal>
              <h2 className="mb-2 font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                Hellre träna med coach eller boka event?
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-black/50">
                Kurser och träningsgrupper hittar du under Träna. Firmafest,
                teamdag eller kalas? Vi skräddarsyr.
              </p>
            </Reveal>
            <Reveal delay={0.06} className="flex shrink-0 flex-wrap gap-3">
              <Link href="/trana" className="cursor-pointer bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85">
                Träna →
              </Link>
              <Link href="/events" className="cursor-pointer border border-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black hover:text-lime">
                Boka event →
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
