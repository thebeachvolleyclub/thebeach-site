import type { Metadata } from "next";
import JulbordPage from "@/components/pages/JulbordPage";
import { altLang } from "@/lib/i18n";
import { julbordDict } from "@/lib/i18n/julbord";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/julbord", "/en/christmas-party", "sv"),
  title: julbordDict.sv.meta.title,
  description: julbordDict.sv.meta.description,
  openGraph: og("/julbord", julbordDict.sv.meta.ogTitle, julbordDict.sv.meta.ogDescription),
};

export default function Page() {
  return <JulbordPage locale="sv" />;
}
