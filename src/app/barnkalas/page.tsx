import type { Metadata } from "next";
import BarnkalasPage from "@/components/pages/BarnkalasPage";
import { altLang } from "@/lib/i18n";
import { barnkalasDict } from "@/lib/i18n/barnkalas";

export const metadata: Metadata = {
  alternates: altLang("/barnkalas", "/en/kids-party", "sv"),
  title: barnkalasDict.sv.meta.title,
  description: barnkalasDict.sv.meta.description,
  openGraph: { title: barnkalasDict.sv.meta.ogTitle, description: barnkalasDict.sv.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <BarnkalasPage locale="sv" />;
}
