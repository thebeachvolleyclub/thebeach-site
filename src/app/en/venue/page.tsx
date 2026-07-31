import type { Metadata } from "next";
import LokalenPage from "@/components/pages/LokalenPage";
import { altLang } from "@/lib/i18n";
import { lokalenDict } from "@/lib/i18n/lokalen";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/lokalen", "/en/venue", "en"),
  title: lokalenDict.en.meta.title,
  description: lokalenDict.en.meta.description,
  openGraph: og("/en/venue", lokalenDict.en.meta.ogTitle, lokalenDict.en.meta.ogDescription),
};

export default function Page() {
  return <LokalenPage locale="en" />;
}
