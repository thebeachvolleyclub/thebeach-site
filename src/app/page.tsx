import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { altLang } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";
import { og } from "@/lib/seo";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;

// Svenska startsidans title/description/OG är sajtens standard och ligger i
// src/app/layout.tsx (liksom WebSite/SportsActivityLocation-JsonLd).
export const metadata: Metadata = {
  alternates: altLang("/", "/en", "sv"),
  openGraph: og("/", homeDict.sv.meta.ogTitle, homeDict.sv.meta.ogDescription),
};

export default function Page() {
  return <HomePage locale="sv" />;
}
