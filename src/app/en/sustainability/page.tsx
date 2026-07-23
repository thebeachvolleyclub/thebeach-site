import type { Metadata } from "next";
import HallbarhetPage from "@/components/pages/HallbarhetPage";
import { altLang } from "@/lib/i18n";
import { hallbarhetDict } from "@/lib/i18n/hallbarhet";

export const metadata: Metadata = {
  alternates: altLang("/hallbarhet", "/en/sustainability", "en"),
  title: hallbarhetDict.en.meta.title,
  description: hallbarhetDict.en.meta.description,
};

export default function Page() {
  return <HallbarhetPage locale="en" />;
}
