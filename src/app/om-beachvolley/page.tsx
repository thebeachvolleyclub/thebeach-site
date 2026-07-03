import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Om beachvolley — historia, regler & vägen in i sporten | The Beach",
  description:
    "Beachvolley: olympisk sport sedan 1996, född på Kaliforniens stränder. Historien, tävlingsstrukturen i Sverige och hur du kommer igång — förklarat av Stockholms beachvolleycenter.",
};

const ERA = [
  { ar: "1920-tal", text: "Föds på Kaliforniens stränder — surfares tidsfördriv i väntan på rätt vågor. Surfkulturen präglar sporten än idag." },
  { ar: "1930-tal", text: "Två mot två blir formatet — tidigare spelades sex mot sex som i vanlig volleyboll. Sporten sprids till Hawaii." },
  { ar: "1970-tal", text: "Sporten kommersialiseras: första tävlingarna med prispengar i San Diego, mästerskap med över 30 000 åskådare." },
  { ar: "1978", text: "Första svenska SM-slutspelet spelas i Falkenberg." },
  { ar: "1980-tal", text: "Brasiliens stränder tar över taktpinnen, proffstour i USA — och det som blir FIVB World Tour startar." },
  { ar: "1996", text: "Olympisk debut i Atlanta. Sverige har representerats av Englen/Pettersson (1996) och Berg/Dahl (2000, 2004 — bästa OS-placering: nia i Aten)." },
  { ar: "2024–25", text: "Svensk guldålder: Åhman/Hellvig tar OS-guld i Paris och VM-final mot Hölting Nilsson/Andersson i Adelaide — båda lagen tränar på The Beach." },
];

const NIVAER = [
  { n: "Open Grön & Svart", d: "Öppna klasser för alla som vill tävla — här börjar de flesta." },
  { n: "Challenger", d: "Kräver position på Sverigerankingen. Steget upp för ambitiösa." },
  { n: "Swedish Beach Tour", d: "Landets högsta nivå. Höjdpunkten: SM i Tylösand — sporten festligaste helg." },
];

export default function OmBeachvolleyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          minH="min-h-[56svh]"
          eyebrow="Om beachvolley"
          title={<>Sporten där det<br /><span className="italic-accent">alltid är sommar</span></>}
          intro="Olympisk sport sedan 1996, född i Kaliforniens surfkultur och älskad i Sverige — inomhus och utomhus, året runt. Här är historien och vägen in."
          cta={
            <Link
              href="/trana"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Börja spela <span aria-hidden="true">→</span>
            </Link>
          }
        />

        {/* Bild + intro */}
        <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/wilson-boll.jpg" alt="Beachvolleyboll och sand mot svart bakgrund" loading="lazy" className="w-full" />
            </Reveal>
            <Reveal delay={0.08}>
              <p className="eyebrow mb-4">Sporten</p>
              <h2 className="mb-5 font-display text-[clamp(2rem,8vw,3.25rem)] leading-[0.9] text-bone">
                Två spelare.<br />En boll. Sand.
              </h2>
              <p className="mb-4 max-w-md text-[15px] leading-relaxed text-bone/55">
                Beachvolley spelas två mot två — varje spelare rör vid bollen,
                varje beslut syns. Det gör sporten lika intensiv att spela som
                att titta på, och lika rolig första gången som efter tjugo år.
              </p>
              <p className="max-w-md text-[15px] leading-relaxed text-bone/55">
                I Sverige sorterar sporten under Svensk Volleyboll, med en
                landsomfattande sommartour och — tack vare hallarna — spel året
                runt. Varje sommar samlas dessutom kompisgäng på stränder och
                planer över hela landet.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Historia */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">Historien</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              Från surfstränder<br />till OS-guld
            </h2>
          </Reveal>
          <div className="mx-auto max-w-3xl">
            {ERA.map((e, i) => (
              <Reveal key={e.ar} delay={Math.min(i * 0.04, 0.16)} className="flex items-start gap-6 border-b border-black/[0.07] py-5">
                <span className="w-24 shrink-0 font-display text-xl text-black lg:text-2xl">{e.ar}</span>
                <p className="pt-0.5 text-[15px] leading-relaxed text-black/60">{e.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Tävlingsstruktur */}
        <section className="bg-base px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <Reveal className="mb-10">
            <p className="eyebrow mb-4">Tävla i Sverige</p>
            <h2 className="font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-bone">
              Tävlingstrappan
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/45">
              Licensierade spelare samlar rankingpoäng i alla klasser — poängen
              avgör vilken nivå du får spela på.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
            {NIVAER.map((n, i) => (
              <Reveal key={n.n} delay={i * 0.06} className="border border-white/10 bg-white/[0.03] p-7 lg:p-9">
                <span className="mb-4 block font-display text-3xl text-lime/40">0{i + 1}</span>
                <h3 className="mb-2 font-display text-2xl uppercase leading-none text-bone">{n.n}</h3>
                <p className="text-sm leading-relaxed text-bone/55">{n.d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-10 flex flex-col items-start gap-4 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-bone/45">
              Sugen på att testa? Vägen in går via föreningen — licens, klubb
              och din första turnering.
            </p>
            <Link href="/foreningen" className="shrink-0 cursor-pointer bg-lime px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-lime-bright">
              Våga börja tävla →
            </Link>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
