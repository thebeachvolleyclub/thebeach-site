import type { Metadata } from "next";
import SkolaPage from "@/components/pages/SkolaPage";
import { altLang } from "@/lib/i18n";
import { skolaDict } from "@/lib/i18n/skola";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/skola", "/en/school", "sv"),
  title: skolaDict.sv.meta.title,
  description: skolaDict.sv.meta.description,
  openGraph: og("/skola", skolaDict.sv.meta.ogTitle, skolaDict.sv.meta.ogDescription),
};

export default function Page() {
  return <SkolaPage locale="sv" />;
}
