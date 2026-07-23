import type { Metadata } from "next";
import BokaPage from "@/components/pages/BokaPage";
import { altLang } from "@/lib/i18n";
import { bokaDict } from "@/lib/i18n/boka";

export const metadata: Metadata = {
  alternates: altLang("/boka", "/en/book", "sv"),
  title: bokaDict.sv.meta.title,
  description: bokaDict.sv.meta.description,
  openGraph: { title: bokaDict.sv.meta.ogTitle, description: bokaDict.sv.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <BokaPage locale="sv" />;
}
