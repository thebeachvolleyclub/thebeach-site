import type { Metadata } from "next";
import SkolaPage from "@/components/pages/SkolaPage";
import { altLang } from "@/lib/i18n";
import { skolaDict } from "@/lib/i18n/skola";

export const metadata: Metadata = {
  alternates: altLang("/skola", "/en/school", "sv"),
  title: skolaDict.sv.meta.title,
  description: skolaDict.sv.meta.description,
  openGraph: { title: skolaDict.sv.meta.ogTitle, description: skolaDict.sv.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <SkolaPage locale="sv" />;
}
