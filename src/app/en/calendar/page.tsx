import type { Metadata } from "next";
import KalenderPage from "@/components/pages/KalenderPage";
import { altLang } from "@/lib/i18n";
import { kalenderDict } from "@/lib/i18n/kalender";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;


export const metadata: Metadata = {
  alternates: altLang("/kalender", "/en/calendar", "en"),
  title: kalenderDict.en.meta.title,
  description: kalenderDict.en.meta.description,
  openGraph: { title: kalenderDict.en.meta.ogTitle, description: kalenderDict.en.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <KalenderPage locale="en" />;
}
