import type { Metadata } from "next";
import BarnkalasPage from "@/components/pages/BarnkalasPage";
import { altLang } from "@/lib/i18n";
import { barnkalasDict } from "@/lib/i18n/barnkalas";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/barnkalas", "/en/kids-party", "en"),
  title: barnkalasDict.en.meta.title,
  description: barnkalasDict.en.meta.description,
  openGraph: og("/en/kids-party", barnkalasDict.en.meta.ogTitle, barnkalasDict.en.meta.ogDescription),
};

export default function Page() {
  return <BarnkalasPage locale="en" />;
}
