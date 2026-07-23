import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventPlanner from "@/components/events/planner/EventPlanner";
import type { TierKey } from "@/lib/planner";

export const metadata: Metadata = {
  alternates: { canonical: "/events/planera" },
  title: "Planera ert event — The Beach | Bygg ert företagsevent steg för steg",
  description:
    "Bygg ert företagsevent själva — välj koncept, dryck, mat och underhållning och se prisbilden direkt. Skicka planen som förfrågan, vi svarar inom 24 timmar.",
  openGraph: {
    title: "Planera ert event — The Beach",
    description:
      "Välj koncept, dryck, mat och underhållning — se prisbilden direkt och skicka planen som förfrågan.",
    type: "website",
  },
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
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <header className="bg-black px-5 pt-28 sm:px-8 lg:px-14 lg:pt-36">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-lime">
              Företag & organisation
            </p>
            <h1 className="mb-4 font-display text-[clamp(2.5rem,10vw,4rem)] uppercase leading-[0.9] tracking-[-0.02em] text-white lg:text-[clamp(3.5rem,6vw,5.5rem)]">
              Planera ert <span className="italic-accent">event</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/50">
              Bygg ert drömevent steg för steg — koncept, dryck, mat, underhållning. Ni ser prisbilden
              direkt och skickar planen som en förfrågan. Inga datum låses här — vi återkommer inom
              24 timmar och håller gärna datumet i dialogen.
            </p>
          </div>
        </header>
        <EventPlanner initialTier={initialTier} />
      </main>
      <Footer />
    </>
  );
}
