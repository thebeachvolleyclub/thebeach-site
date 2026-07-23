import type { Metadata } from "next";
import JulbordPage from "@/components/pages/JulbordPage";
import { altLang } from "@/lib/i18n";
import { julbordDict } from "@/lib/i18n/julbord";

export const metadata: Metadata = {
  alternates: altLang("/julbord", "/en/christmas-party", "en"),
  title: julbordDict.en.meta.title,
  description: julbordDict.en.meta.description,
  openGraph: { title: julbordDict.en.meta.ogTitle, description: julbordDict.en.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <JulbordPage locale="en" />;
}
