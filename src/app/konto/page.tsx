import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import AccountPortal from "@/components/account/AccountPortal";

export const metadata: Metadata = {
  title: "Mitt konto — The Beach",
  description: "Hantera din profil, bokningar och fakturor hos The Beach.",
  robots: { index: false, follow: false },
};

export default function KontoPage() {
  return <>
    <Navbar />
    <main className="flex-1">
      <PageHero minH="min-h-[42svh]" eyebrow="Mitt konto" title={<>Allt på<br /><span className="italic-accent">samma plats.</span></>} intro="Samma konto på webben och i appen. Hantera din profil, dina banbokningar och fakturor." />
      <section className="bg-cream px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-5xl"><AccountPortal /></div>
      </section>
    </main>
    <Footer />
  </>;
}
