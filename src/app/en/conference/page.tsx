import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";
import { altLang } from "@/lib/i18n";
import { konferensDict } from "@/lib/i18n/corporate";

const t = konferensDict.en;

export const metadata: Metadata = {
  alternates: altLang("/konferens", "/en/conference", "en"),
  title: t.meta.title,
  description: t.meta.description,
};

export default function KonferensEnPage() {
  return (
    <CorporateLanding
      locale="en"
      eyebrow={t.eyebrow}
      paket="konferens"
      title={<>{t.titleTop}<br /><span className="italic-accent">{t.titleAccent}</span></>}
      intro={t.intro}
      lead={t.lead}
      included={t.included}
      why={t.why}
      faqs={t.faqs}
    />
  );
}
