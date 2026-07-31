import type { Metadata } from "next";
import LokalenPage from "@/components/pages/LokalenPage";
import { altLang } from "@/lib/i18n";
import { lokalenDict } from "@/lib/i18n/lokalen";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/lokalen", "/en/venue", "sv"),
  title: lokalenDict.sv.meta.title,
  description: lokalenDict.sv.meta.description,
  openGraph: og("/lokalen", lokalenDict.sv.meta.ogTitle, lokalenDict.sv.meta.ogDescription),
};

export default function Page() {
  return <LokalenPage locale="sv" />;
}
