import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";
import { altLang } from "@/lib/i18n";
import { firmafestDict } from "@/lib/i18n/corporate";

const t = firmafestDict.sv;

export const metadata: Metadata = {
  alternates: altLang("/firmafest", "/en/company-party", "sv"),
  title: t.meta.title,
  description: t.meta.description,
};

export default function FirmafestPage() {
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
