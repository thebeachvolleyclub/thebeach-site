import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import EventCTA from "@/components/events/EventCTA";
import Snabbfakta from "@/components/lokalen/Snabbfakta";
import Planlosning from "@/components/lokalen/Planlosning";
import Galleri from "@/components/lokalen/Galleri";
import Filmer from "@/components/lokalen/Filmer";
import { HERO } from "@/lib/lokalen";

export const metadata: Metadata = {
  alternates: { canonical: "/lokalen" },
  title: "Lokalen — The Beach | Eventlokal för 10–900 gäster i Stockholm",
  description:
    "Se lokalen: 3 150 m² med 10 sandbanor inomhus och 7 utomhus, scen, bar och kök. Planlösning, bilder och fakta för dig som planerar kickoff, fest, konferens eller mässa.",
  openGraph: {
    title: "Lokalen — The Beach",
    description:
      "3 150 m² eventlokal i Huddinge. Planlösning, bilder och snabbfakta för eventbyråer och eventbokare.",
    type: "website",
  },
};

const lokalenLd = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  name: "The Beach",
  description:
    "Inomhus beacharena och eventlokal på 3 150 m² med 10 sandbanor inomhus, 7 utomhus, scen, bar och kök. Plats för upp till 900 gäster.",
  maximumAttendeeCapacity: 900,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Novavägen 35",
    addressLocality: "Huddinge",
    addressCountry: "SE",
  },
  url: "https://thebeach.one/lokalen",
};

const ARGUMENT = [
  { rubrik: "Aktivitet som bryter isen", text: "Beachvolley funkar oavsett kondition, ålder eller vem som är chef. Ingen behöver vara bra." },
  { rubrik: "Mat och dryck i huset", text: "Eget kök och bar — buffé, BBQ eller sittande middag. Ingen extern catering att koordinera." },
  { rubrik: "Scen, ljud och ljus", text: "Fast scen med riggat ljud och ljus. Ta in artist, DJ eller talare utan att bygga från noll." },
  { rubrik: "Er logga i hela huset", text: "Solnedgångsväggen bakom scenen blir er. Sju skärmar kör er grafik: 85\" i loungen, 75\" i entrén, 65\" i vardera omklädningsrum och 55\" i toalettrummet — plus två mobila 55\" på hjul. Fyra styrs från vårt CMS, tre via Chrome, USB eller HDMI. Därtill vepor, tyger och skyltning." },
  { rubrik: "En kontakt hela vägen", text: "Samma person från förfrågan till avslutad kväll. Inga överlämningar mitt i." },
  { rubrik: "20 minuter från city", text: "Huddinge, gratis parkering utanför dörren. Enkelt för alla att ta sig till." },
];

export default function LokalenPage() {
  return (
    <>
      <JsonLd data={lokalenLd} />
      <Navbar />
      <main className="flex-1">
        <section className="relative min-h-[70svh] w-full overflow-hidden bg-black">
          <Image src={HERO.fil} alt={HERO.alt} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/35" />
          <div className="relative z-10 flex min-h-[70svh] flex-col justify-end px-5 pb-14 sm:px-8 lg:px-14 lg:pb-20">
            <div className="mx-auto w-full max-w-6xl">
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-lime">Lokalen</p>
              <h1 className="mb-5 max-w-3xl font-display text-[clamp(2.5rem,11vw,5.5rem)] uppercase leading-[0.88] tracking-[-0.02em] text-white">
                3 150 m² sand
                <br />
                <span className="italic-accent">mitt i Stockholm</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-white/85 lg:text-base">
                En hall som blir vad ni gör den till — konferens på dagen, bankett på kvällen,
                turnering på helgen. Plats för upp till 900 gäster.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#forfragan" className="rounded-full bg-lime px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90">
                  Boka en visning
                </a>
                <a href="#planlosning" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white">
                  Se planlösningen
                </a>
              </div>
            </div>
          </div>
        </section>

        <Snabbfakta />
        <Planlosning />
        <Galleri />
        <Filmer />

        <section className="bg-sand px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">För dig som planerar</p>
              <h2 className="mb-10 font-display text-[clamp(2rem,7vw,3.25rem)] uppercase leading-[0.95] tracking-[-0.02em] text-black">
                Allt på ett ställe
              </h2>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ARGUMENT.map((k) => (
                <div key={k.rubrik} className="border-t border-black/15 pt-4">
                  <h3 className="mb-2 text-base font-semibold text-black">{k.rubrik}</h3>
                  <p className="text-sm leading-relaxed text-black/60">{k.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <EventCTA />
      </main>
      <Footer />
    </>
  );
}
