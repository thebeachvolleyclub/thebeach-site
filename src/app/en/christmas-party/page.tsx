import type { Metadata } from "next";
import JulbordPage from "@/components/pages/JulbordPage";
import { altLang } from "@/lib/i18n";
import { julbordDict } from "@/lib/i18n/julbord";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/julbord", "/en/christmas-party", "en"),
  title: julbordDict.en.meta.title,
  description: julbordDict.en.meta.description,
  openGraph: og("/en/christmas-party", julbordDict.en.meta.ogTitle, julbordDict.en.meta.ogDescription),
};

export default function Page() {
  return <JulbordPage locale="en" />;
}
