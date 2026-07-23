import type { Metadata } from "next";
import LokalenPage from "@/components/pages/LokalenPage";
import { altLang } from "@/lib/i18n";
import { lokalenDict } from "@/lib/i18n/lokalen";

export const metadata: Metadata = {
  alternates: altLang("/lokalen", "/en/venue", "sv"),
  title: lokalenDict.sv.meta.title,
  description: lokalenDict.sv.meta.description,
  openGraph: { title: lokalenDict.sv.meta.ogTitle, description: lokalenDict.sv.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <LokalenPage locale="sv" />;
}
