import type { Metadata } from "next";
import PlannerPage from "@/components/pages/PlannerPage";
import { altLang } from "@/lib/i18n";
import { plannerDict } from "@/lib/i18n/planner";
import type { TierKey } from "@/lib/planner";

export const metadata: Metadata = {
  alternates: altLang("/events/planera", "/en/events/plan", "en"),
  title: plannerDict.en.meta.title,
  description: plannerDict.en.meta.description,
  openGraph: {
    title: plannerDict.en.meta.ogTitle,
    description: plannerDict.en.meta.ogDescription,
    type: "website",
  },
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
