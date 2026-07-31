import type { Metadata } from "next";
import BokaPage from "@/components/pages/BokaPage";
import { altLang } from "@/lib/i18n";
import { bokaDict } from "@/lib/i18n/boka";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/boka", "/en/book", "en"),
  title: bokaDict.en.meta.title,
  description: bokaDict.en.meta.description,
  openGraph: og("/en/book", bokaDict.en.meta.ogTitle, bokaDict.en.meta.ogDescription),
};

export default function Page() {
  return <BokaPage locale="en" />;
}
