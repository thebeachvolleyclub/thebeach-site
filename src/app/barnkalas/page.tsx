import type { Metadata } from "next";
import BarnkalasPage from "@/components/pages/BarnkalasPage";
import { altLang } from "@/lib/i18n";
import { barnkalasDict } from "@/lib/i18n/barnkalas";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/barnkalas", "/en/kids-party", "sv"),
  title: barnkalasDict.sv.meta.title,
  description: barnkalasDict.sv.meta.description,
  openGraph: og("/barnkalas", barnkalasDict.sv.meta.ogTitle, barnkalasDict.sv.meta.ogDescription),
};

export default function Page() {
  return <BarnkalasPage locale="sv" />;
}
