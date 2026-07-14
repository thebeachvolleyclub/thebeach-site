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
import GalleryMosaic from "@/components/mock/GalleryMosaic";
import TrainingPhoto from "@/components/mock/TrainingPhoto";
import MockBadge from "@/components/mock/MockBadge";

export const metadata: Metadata = {
  title: "MOCKUP V2 — Startsida, max bilder",
  robots: { index: false, follow: false },
};

/** MOCKUP V2 — "Full gallery": everything in V1 + photo mosaic + second break. */
export default function MockHomeV2() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Ticker />
        <PhotoQuickNav />
        <Story />
        <GalleryMosaic />
        <Events />
        <PhotoBreak
          src="/media/landslag-standing.webp"
          alt="Svenska landslaget på The Beach"
          kicker="Nationell träningsbas"
          caption="Världens bästa tränar här. Du också."
        />
        <Calendar />
        <EventForm />
        <TrainingPhoto />
        <AppSection />
        <Newsletter />
      </main>
      <Footer />
      <MockBadge label="V2 Full gallery" />
    </>
  );
}
