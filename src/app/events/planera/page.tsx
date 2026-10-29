import type { Metadata } from "next";
import PlannerPage from "@/components/pages/PlannerPage";
import { altLang } from "@/lib/i18n";
import { plannerDict } from "@/lib/i18n/planner";
import type { TierKey } from "@/lib/planner";
import { og } from "@/lib/seo";

/* Planeraren är dold sedan okt 2026: nås bara via direktlänk som David skickar
   till utvalda kunder. Ingen indexering, inga interna länkar, inte i sitemap. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  alternates: altLang("/events/planera", "/en/events/plan", "sv"),
  title: plannerDict.sv.meta.title,
  description: plannerDict.sv.meta.description,
  openGraph: og("/events/planera", plannerDict.sv.meta.ogTitle, plannerDict.sv.meta.ogDescription),
};

export default async function PlaneraEventPage({
  searchParams,
}: {
  searchParams: Promise<{ koncept?: string }>;
}) {
  const sp = await searchParams;
  const initialTier = (["lp", "alg", "mia"] as const).includes(sp.koncept as TierKey)
    ? (sp.koncept as TierKey)
    : undefined;
  return <PlannerPage locale="sv" initialTier={initialTier} />;
}
