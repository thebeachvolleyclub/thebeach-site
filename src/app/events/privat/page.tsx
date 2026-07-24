import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrivatPlanner from "@/components/events/planner/PrivatPlanner";

/* Privatplaneraren — endast svenska i v1, därför bara canonical (ingen altLang). */
export const metadata: Metadata = {
  alternates: { canonical: "/events/privat" },
  title: "Planera er fest — The Beach",
  description:
    "Bygg er lördagsfest på stranden — födelsedag, bröllop, svensexa eller bara gänget. Välj koncept, dryck, mat och underhållning, se priset direkt (ink moms) och skicka planen som förfrågan.",
  openGraph: {
    title: "Planera er fest — The Beach",
    description:
      "Lördagsfest på en inomhusstrand mitt i Stockholm — bygg festen steg för steg och se priset direkt, ink moms.",
    type: "website",
  },
};

export default function PrivatFestPage() {
  return (
    <>
      <Navbar locale="sv" />
      <main className="flex-1">
        <header className="bg-black px-5 pt-28 sm:px-8 lg:px-14 lg:pt-36">
          <div className="mx-auto max-w-6xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-lime">
              Privatfest — lördagskvällar
            </p>
            <h1 className="mb-4 font-display text-[clamp(2.5rem,10vw,4rem)] uppercase leading-[0.9] tracking-[-0.02em] text-white lg:text-[clamp(3.5rem,6vw,5.5rem)]">
              Planera er <span className="italic-accent">fest</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/50">
              Födelsedag, bröllop, svensexa eller bara gänget — bygg er lördagsfest steg för steg
              och se priset direkt, ink moms. Skicka planen som en förfrågan; inga datum låses här —
              vi återkommer inom 24 timmar och håller gärna lördagen i dialogen.
            </p>
          </div>
        </header>
        <PrivatPlanner />
      </main>
      <Footer locale="sv" />
    </>
  );
}
