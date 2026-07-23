import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { altLang } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";

// Profixio-synk: hämta om tävlingskalendern var 6:e timme (ISR).
export const revalidate = 21600;

export const metadata: Metadata = {
  title: homeDict.en.meta.title,
  description: homeDict.en.meta.description,
  alternates: altLang("/", "/en", "en"),
  openGraph: {
    title: homeDict.en.meta.ogTitle,
    description: homeDict.en.meta.ogDescription,
    type: "website",
  },
};

export default function Page() {
  return <HomePage locale="en" />;
}
