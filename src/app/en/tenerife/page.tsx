import type { Metadata } from "next";
import TeneriffaPage from "@/components/pages/TeneriffaPage";
import { altLang } from "@/lib/i18n";
import { teneriffaDict } from "@/lib/i18n/teneriffa";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/teneriffa", "/en/tenerife", "en"),
  title: teneriffaDict.en.meta.title,
  description: teneriffaDict.en.meta.description,
  openGraph: og("/en/tenerife", teneriffaDict.en.meta.ogTitle, teneriffaDict.en.meta.ogDescription),
};

export default function Page() {
  return <TeneriffaPage locale="en" />;
}
