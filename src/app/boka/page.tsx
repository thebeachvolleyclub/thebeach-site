import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import BookingWidget from "@/components/booking/BookingWidget";

export const metadata: Metadata = {
  alternates: { canonical: "/boka", languages: { sv: "/boka", en: "/en/book", "x-default": "/boka" } },
  title: "Boka beachvolleybana — The Beach",
  description: "Se lediga tider och boka en beachvolleybana på The Beach i Huddinge. 90 minuter, 400 kr per bana och betalning med Swish.",
  openGraph: { title: "Boka bana — The Beach", description: "Boka beachvolleybana direkt och betala tryggt med Swish.", type: "website" },
};

const steps = [
  { title: "Välj tid", text: "Se de lediga pilottiderna och välj bana. Ett pass är 90 minuter och kostar 400 kr per bana." },
  { title: "Betala med Swish", text: "Vi håller tiden i 10 minuter och skickar en betalningsbegäran direkt till ditt Swish-nummer." },
  { title: "Kom och spela", text: "När Swish är klart är banan bekräftad. Bollar, omklädningsrum och duschar finns på plats." },
];

export default function BokaPage() {
  return <>
    <Navbar />
    <main className="flex-1">
      <PageHero minH="min-h-[52svh]" eyebrow="Boka bana" title={<>Din bana.<br /><span className="italic-accent">Din tid.</span></>} intro="Boka en av våra pilottider direkt hos The Beach. 90 minuter, 400 kr per bana och betalning med Swish." cta={<a href="#bokning" className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright">Se lediga tider <span aria-hidden="true">↓</span></a>} />

      <section id="bokning" className="scroll-mt-8 bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <Reveal className="mb-9 border-b border-black/10 pb-8 text-black lg:mb-12">
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">Direktbokning</p>
          <h2 className="font-display text-[clamp(2.3rem,8vw,5rem)] leading-[0.9]">Hitta din tid</h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-black/55">Vi börjar med ett urval banor och tider. Övriga banor ligger kvar i MATCHi under pilotperioden, så systemen konkurrerar aldrig om samma tid.</p>
        </Reveal>
        <BookingWidget />
      </section>

      <section className="bg-base px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
        <Reveal className="mb-10"><p className="eyebrow mb-4">Så funkar det</p><h2 className="font-display text-[clamp(2.25rem,9vw,4.5rem)] text-bone">Tre steg till sanden</h2></Reveal>
        <div className="grid gap-0.5 lg:grid-cols-3">{steps.map((step, index) => <Reveal key={step.title} delay={index * 0.06} className="border border-white/10 bg-white/[0.03] p-7 lg:p-9"><span className="mb-4 block font-display text-3xl text-lime/40">0{index + 1}</span><h3 className="mb-3 font-display text-2xl text-bone">{step.title}</h3><p className="text-sm leading-relaxed text-bone/55">{step.text}</p></Reveal>)}</div>
      </section>

      <section className="bg-mint px-5 py-14 text-black sm:px-8 lg:px-14 lg:py-20"><div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between"><Reveal><h2 className="mb-2 font-display text-[clamp(1.75rem,7vw,2.75rem)]">Träning, event eller annan tid?</h2><p className="max-w-xl text-sm leading-relaxed text-black/50">Kurser och träningsgrupper hittar du under Träna. Företagsevent, kalas och större bokningar hjälper vi dig att planera.</p></Reveal><Reveal delay={0.06} className="flex flex-wrap gap-3"><Link href="/trana" className="bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime">Träna →</Link><Link href="/events" className="border border-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black">Boka event →</Link></Reveal></div></section>
    </main>
    <Footer />
  </>;
}
