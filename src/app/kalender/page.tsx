import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import KalenderHero from "@/components/kalender/KalenderHero";
import UpcomingEvents from "@/components/kalender/UpcomingEvents";
import EventTypes from "@/components/kalender/EventTypes";
import SeasonRhythm from "@/components/kalender/SeasonRhythm";
import Tournaments from "@/components/kalender/Tournaments";
import CourtBooking from "@/components/kalender/CourtBooking";
import KalenderCTA from "@/components/kalender/KalenderCTA";

export const metadata: Metadata = {
  title: "Kalender — The Beach | Schema & händelser i Stockholm",
  description:
    "Träningsgrupper, seriespel, turneringar och event — allt som händer på The Beach i Huddinge, året runt. Boka bana via MATCHi eller prenumerera på kalendern.",
  openGraph: {
    title: "Kalender — The Beach",
    description:
      "Se kommande träningsgrupper, seriespel, SBT-turneringar och Mixed på The Beach, Novavägen 35, Huddinge.",
    type: "website",
  },
};

/**
 * Section rhythm (dark/light alternation):
 * 1. KalenderHero    — bg-base (dark)
 * 2. Ticker          — accent strip
 * 3. UpcomingEvents  — bg-cream (light)
 * 4. EventTypes      — bg-panel (dark)
 * 5. SeasonRhythm    — bg-cream (light)
 * 6. Tournaments     — bg-black (dark)
 * 7. CourtBooking    — bg-cream (light)
 * 8. SubscribeCalendar — bg-panel (dark)
 * 9. KalenderCTA     — bg-lime (accent/light)
 * Never >2 consecutive dark sections.
 */
export default function KalenderPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <KalenderHero />
        <Ticker />
        <UpcomingEvents />
        <EventTypes />
        <SeasonRhythm />
        <Tournaments />
        <CourtBooking />
        <KalenderCTA />
      </main>
      <Footer />
    </>
  );
}
