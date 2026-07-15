import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "BeachTravels — träningsresor till världens finaste stränder",
  description:
    "Vårt dotterbolag BeachTravels arrangerar träningsresor och läger: Sperlonga, Praia da Rocha, Teneriffa, Gran Canaria och Tylösand. Sedan 2011.",
};

const RESMAL = ["Sperlonga, Italien", "Praia da Rocha, Portugal", "Teneriffa", "Gran Canaria", "Tylösand, Sverige"];

export default function BeachTravelsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          minH="min-h-[52svh]"
          eyebrow="BeachTravels · dotterbolag"
          title={<>Träna där andra<br /><span className="italic-accent">semestrar</span></>}
          intro="BeachTravels har arrangerat träningsresor sedan 2011 — läger på världens finaste stränder, ledda av coacher ur svenska landslagsmiljön. Samma filosofi som på The Beach, fast med havet bredvid."
          cta={
            <a
              href="https://beachtravels.se"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Till beachtravels.se <span aria-hidden="true">→</span>
            </a>
          }
        />
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <Reveal className="mb-8">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">Resmål</p>
            <h2 className="font-display text-[clamp(2rem,8vw,3.25rem)] leading-[0.9] text-black">Dit vi reser</h2>
          </Reveal>
          <div className="flex flex-wrap gap-2">
            {RESMAL.map((r, i) => (
              <Reveal key={r} delay={i * 0.04} className="border border-black/10 bg-white px-5 py-3">
                <span className="text-sm font-semibold text-black/70">{r}</span>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.12} className="mt-10 border-t border-black/10 pt-8">
            <p className="max-w-xl text-sm leading-relaxed text-black/40">
              Resor, datum och bokning hittar du på{" "}
              <a href="https://beachtravels.se" target="_blank" rel="noopener noreferrer" className="font-semibold text-black underline underline-offset-4">
                beachtravels.se
              </a>. Frågor? Mejla <a href="mailto:ask@beachtravels.se" className="font-semibold text-black underline underline-offset-4">ask@beachtravels.se</a>.
            </p>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
