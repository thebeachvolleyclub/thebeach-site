import type { Metadata } from "next";
import SkolaPage from "@/components/pages/SkolaPage";
import { altLang } from "@/lib/i18n";
import { skolaDict } from "@/lib/i18n/skola";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/skola", "/en/school", "en"),
  title: skolaDict.en.meta.title,
  description: skolaDict.en.meta.description,
  openGraph: og("/en/school", skolaDict.en.meta.ogTitle, skolaDict.en.meta.ogDescription),
};

export default function Page() {
  return <SkolaPage locale="en" />;
}
