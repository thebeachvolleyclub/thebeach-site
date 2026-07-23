import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";
import { altLang } from "@/lib/i18n";
import { teambuildingDict } from "@/lib/i18n/corporate";

const t = teambuildingDict.en;

export const metadata: Metadata = {
  alternates: altLang("/teambuilding", "/en/team-building", "en"),
  title: t.meta.title,
  description: t.meta.description,
};

export default function TeambuildingEnPage() {
  return (
    <CorporateLanding
      locale="en"
      eyebrow={t.eyebrow}
      title={<>{t.titleTop}<br /><span className="italic-accent">{t.titleAccent}</span></>}
      intro={t.intro}
      lead={t.lead}
      included={t.included}
      why={t.why}
      faqs={t.faqs}
    />
  );
}
