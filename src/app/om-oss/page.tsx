import type { Metadata } from "next";
import OmOssPage from "@/components/pages/OmOssPage";
import { altLang } from "@/lib/i18n";
import { omOssDict } from "@/lib/i18n/om-oss";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/om-oss", "/en/about", "sv"),
  title: omOssDict.sv.meta.title,
  description: omOssDict.sv.meta.description,
  openGraph: og("/om-oss", omOssDict.sv.meta.ogTitle, omOssDict.sv.meta.ogDescription),
};

export default function Page() {
  return <OmOssPage locale="sv" />;
}
