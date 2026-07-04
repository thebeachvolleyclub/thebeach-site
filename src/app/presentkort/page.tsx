import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Presentkort — The Beach | Ge bort sommar",
  robots: { index: false, follow: false },
  description:
    "Presentkort på The Beach — grundkurs, träning, banhyra eller PT. Mottagaren väljer själv. Valfritt belopp från 700 kr, giltigt i två år.",
};

const STEG = [
  "Mejla oss beloppet och vart presentkortet ska skickas",
  "Vi postar det snygga presentkortet — direkt till mottagaren om du vill, med en hälsning",
  "Betalning via faktura. Kortet gäller i två år, på allt hos oss",
];

export default function PresentkortPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          minH="min-h-[52svh]"
          eyebrow="Presentkort"
          title={<>Ge bort<br /><span className="italic-accent">sommar</span></>}
          intro="Bästa presenten till någon som gillar beachvolley — eller borde börja. Grundkurs, träning, banhyra eller PT: mottagaren väljer själv. Valfritt belopp från 700 kr."
          cta={
            <a
              href="mailto:boka@thebeach.one?subject=Presentkort"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Beställ via mejl <span aria-hidden="true">→</span>
            </a>
          }
        />
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-0.5 sm:grid-cols-3">
            {STEG.map((s, i) => (
              <Reveal key={s} delay={i * 0.06} className="border border-black/10 bg-white p-7">
                <span className="mb-3 block font-display text-3xl text-black/15">{i + 1}</span>
                <p className="text-sm leading-relaxed text-black/60">{s}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mx-auto mt-8 max-w-4xl text-center">
            <p className="text-sm text-black/40">
              Skriv belopp, leveransadress och eventuell hälsning till{" "}
              <a href="mailto:boka@thebeach.one?subject=Presentkort" className="font-semibold text-black underline underline-offset-4">
                boka@thebeach.one
              </a>{" "}
              så ordnar vi resten.
            </p>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
