import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";
import { altLang } from "@/lib/i18n";
import { foretagseventDict } from "@/lib/i18n/corporate";

const t = foretagseventDict.sv;

export const metadata: Metadata = {
  alternates: altLang("/foretagsevent", "/en/corporate-events", "sv"),
  title: t.meta.title,
  description: t.meta.description,
};

export default function ForetagseventPage() {
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
