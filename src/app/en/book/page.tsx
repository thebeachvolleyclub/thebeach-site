import type { Metadata } from "next";
import BokaPage from "@/components/pages/BokaPage";
import { altLang } from "@/lib/i18n";
import { bokaDict } from "@/lib/i18n/boka";

export const metadata: Metadata = {
  alternates: altLang("/boka", "/en/book", "en"),
  title: bokaDict.en.meta.title,
  description: bokaDict.en.meta.description,
  openGraph: { title: bokaDict.en.meta.ogTitle, description: bokaDict.en.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <BokaPage locale="en" />;
}
