import type { Metadata } from "next";
import OmOssPage from "@/components/pages/OmOssPage";
import { altLang } from "@/lib/i18n";
import { omOssDict } from "@/lib/i18n/om-oss";

export const metadata: Metadata = {
  alternates: altLang("/om-oss", "/en/about", "en"),
  title: omOssDict.en.meta.title,
  description: omOssDict.en.meta.description,
  openGraph: { title: omOssDict.en.meta.ogTitle, description: omOssDict.en.meta.ogDescription, type: "website" },
};

export default function Page() {
  return <OmOssPage locale="en" />;
}
