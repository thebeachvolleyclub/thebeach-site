import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Story from "@/components/Story";
import Calendar from "@/components/Calendar";
import Events from "@/components/Events";
import EventForm from "@/components/EventForm";
import AppSection from "@/components/AppSection";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import PhotoQuickNav from "@/components/mock/PhotoQuickNav";
import PhotoBreak from "@/components/mock/PhotoBreak";
import TrainingPhoto from "@/components/mock/TrainingPhoto";
import MockBadge from "@/components/mock/MockBadge";

export const metadata: Metadata = {
  title: "MOCKUP V1 — Startsida med mer bilder",
  robots: { index: false, follow: false },
};

/** MOCKUP V1 — "Photo-forward": photo quick-nav, parallax break, photo in training. */
export default function MockHomeV1() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Ticker />
        <PhotoQuickNav />
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
        <TrainingPhoto />
        <AppSection />
        <Newsletter />
      </main>
      <Footer />
      <MockBadge label="V1 Photo-forward" />
    </>
  );
}
