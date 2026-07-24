import type { Metadata } from "next";
import ForeningenPage from "@/components/pages/ForeningenPage";
import { altLang } from "@/lib/i18n";
import { foreningenDict } from "@/lib/i18n/foreningen";

export const metadata: Metadata = {
  alternates: altLang("/foreningen", "/en/membership", "en"),
  title: foreningenDict.en.meta.title,
  description: foreningenDict.en.meta.description,
};

export default function Page() {
  return <ForeningenPage locale="en" />;
}
