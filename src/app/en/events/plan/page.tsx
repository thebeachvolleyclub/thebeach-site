import type { Metadata } from "next";
import PlannerPage from "@/components/pages/PlannerPage";
import { altLang } from "@/lib/i18n";
import { plannerDict } from "@/lib/i18n/planner";
import type { TierKey } from "@/lib/planner";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: altLang("/events/planera", "/en/events/plan", "en"),
  title: plannerDict.en.meta.title,
  description: plannerDict.en.meta.description,
  openGraph: og("/en/events/plan", plannerDict.en.meta.ogTitle, plannerDict.en.meta.ogDescription),
};

export default async function PlanEventPage({
  searchParams,
}: {
  searchParams: Promise<{ koncept?: string }>;
}) {
  const sp = await searchParams;
  const initialTier = (["lp", "alg", "mia"] as const).includes(sp.koncept as TierKey)
    ? (sp.koncept as TierKey)
    : undefined;
  return <PlannerPage locale="en" initialTier={initialTier} />;
}
