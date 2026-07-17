import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import SignupFormClient from "@/components/anmalan/SignupFormClient";

export const metadata: Metadata = {
  title: "Anmälan träningsgrupper — The Beach",
  description:
    "Anmäl dig till träningsgrupperna på The Beach. Välj dagar och tider, berätta om dig som spelare och lämna önskemål — placeringen utgår från din nivå.",
  openGraph: {
    title: "Anmälan träningsgrupper — The Beach",
    description:
      "Anmäl dig till träningsgrupperna på The Beach i Huddinge. Höstsäsong 2026.",
    type: "website",
  },
};

export default function AnmalanPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Träningsgrupper"
          title={<>Anmälan<br /><span className="italic-accent">— träningsgrupper</span></>}
          intro="Välj dina dagar och tider, berätta om dig som spelare och lämna önskemål. Placeringen utgår främst från din nivå."
          minH="min-h-[46svh]"
        />
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <SignupFormClient />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
