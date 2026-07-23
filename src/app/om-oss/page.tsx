import type { Metadata } from "next";
import OmOssPage from "@/components/pages/OmOssPage";
import { altLang } from "@/lib/i18n";
import { omOssDict } from "@/lib/i18n/om-oss";

export const metadata: Metadata = {
  alternates: altLang("/om-oss", "/en/about", "sv"),
  title: omOssDict.sv.meta.title,
  description: omOssDict.sv.meta.description,
  openGraph: { title: omOssDict.sv.meta.ogTitle, description: omOssDict.sv.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <OmOssPage locale="sv" />;
}
