import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";
import { altLang } from "@/lib/i18n";
import { teambuildingDict } from "@/lib/i18n/corporate";

const t = teambuildingDict.sv;

export const metadata: Metadata = {
  alternates: altLang("/teambuilding", "/en/team-building", "sv"),
  title: t.meta.title,
  description: t.meta.description,
};

export default function TeambuildingPage() {
  return (
    <CorporateLanding
      locale="sv"
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
