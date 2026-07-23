import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import EventPhotoMarquee from "@/components/events/EventPhotoMarquee";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Julbord — The Beach | Julfesten med sand mellan tårna",
  description:
    "Trött på vanliga julbord? Fira med teamet på stranden i Huddinge: beachvolley, julbord och sommarvärme mitt i vintern. Säsong november–december.",
  openGraph: {
    title: "Julbord på The Beach",
    description:
      "Det alternativa julbordet: aktivitet på sanden + julmat och fest. 25 grader varmt i december.",
    type: "website",
  },
};

const PUNKTER = [
  { rubrik: "Aktivitet först", text: "Beachvolleyturnering med instruktör — eller lekar för blandade grupper. Alla kan vara med, i shorts mitt i december." },
  { rubrik: "Sedan julbord", text: "Julmat och dryck serverat i loungen med utsikt över banorna. Vi skräddarsyr menyn efter er grupp." },
  { rubrik: "Hela kvällen", text: "Stanna kvar, spela mer, umgås. Konferensdel och full servering finns — gör det till årets julfest, inte årets transportsträcka." },
];

export default function JulbordPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Julbord · november–december"
          title={<>Julfest i<br /><span className="italic-accent">25 grader</span></>}
          intro="Trött på samma julbord varje år? Ta med teamet till stranden: turnering på sanden, julmat i loungen och sommarkänsla mitt i vintern. Boka tidigt — helgerna går först."
          cta={
            <Link
              href="/events?paket=julbord#forfragan"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Be om förslag <span aria-hidden="true">→</span>
            </Link>
          }
        />
        <EventPhotoMarquee locale="sv" />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
            {PUNKTER.map((p, i) => (
              <Reveal key={p.rubrik} delay={i * 0.06} className="border border-black/10 bg-white p-7 lg:p-10">
                <span className="mb-4 block font-display text-3xl text-black/15">0{i + 1}</span>
                <h3 className="mb-3 font-display text-2xl uppercase leading-none text-black lg:text-3xl">{p.rubrik}</h3>
                <p className="text-sm leading-relaxed text-black/55">{p.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-10 flex flex-col items-start gap-4 border-t border-black/10 pt-8 lg:mt-14 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-black/40">
              Grupper från 10 till 900 personer. Berätta hur många ni är och när
              ni vill fira, så kommer vi tillbaka med ett upplägg och pris inom
              24 timmar.
            </p>
            <Link
              href="/events?paket=julbord#forfragan"
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
