import type { Metadata } from "next";
import BokaPage from "@/components/pages/BokaPage";
import { altLang } from "@/lib/i18n";
import { bokaDict } from "@/lib/i18n/boka";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/boka", "/en/book", "sv"),
  title: bokaDict.sv.meta.title,
  description: bokaDict.sv.meta.description,
  openGraph: og("/boka", bokaDict.sv.meta.ogTitle, bokaDict.sv.meta.ogDescription),
};

export default function Page() {
  return <BokaPage locale="sv" />;
}
