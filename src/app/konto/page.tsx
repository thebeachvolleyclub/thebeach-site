import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import AccountPortal from "@/components/account/AccountPortal";

export const metadata: Metadata = {
  title: "Mitt konto — The Beach",
  description: "Se dina bokningar, träningsgrupper, fakturor och profil hos The Beach.",
  robots: { index: false, follow: false },
};

export default function KontoPage() {
  return <>
    <Navbar />
    <main className="flex-1">
      <PageHero minH="min-h-[42svh]" eyebrow="Mitt Beach" title={<>Allt på<br /><span className="italic-accent">samma plats.</span></>} intro="Dina banbokningar, träningsgrupper och betalningar — med samma konto som i appen." />
      <section className="bg-cream px-5 py-14 text-black sm:px-8 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-5xl"><AccountPortal /></div>
      </section>
    </main>
    <Footer />
  </>;
}
