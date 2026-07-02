import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Ticker from "@/components/Ticker";
import OmOssHero from "@/components/om-oss/OmOssHero";
import Historien from "@/components/om-oss/Historien";
import VadViStarFor from "@/components/om-oss/VadViStarFor";
import Anlaggningen from "@/components/om-oss/Anlaggningen";
import Manniskorna from "@/components/om-oss/Manniskorna";
import Siffror from "@/components/om-oss/Siffror";
import OmOssCTA from "@/components/om-oss/OmOssCTA";

export const metadata: Metadata = {
  title: "Om oss — The Beach | Beachvolley & strandevent i Stockholm",
  description:
    "Sedan 2006 har The Beach gett stockholmare plats att spela beachvolley året runt. 10 inomhusbanor + 7 utomhusbanor i Huddinge. Alla är välkomna.",
  openGraph: {
    title: "Om oss – The Beach",
    description:
      "Sedan 2006 har The Beach gett stockholmare plats att spela beachvolley året runt. 10 inomhusbanor + 7 utomhusbanor i Huddinge. Alla är välkomna.",
    type: "website",
  },
};

/**
 * Section rhythm (dark/light alternation — never >2 consecutive dark without a break):
 * 1. OmOssHero      — bg-base  (dark)
 * 2. Ticker         — accent strip
 * 3. Historien      — bg-cream (light)
 * 4. VadViStarFor   — bg-panel (dark)
 * 5. Anlaggningen   — bg-mint  (light/accent)
 * 6. Manniskorna    — bg-black (dark)
 * 7. Siffror        — bg-cream (light)
 * 8. OmOssCTA       — bg-lime  (light/accent)
 */
export default function OmOssPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero — bg-base (dark) */}
        <OmOssHero />
        <Ticker />
        {/* 3. Historien — bg-cream (light) */}
        <Historien />
        {/* 4. Vad vi står för — bg-panel (dark) */}
        <VadViStarFor />
        {/* 5. Anläggningen — bg-mint (light/accent) */}
        <Anlaggningen />
        {/* 6. Människorna — bg-black (dark) */}
        <Manniskorna />
        {/* 7. Siffror — bg-cream (light) */}
        <Siffror />
        {/* 8. CTA — bg-lime (light/accent) */}
        <OmOssCTA />
      </main>
      <Footer />
    </>
  );
}
