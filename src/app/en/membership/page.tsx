import type { Metadata } from "next";
import ForeningenPage from "@/components/pages/ForeningenPage";
import { altLang } from "@/lib/i18n";
import { foreningenDict } from "@/lib/i18n/foreningen";
import { og } from "@/lib/seo";

// Årtalen i ungdomsrabatterna räknas vid rendering — bygg om regelbundet.
export const revalidate = 21600;

export const metadata: Metadata = {
  alternates: altLang("/foreningen", "/en/membership", "en"),
  title: foreningenDict.en.meta.title,
  description: foreningenDict.en.meta.description,
  openGraph: og(
    "/en/membership",
    "Join The Beach Volley Club",
    "SEK 350/year, juniors 190. Cheaper court hire, member events and free licence registration — and you back the youth programme.",
  ),
};

export default function Page() {
  return <ForeningenPage locale="en" />;
}
