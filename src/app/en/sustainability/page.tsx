import type { Metadata } from "next";
import HallbarhetPage from "@/components/pages/HallbarhetPage";
import { altLang } from "@/lib/i18n";
import { hallbarhetDict } from "@/lib/i18n/hallbarhet";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/hallbarhet", "/en/sustainability", "en"),
  title: hallbarhetDict.en.meta.title,
  description: hallbarhetDict.en.meta.description,
  openGraph: og(
    "/en/sustainability",
    "A solar-powered beach arena in Huddinge",
    "The sun powers the arena, movement powers the people. 72 kW solar + ~290 kWh battery — sustainability we measure and show.",
  ),
};

export default function Page() {
  return <HallbarhetPage locale="en" />;
}
