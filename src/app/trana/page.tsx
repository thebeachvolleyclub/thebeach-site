import type { Metadata } from "next";
import TranaPage from "@/components/pages/TranaPage";
import { altLang } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";
import { og } from "@/lib/seo";

// Årtalen i ungdomsrabatterna räknas vid rendering — bygg om regelbundet.
export const revalidate = 21600;

export const metadata: Metadata = {
  alternates: altLang("/trana", "/en/training", "sv"),
  title: tranaDict.sv.meta.title,
  description: tranaDict.sv.meta.description,
  openGraph: og("/trana", tranaDict.sv.meta.ogTitle, tranaDict.sv.meta.ogDescription),
};

export default function Page() {
  return <TranaPage locale="sv" />;
}
