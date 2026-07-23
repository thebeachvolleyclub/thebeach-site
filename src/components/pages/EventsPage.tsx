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
import type { Locale } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";

/** JSON-LD — texter ur ordboken, priserna (745/945/1195) är låsta. */
function eventsLd(locale: Locale) {
  const t = eventsDict[locale];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.jsonld.name,
    serviceType: "Event venue",
    provider: { "@type": "SportsActivityLocation", "@id": "https://thebeach.one/#business", name: "The Beach" },
    areaServed: "Stockholm",
    description: t.jsonld.description,
    offers: [
      { "@type": "Offer", name: "Las Palmas", price: "745", priceCurrency: "SEK", description: t.jsonld.offers.lasPalmas },
      { "@type": "Offer", name: "Algarve", price: "945", priceCurrency: "SEK", description: t.jsonld.offers.algarve },
      { "@type": "Offer", name: "Miami", price: "1195", priceCurrency: "SEK", description: t.jsonld.offers.miami },
    ],
  };
}

export default function EventsPage({ locale }: { locale: Locale }) {
  return (
    <>
      <JsonLd data={eventsLd(locale)} />
      <Navbar locale={locale} />
      <main className="flex-1">
        <EventHero locale={locale} />
        <Ticker locale={locale} />
        {/* Fotoremsa — roteras per sidladdning, caia3_bianca alltid #2 */}
        <EventPhotoMarquee locale={locale} />
        <EventPaths locale={locale} />
        <PricingTiers locale={locale} />
        <DayBand locale={locale} />
        <ConferenceBand locale={locale} />
        <KidsSection locale={locale} />
        <PrivateSection locale={locale} />
        <EventCTA locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
