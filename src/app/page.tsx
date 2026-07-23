import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { altLang } from "@/lib/i18n";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;

// Svenska startsidans title/description/OG är sajtens standard och ligger i
// src/app/layout.tsx (liksom WebSite/SportsActivityLocation-JsonLd).
export const metadata: Metadata = {
  alternates: altLang("/", "/en", "sv"),
};

export default function Page() {
  return <HomePage locale="sv" />;
}
