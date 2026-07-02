import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import EventHero from "@/components/events/EventHero";
import EventPaths from "@/components/events/EventPaths";
import PricingTiers from "@/components/events/PricingTiers";
import DayBand from "@/components/events/DayBand";
import ConferenceBand from "@/components/events/ConferenceBand";
import KidsSection from "@/components/events/KidsSection";
import PrivateSection from "@/components/events/PrivateSection";
import EventCTA from "@/components/events/EventCTA";

export const metadata: Metadata = {
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

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <EventHero />
        <Ticker />
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
