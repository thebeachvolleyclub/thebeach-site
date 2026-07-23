import type { Metadata } from "next";
import SkolaPage from "@/components/pages/SkolaPage";
import { altLang } from "@/lib/i18n";
import { skolaDict } from "@/lib/i18n/skola";

export const metadata: Metadata = {
  alternates: altLang("/skola", "/en/school", "en"),
  title: skolaDict.en.meta.title,
  description: skolaDict.en.meta.description,
  openGraph: { title: skolaDict.en.meta.ogTitle, description: skolaDict.en.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <SkolaPage locale="en" />;
}
