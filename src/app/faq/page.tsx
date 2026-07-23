import type { Metadata } from "next";
import FaqPage from "@/components/pages/FaqPage";
import { altLang } from "@/lib/i18n";
import { faqDict } from "@/lib/i18n/faq";

export const metadata: Metadata = {
  alternates: altLang("/faq", "/en/faq", "sv"),
  title: faqDict.sv.meta.title,
  description: faqDict.sv.meta.description,
};

export default function Page() {
  return <FaqPage locale="sv" />;
}
