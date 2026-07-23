import type { Metadata } from "next";
import BarnkalasPage from "@/components/pages/BarnkalasPage";
import { altLang } from "@/lib/i18n";
import { barnkalasDict } from "@/lib/i18n/barnkalas";

export const metadata: Metadata = {
  alternates: altLang("/barnkalas", "/en/kids-party", "en"),
  title: barnkalasDict.en.meta.title,
  description: barnkalasDict.en.meta.description,
  openGraph: { title: barnkalasDict.en.meta.ogTitle, description: barnkalasDict.en.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <BarnkalasPage locale="en" />;
}
