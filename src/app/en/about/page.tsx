import type { Metadata } from "next";
import OmOssPage from "@/components/pages/OmOssPage";
import { altLang } from "@/lib/i18n";
import { omOssDict } from "@/lib/i18n/om-oss";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/om-oss", "/en/about", "en"),
  title: omOssDict.en.meta.title,
  description: omOssDict.en.meta.description,
  openGraph: og("/en/about", omOssDict.en.meta.ogTitle, omOssDict.en.meta.ogDescription),
};

export default function Page() {
  return <OmOssPage locale="en" />;
}
