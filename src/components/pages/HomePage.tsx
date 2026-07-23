import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import QuickNav from "@/components/QuickNav";
import Story from "@/components/Story";
import PhotoBreak from "@/components/PhotoBreak";
import Calendar from "@/components/Calendar";
import Events from "@/components/Events";
import EventForm from "@/components/EventForm";
import Training from "@/components/Training";
import AppSection from "@/components/AppSection";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import type { Locale } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";

/** Startsidan — en komponent, två texter (sv på /, en på /en).
 *  Ordboken: src/lib/i18n/home.ts. */
export default function HomePage({ locale }: { locale: Locale }) {
  const t = homeDict[locale];
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">
        <Hero locale={locale} />
        <Ticker locale={locale} />
        <QuickNav locale={locale} />
        <Story locale={locale} />
        <PhotoBreak
          src="/media/basecamp.webp"
          alt={t.photoBreak.alt}
          kicker={t.photoBreak.kicker}
          caption={t.photoBreak.caption}
        />
        <Events locale={locale} />
        <Calendar locale={locale} />
        <EventForm locale={locale} />
        <Training locale={locale} />
        <AppSection locale={locale} />
        <Newsletter locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
