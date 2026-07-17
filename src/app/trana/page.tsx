import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import Ticker from "@/components/Ticker";
import TranaHero from "@/components/trana/TranaHero";
import CourseLadder from "@/components/trana/CourseLadder";
import PhotoMarquee from "@/components/trana/PhotoMarquee";
import PathFinder from "@/components/trana/PathFinder";
import TrainingGroups from "@/components/trana/TrainingGroups";
import YouthTraining from "@/components/trana/YouthTraining";
import PtGroup from "@/components/trana/PtGroup";
import SchoolsCompanies from "@/components/trana/SchoolsCompanies";
import Membership from "@/components/trana/Membership";
import Coaches from "@/components/trana/Coaches";
import TranaCTA from "@/components/trana/TranaCTA";

export const metadata: Metadata = {
  title: "Träna — The Beach | Beachvolleykurser i Stockholm",
  description:
    "~800 spelare tränar varje vecka. Kurser och träningsgrupper för alla nivåer — nybörjare till avancerad, barn & ungdom, PT-grupp och skolor. Ledda av landslagscoacher på The Beach i Huddinge sedan 2006.",
  openGraph: {
    title: "Träna — The Beach",
    description:
      "Kurser och träningsgrupper för alla nivåer. Grundkurs 795 kr. Höstsäsong 2026 start 30 aug. The Beach, Novavägen 35, Huddinge.",
    type: "website",
  },
};

export default function TranaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero — bg-base (dark) */}
        <TranaHero />
        <Ticker />
        {/* 1b. Hitta din väg — bg-panel (dark) */}
        <PathFinder />
        {/* 2. Kursstegen — bg-cream (light) */}
        <CourseLadder />
        {/* 2b. Fotoremsa — folk som tränar */}
        <PhotoMarquee />
        {/* 3. Träningsgrupper — bg-panel (dark) */}
        <TrainingGroups />
        {/* 4. Barn & ungdom — bg-mint (accent/light) */}
        <YouthTraining />
        {/* 5. PT-grupp — bg-black (dark) */}
        <PtGroup />
        {/* 6. Skolor & företag — bg-cream (light) */}
        <SchoolsCompanies />
        {/* 7. Coacher — bg-black (dark) */}
        <Coaches />
        {/* 8. Bli medlem — bg-cream (light) */}
        <Membership />
        {/* 9. CTA — bg-lime (accent/light) */}
        <TranaCTA />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
