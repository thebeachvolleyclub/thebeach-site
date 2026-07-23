import type { Metadata } from "next";
import FaqPage from "@/components/pages/FaqPage";
import { altLang } from "@/lib/i18n";
import { faqDict } from "@/lib/i18n/faq";

export const metadata: Metadata = {
  alternates: altLang("/faq", "/en/faq", "en"),
  title: faqDict.en.meta.title,
  description: faqDict.en.meta.description,
};

export default function Page() {
  return <FaqPage locale="en" />;
}
