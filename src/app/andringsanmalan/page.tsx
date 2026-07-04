import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Byta träningsgrupp — ändringsanmälan | The Beach",
  description:
    "Ändrade förutsättningar eller känns gruppen fel? Så gör du en ändringsanmälan till träningsgrupperna på The Beach.",
};

export default function AndringsanmalanPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Träningsgrupper"
          title={<>Byta grupp<br /><span className="italic-accent">— ändringsanmälan</span></>}
          intro="Ändrade förutsättningar, eller känns gruppen fel? Så går du vidare."
          minH="min-h-[46svh]"
        />
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl space-y-10">
            <Reveal>
              <p className="text-[17px] leading-relaxed text-black/70">
                Ibland ändras förutsättningarna — nytt schema på jobbet eller något
                annat som ställer till det. Och ibland gör vi fel; kanske missade vi
                ett krav du angav. Då är det toppen om du fyller i en ändringsanmälan
                så vi får veta. Att byta grupp är svårt och det är inte säkert att det
                går, men vi gör vårt bästa. Viktigt: du behåller din plats tills något
                annat har bestämts och meddelats dig skriftligt via mejl.
              </p>
            </Reveal>

            <Reveal>
              <h2 className="mb-3 font-display text-2xl uppercase text-black">Tips från coachen</h2>
              <p className="text-[15px] leading-relaxed text-black/65">
                Gör du ändringsanmälan för att du känner dig placerad med spelare på
                en annan nivå än din egen (åt något håll) — prata först med din tränare
                efter passet och hör vad de tycker innan du går vidare. Att be
                receptionen “hälsa Matte att jag…”, mejla bokningen eller nämna något i
                förbifarten till Mattias när han coachar blir oftast bara missförstånd.
                Fyll i formuläret noga i stället, så kan vi jobba skyndsamt.
              </p>
            </Reveal>

            <Reveal className="border-t border-black/10 pt-8">
              <a
                href="https://thebeach.se/spela_beachvolley/andringsanmalan/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                Till ändringsanmälan <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
