import type { Metadata } from "next";
import JulbordPage from "@/components/pages/JulbordPage";
import { altLang } from "@/lib/i18n";
import { julbordDict } from "@/lib/i18n/julbord";

export const metadata: Metadata = {
  alternates: altLang("/julbord", "/en/christmas-party", "sv"),
  title: julbordDict.sv.meta.title,
  description: julbordDict.sv.meta.description,
  openGraph: { title: julbordDict.sv.meta.ogTitle, description: julbordDict.sv.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <JulbordPage locale="sv" />;
}
