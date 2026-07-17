import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Barnkalas — The Beach | Aktivt kalas med sand mellan tårna",
  description:
    "Fira födelsedagen på stranden mitt i Huddinge. 2 timmar med lek, beachvolley eller beachfotboll + pizza och firande i loungen. Från 350 kr/barn.",
  openGraph: {
    title: "Barnkalas på The Beach",
    description:
      "Aktivt barnkalas 6–11 år: spel på sanden + pizza i loungen. Lördagar & söndagar. Från 350 kr/barn.",
    type: "website",
  },
};

const FAKTA = [
  { rubrik: "För vem?", rader: ["Rekommenderad ålder ca 6–11 år", "Alla kan vara med — inga förkunskaper", "Perfekt för barn som gillar rörelse"] },
  { rubrik: "När?", rader: ["Lördagar 09.00–11.00", "Söndagar 09.00–11.00", "Söndagar 10.30–12.30"] },
  { rubrik: "Upplägg — 2 h totalt", rader: ["60–90 min aktivitet på banan", "30–60 min mat & firande i loungen", "Tempot anpassas efter gruppen"] },
  { rubrik: "Ingår", rader: ["Halv pizza per barn", "Trocadero eller Cuba-Cola", "Bollar, utrustning, omklädningsrum"] },
];

export default function BarnkalasPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Barnkalas"
          title={<>Kalaset de pratar om<br /><span className="italic-accent">hela terminen</span></>}
          intro="Sand mellan tårna, rörelse och glädje. Barnen leker och spelar på riktig strandsand — och avslutar med pizza och firande i vår lounge. Tryggt för föräldrar, oförglömligt för barnen."
          cta={
            <Link
              href="/events?paket=barnkalas#forfragan"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Boka kalas <span aria-hidden="true">→</span>
            </Link>
          }
        />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
            {FAKTA.map((f, i) => (
              <Reveal key={f.rubrik} delay={i * 0.05} className="border border-black/10 bg-white p-7 lg:p-8">
                <h3 className="mb-4 font-display text-2xl uppercase leading-none text-black">{f.rubrik}</h3>
                <ul className="space-y-2">
                  {f.rader.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm leading-snug text-black/60">
                      <span className="shrink-0 pt-0.5 opacity-40">↗</span>{r}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          {/* Pris */}
          <div className="mt-10 grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:mt-14">
            <Reveal className="bg-lime p-8 lg:p-11">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/50">Med instruktör</p>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="font-display text-5xl text-black">450 kr</span>
                <span className="text-sm text-black/50">/barn</span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-black/60">
                Vår personal leder och anpassar aktiviteten — lek, beachvolley
                eller beachfotboll/footvolley för de fotbollstokiga.
              </p>
            </Reveal>
            <Reveal delay={0.06} className="bg-white p-8 lg:p-11">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/40">Utan instruktör</p>
              <div className="mb-3 flex items-baseline gap-2">
                <span className="font-display text-5xl text-black">350 kr</span>
                <span className="text-sm text-black/40">/barn</span>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-black/50">
                En förälder leder aktiviteten. Extra timme i loungen: 100 kr/barn.
                Vill ni dekorera eller ta med egen tårta? Vi hjälper gärna till.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-10 flex flex-col items-start gap-4 border-t border-black/10 pt-8 lg:mt-14 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-black/40">
              Skicka en förfrågan med önskat datum så återkommer vi inom 24
              timmar och skräddarsyr kalaset.
            </p>
            <Link
              href="/events?paket=barnkalas#forfragan"
              className="shrink-0 cursor-pointer bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
            >
              Skicka förfrågan →
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
