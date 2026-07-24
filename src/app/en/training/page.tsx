import type { Metadata } from "next";
import TranaPage from "@/components/pages/TranaPage";
import { altLang } from "@/lib/i18n";
import { tranaDict } from "@/lib/i18n/trana";

export const metadata: Metadata = {
  alternates: altLang("/trana", "/en/training", "en"),
  title: tranaDict.en.meta.title,
  description: tranaDict.en.meta.description,
  openGraph: { title: tranaDict.en.meta.ogTitle, description: tranaDict.en.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <TranaPage locale="en" />;
}
