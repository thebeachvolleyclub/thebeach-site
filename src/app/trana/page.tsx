import type { Metadata } from "next";
import TranaPage from "@/components/pages/TranaPage";
import { altLang } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";

export const metadata: Metadata = {
  alternates: altLang("/trana", "/en/training", "sv"),
  title: tranaDict.sv.meta.title,
  description: tranaDict.sv.meta.description,
  openGraph: { title: tranaDict.sv.meta.ogTitle, description: tranaDict.sv.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <TranaPage locale="sv" />;
}
