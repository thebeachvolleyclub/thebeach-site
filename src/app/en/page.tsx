import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { altLang } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";
import { og } from "@/lib/seo";

// App-aktiviteter kan ställas in med kort varsel. Profixio har separat 6 h TTL.
export const revalidate = 60;

export const metadata: Metadata = {
  title: homeDict.en.meta.title,
  description: homeDict.en.meta.description,
  alternates: altLang("/", "/en", "en"),
  openGraph: og("/en", homeDict.en.meta.ogTitle, homeDict.en.meta.ogDescription),
};

export default function Page() {
  return <HomePage locale="en" />;
}
