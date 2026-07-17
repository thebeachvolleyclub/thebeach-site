import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import JsonLd from "@/components/JsonLd";
import EventHero from "@/components/events/EventHero";
import EventPaths from "@/components/events/EventPaths";
import EventPhotoMarquee from "@/components/events/EventPhotoMarquee";
import PricingTiers from "@/components/events/PricingTiers";
import DayBand from "@/components/events/DayBand";
import ConferenceBand from "@/components/events/ConferenceBand";
import KidsSection from "@/components/events/KidsSection";
import PrivateSection from "@/components/events/PrivateSection";
import EventCTA from "@/components/events/EventCTA";

export const metadata: Metadata = {
  alternates: {
    canonical: "/events",
    languages: { sv: "/events", en: "/en/events", "x-default": "/events" },
  },
  title: "Boka event — The Beach | Beachvolley & strandevent i Stockholm",
  description:
    "Boka ett event som sticker ut. Färdiga koncept för företag, barnkalas, privata fester och skräddarsydda event. Kväll eller dagtid — 10–900 gäster. Novavägen 35, Huddinge.",
  openGraph: {
    title: "Boka event — The Beach",
    description:
      "Sand mellan tårna mitt i Stockholm. Färdiga eventkoncept med aktivitet, mat och dryck. Las Palmas, Algarve, Miami och skräddarsytt.",
    type: "website",
  },
};

const eventsLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Företagsevent & event på The Beach",
  serviceType: "Event venue",
  provider: { "@type": "SportsActivityLocation", "@id": "https://thebeach.one/#business", name: "The Beach" },
  areaServed: "Stockholm",
  description:
    "Färdiga eventkoncept med beachvolley, mat och dryck — kickoff, konferens, teambuilding, AW och firmafest för 10–900 gäster.",
  offers: [
    { "@type": "Offer", name: "Las Palmas", price: "745", priceCurrency: "SEK", description: "Enkelt & socialt — 1,5 h beachvolley med instruktör, tapas och dryck." },
    { "@type": "Offer", name: "Algarve", price: "945", priceCurrency: "SEK", description: "Mest bokad — aktivitet och middagsbuffé." },
    { "@type": "Offer", name: "Miami", price: "1195", priceCurrency: "SEK", description: "Helkväll — BBQ-buffé och två dryckesenheter." },
  ],
};

export default function EventsPage() {
  return (
    <>
      <JsonLd data={eventsLd} />
      <Navbar />
      <main className="flex-1">
        <EventHero />
        <Ticker />
        {/* Fotoremsa — roteras per sidladdning, caia3_bianca alltid #2 */}
        <EventPhotoMarquee />
        <EventPaths />
        <PricingTiers />
        <DayBand />
        <ConferenceBand />
        <KidsSection />
        <PrivateSection />
        <EventCTA />
      </main>
      <Footer />
    </>
  );
}
