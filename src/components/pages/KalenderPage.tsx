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
import Newsletter from "@/components/Newsletter";
import type { Locale } from "@/lib/i18n";

/**
 * Section rhythm (dark/light alternation):
 * 1. KalenderHero    — bg-black (dark)
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
export default function KalenderPage({ locale }: { locale: Locale }) {
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <KalenderHero locale={locale} />
        <Ticker locale={locale} />
        <UpcomingEvents locale={locale} />
        <EventTypes locale={locale} />
        <SeasonRhythm locale={locale} />
        <Tournaments locale={locale} />
        <CourtBooking locale={locale} />
        <Newsletter locale={locale} />
        <KalenderCTA locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
