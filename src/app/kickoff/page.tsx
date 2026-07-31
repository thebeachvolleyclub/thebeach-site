import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";
import { altLang } from "@/lib/i18n";
import { kickoffDict } from "@/lib/i18n/corporate";
import { og } from "@/lib/seo";

const t = kickoffDict.sv;

export const metadata: Metadata = {
  alternates: altLang("/kickoff", "/en/kickoff", "sv"),
  title: t.meta.title,
  description: t.meta.description,
  openGraph: og("/kickoff", `${t.titleTop} ${t.titleAccent}`, t.intro),
};

export default function KickoffPage() {
  return (
    <CorporateLanding
      locale="sv"
      eyebrow={t.eyebrow}
      title={<>{t.titleTop}{" "}<br /><span className="italic-accent">{t.titleAccent}</span></>}
      intro={t.intro}
      lead={t.lead}
      included={t.included}
      why={t.why}
      faqs={t.faqs}
    />
  );
}
