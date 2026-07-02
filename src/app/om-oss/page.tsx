import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Om oss — The Beach | Beachvolleybollens hem i Stockholm",
  description:
    "Startade 2006 för att kunna spela beachvolley året runt. Idag: 3 000 kvm arena i Huddinge, träningsbas för landslaget och hem för ett community på 800 spelare i veckan.",
  openGraph: {
    title: "Om oss — The Beach",
    description:
      "Historien, teamet och vägen hit. The Beach — beachvolleybollens hem i Stockholm sedan 2006.",
    type: "website",
  },
};

const MILSTOLPAR = [
  { ar: "2006", text: "The Beach öppnar i Södertälje — för att vi ville spela beachvolley året runt." },
  { ar: "2011", text: "BeachTravels startar: träningsresor till världens finaste stränder." },
  { ar: "2022", text: "Nybyggd anläggning i Huddinge invigs — 3 000 kvm, 10 banor inomhus, 7 utomhus." },
  { ar: "2024", text: "Åhman/Hellvig — som tränar på The Beach — tar OS-guld i Paris." },
  { ar: "2025", text: "Helsvensk VM-final i Adelaide. Båda lagen tränar här vintertid." },
  { ar: "2026", text: "Utsedda till Årets Företagare i Huddinge. Resan fortsätter." },
];

const TEAM = [
  {
    namn: "David Cabrera",
    roll: "VD & medgrundare",
    desc: "Event, affärer och det mesta bakom kulisserna.",
    kontakt: "david@thebeach.se",
    tel: "0704-32 20 28",
    notis: "Skicka gärna SMS först — David svarar sällan på okända nummer.",
  },
  {
    namn: "Mattias Magnusson",
    roll: "Sportchef & medgrundare",
    desc: "Träningsgrupper, kurser och tränarstaben. Trefaldig svensk mästare och Coach of the Year.",
    kontakt: "mattias@thebeach.se",
    tel: "0733-66 54 33 (helst SMS)",
  },
  {
    namn: "Jeybee Ahlkoury",
    roll: "Hallansvarig",
    desc: "Reception och daglig drift i anläggningen.",
    kontakt: "jb@thebeach.se",
    tel: "073-710 78 81",
  },
  {
    namn: "Rasmus Jonsson",
    roll: "VD BeachTravels",
    desc: "Leder vårt systerbolag som arrangerar träningsresor — och är förbundskapten för herrlandslaget.",
    kontakt: "rasmus@beachtravels.se",
  },
];

export default function OmOssPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Om oss"
          title={<>Byggt av spelare,<br /><span className="italic-accent">för spelare</span></>}
          intro="Vi startade The Beach 2006 för att kunna spela beachvolley året runt. Målet har aldrig ändrats: skapa världens bästa förutsättningar för alla som vill spela — nybörjare som proffs."
          cta={
            <a
              href="#kontakt"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Kontakta oss <span aria-hidden="true">→</span>
            </a>
          }
        />

        {/* Milstolpar */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              Resan
            </p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              20 år av sommar
            </h2>
          </Reveal>
          <div className="mx-auto max-w-3xl">
            {MILSTOLPAR.map((m, i) => (
              <Reveal key={m.ar} delay={i * 0.04} className="flex items-start gap-6 border-b border-black/[0.07] py-5">
                <span className="w-16 shrink-0 font-display text-2xl text-black lg:text-3xl">{m.ar}</span>
                <p className="pt-1 text-[15px] leading-relaxed text-black/60">{m.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Teamet */}
        <section className="bg-base px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">Teamet</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Människorna bakom<br />sanden
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((t, i) => (
              <Reveal key={t.namn} delay={i * 0.06} className="flex flex-col border border-white/10 bg-white/[0.03] p-7 lg:p-8">
                <h3 className="font-display text-2xl uppercase leading-none text-bone">{t.namn}</h3>
                <p className="mb-3 mt-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-lime">{t.roll}</p>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-bone/55">{t.desc}</p>
                <a href={`mailto:${t.kontakt}`} className="text-[13px] font-semibold text-bone/80 underline-offset-4 hover:underline">
                  {t.kontakt}
                </a>
                {t.tel ? <p className="mt-1 text-[13px] text-bone/45">{t.tel}</p> : null}
                {t.notis ? <p className="mt-2 text-[11px] leading-snug text-bone/30">{t.notis}</p> : null}
              </Reveal>
            ))}
          </div>
        </section>

        {/* Hitta hit + kontakt */}
        <section id="kontakt" className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
                Hitta hit
              </p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black">
                15 min från<br />Stockholm C
              </h2>
              <p className="mb-6 max-w-md text-[15px] leading-relaxed text-black/60">
                Novavägen 35, 141 44 Huddinge. Pendeltåg till Flemingsberg eller
                Stuvsta och en kort promenad — eller bil med gott om parkering
                direkt vid hallen.
              </p>
              <a
                href="https://maps.google.com/?q=The+Beach+Novav%C3%A4gen+35+Huddinge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                Öppna i Google Maps <span aria-hidden="true">→</span>
              </a>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
                Kontakt
              </p>
              <div className="flex flex-col divide-y divide-black/10 bg-white/40">
                <a href="mailto:boka@thebeach.se" className="flex items-center justify-between p-5 transition-colors hover:bg-white/60">
                  <span className="text-sm font-semibold text-black/70">Bokningar & event</span>
                  <span className="font-display text-lg text-black">boka@thebeach.se</span>
                </a>
                <a href="mailto:david@thebeach.se" className="flex items-center justify-between p-5 transition-colors hover:bg-white/60">
                  <span className="text-sm font-semibold text-black/70">Företag & partnerskap</span>
                  <span className="font-display text-lg text-black">david@thebeach.se</span>
                </a>
                <a href="mailto:boka@thebeach.se?subject=Jobba%20hos%20oss" className="flex items-center justify-between p-5 transition-colors hover:bg-white/60">
                  <span className="text-sm font-semibold text-black/70">Jobba hos oss</span>
                  <span className="font-display text-lg text-black">Skicka din ansökan →</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
