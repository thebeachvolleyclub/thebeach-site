import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Föreningen — The Beach | Klubben för dig som vill mer",
  description:
    "The Beachs förening samlar ungdomsverksamhet, tävlingsspelare och bredden. Bli medlem, träna, tävla och väx med sporten.",
};

/**
 * OBS: den här sidan är starten på föreningens hem på sajten och
 * byggs ut i takt med att föreningsverksamheten flyttar in.
 */

const DELAR = [
  { rubrik: "Ungdom", text: "Barn- och ungdomsträning med utbildade coacher — från första nudden på bollen till U19-turneringar." },
  { rubrik: "Tävling", text: "SBT-turneringar, seriespel och vägen mot att våga börja tävla. The Beach är nationell arena för klubblags-SM-kvalet." },
  { rubrik: "Bredd & community", text: "Mixed-turneringar, After Beach och ett community på ~800 spelare i veckan. Alla nivåer, alla åldrar." },
];

export default function ForeningenPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          minH="min-h-[52svh]"
          eyebrow="Föreningen"
          title={<>Klubben för dig som<br /><span className="italic-accent">vill mer</span></>}
          intro="Föreningen är hjärtat i The Beach — ungdomarna, tävlingsspelarna och alla däremellan. Som medlem är du med och bygger svensk beachvolleys framtid, på samma sand som OS-guldmedaljörerna."
          cta={
            <a
              href="https://www.svenskalag.se/thebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Bli medlem <span aria-hidden="true">→</span>
            </a>
          }
        />
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
            {DELAR.map((d, i) => (
              <Reveal key={d.rubrik} delay={i * 0.06} className="border border-black/10 bg-white p-7 lg:p-10">
                <h3 className="mb-3 font-display text-2xl uppercase leading-none text-black lg:text-3xl">{d.rubrik}</h3>
                <p className="text-sm leading-relaxed text-black/55">{d.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-10 flex flex-col items-start gap-4 border-t border-black/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-black/40">
              Frågor om medlemskap, ungdomsträning eller tävling? Mejla{" "}
              <a href="mailto:boka@thebeach.one" className="font-semibold text-black underline underline-offset-4">boka@thebeach.one</a>{" "}
              — eller kika på träningsutbudet.
            </p>
            <Link
              href="/trana"
              className="shrink-0 cursor-pointer bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
            >
              Se träningsutbudet →
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
