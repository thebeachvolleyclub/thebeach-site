import type { Metadata } from "next";
import KalenderPage from "@/components/pages/KalenderPage";
import { altLang } from "@/lib/i18n";
import { kalenderDict } from "@/lib/i18n/kalender";
import { og } from "@/lib/seo";

// App-aktiviteter kan ställas in med kort varsel. Profixio har separat 6 h TTL.
export const revalidate = 60;


export const metadata: Metadata = {
  alternates: altLang("/kalender", "/en/calendar", "en"),
  title: kalenderDict.en.meta.title,
  description: kalenderDict.en.meta.description,
  openGraph: og("/en/calendar", kalenderDict.en.meta.ogTitle, kalenderDict.en.meta.ogDescription),
};

export default function Page() {
  return <KalenderPage locale="en" />;
}
