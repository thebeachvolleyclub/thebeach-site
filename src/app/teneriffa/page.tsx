import type { Metadata } from "next";
import TeneriffaPage from "@/components/pages/TeneriffaPage";
import { altLang } from "@/lib/i18n";
import { teneriffaDict } from "@/lib/i18n/teneriffa";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/teneriffa", "/en/tenerife", "sv"),
  title: teneriffaDict.sv.meta.title,
  description: teneriffaDict.sv.meta.description,
  openGraph: og("/teneriffa", teneriffaDict.sv.meta.ogTitle, teneriffaDict.sv.meta.ogDescription),
};

export default function Page() {
  return <TeneriffaPage locale="sv" />;
}
