import type { Metadata } from "next";
import ForeningenPage from "@/components/pages/ForeningenPage";
import { altLang } from "@/lib/i18n";
import { foreningenDict } from "@/lib/i18n/foreningen";

// Årtalen i ungdomsrabatterna räknas vid rendering — bygg om regelbundet.
export const revalidate = 21600;

export const metadata: Metadata = {
  alternates: altLang("/foreningen", "/en/membership", "sv"),
  title: foreningenDict.sv.meta.title,
  description: foreningenDict.sv.meta.description,
};

export default function Page() {
  return <ForeningenPage locale="sv" />;
}
