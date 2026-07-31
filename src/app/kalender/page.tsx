import type { Metadata } from "next";
import KalenderPage from "@/components/pages/KalenderPage";
import { altLang } from "@/lib/i18n";
import { kalenderDict } from "@/lib/i18n/kalender";
import { og } from "@/lib/seo";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;


export const metadata: Metadata = {
  alternates: altLang("/kalender", "/en/calendar", "sv"),
  title: kalenderDict.sv.meta.title,
  description: kalenderDict.sv.meta.description,
  openGraph: og("/kalender", kalenderDict.sv.meta.ogTitle, kalenderDict.sv.meta.ogDescription),
};

export default function Page() {
  return <KalenderPage locale="sv" />;
}
