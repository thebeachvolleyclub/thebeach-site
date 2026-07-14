import type { Metadata } from "next";
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

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;


export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { sv: "/", en: "/en", "x-default": "/" },
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Ticker />
        <QuickNav />
        <Story />
        <PhotoBreak
          src="/media/basecamp.webp"
          alt="Hallen på The Beach — 3 000 m² sand"
          kicker="Anläggningen"
          caption="3 000 m² sand. 15 min från Stockholm City."
        />
        <Events />
        <Calendar />
        <EventForm />
        <Training />
        <AppSection />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
