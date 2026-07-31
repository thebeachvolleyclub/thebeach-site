import type { Metadata } from "next";
import FaqPage from "@/components/pages/FaqPage";
import { altLang } from "@/lib/i18n";
import { faqDict } from "@/lib/i18n/faq";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/faq", "/en/faq", "en"),
  title: faqDict.en.meta.title,
  description: faqDict.en.meta.description,
  openGraph: og("/en/faq", faqDict.en.meta.title, faqDict.en.meta.description),
};

export default function Page() {
  return <FaqPage locale="en" />;
}
