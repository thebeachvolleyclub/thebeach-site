import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import Calendar from "@/components/Calendar";
import Events from "@/components/Events";
import EventForm from "@/components/EventForm";
import AppSection from "@/components/AppSection";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import HeroClaim from "@/components/mock/HeroClaim";
import PhotoQuickNavV3 from "@/components/mock/PhotoQuickNavV3";
import StoryCompact from "@/components/mock/StoryCompact";
import PhotoBreak from "@/components/mock/PhotoBreak";
import TrainingPhoto from "@/components/mock/TrainingPhoto";
import MockBadge from "@/components/mock/MockBadge";

export const metadata: Metadata = {
  title: "MOCKUP V3 — Claim + Event & konferens + kompakt Basecamp",
  robots: { index: false, follow: false },
};

/** MOCKUP V3 — feedbackrundan: claim i heron, Event & konferens-tile,
 *  kortad Basecamp med CTA, bildupplägget från V1. */
export default function MockHomeV3() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroClaim />
        <Ticker />
        <PhotoQuickNavV3 />
        <StoryCompact />
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
      <MockBadge label="V3 Feedback" />
    </>
  );
}
