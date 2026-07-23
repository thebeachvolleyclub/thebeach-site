import type { Metadata } from "next";
import LokalenPage from "@/components/pages/LokalenPage";
import { altLang } from "@/lib/i18n";
import { lokalenDict } from "@/lib/i18n/lokalen";

export const metadata: Metadata = {
  alternates: altLang("/lokalen", "/en/venue", "en"),
  title: lokalenDict.en.meta.title,
  description: lokalenDict.en.meta.description,
  openGraph: { title: lokalenDict.en.meta.ogTitle, description: lokalenDict.en.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <LokalenPage locale="en" />;
}
