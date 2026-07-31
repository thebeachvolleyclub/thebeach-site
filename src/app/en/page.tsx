import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { altLang } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";
import { og } from "@/lib/seo";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;

export const metadata: Metadata = {
  title: homeDict.en.meta.title,
  description: homeDict.en.meta.description,
  alternates: altLang("/", "/en", "en"),
  openGraph: og("/en", homeDict.en.meta.ogTitle, homeDict.en.meta.ogDescription),
};

export default function Page() {
  return <HomePage locale="en" />;
}
