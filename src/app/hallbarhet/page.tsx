import type { Metadata } from "next";
import HallbarhetPage from "@/components/pages/HallbarhetPage";
import { altLang } from "@/lib/i18n";
import { hallbarhetDict } from "@/lib/i18n/hallbarhet";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/hallbarhet", "/en/sustainability", "sv"),
  title: hallbarhetDict.sv.meta.title,
  description: hallbarhetDict.sv.meta.description,
  openGraph: og(
    "/hallbarhet",
    "Soldriven beacharena i Huddinge",
    "Solen driver arenan, rörelsen driver människorna. 72 kW sol + ~290 kWh batteri — hållbarhet vi mäter och visar, inte påstår.",
  ),
};

export default function Page() {
  return <HallbarhetPage locale="sv" />;
}
