import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import RichText from "@/components/RichText";
import AbonnemangFormClient, { ABONNEMANG_MAILTO } from "@/components/abonnemang/AbonnemangFormClient";
import { og } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Banabonnemang — din fasta tid i sanden | The Beach",
  description:
    "Samma bana, samma tid, varje vecka hela terminen. Banabonnemang på The Beach i Huddinge — en medlemsförmån från 450 kr per tillfälle. Se priser, lediga tider och hur det går till.",
  openGraph: og(
    "/abonnemang",
    "Banabonnemang – din fasta tid i sanden",
    "Samma bana och samma tid varje vecka, hela terminen. En medlemsförmån på The Beach.",
  ),
};

const MEDLEMSKAP = "/konto#medlemskap";
const VILLKOR = "/villkor/banabonnemang";

const TERMIN = {
  namn: "Höstterminen 2026",
  period: "31 augusti – 20 december",
};

const PRISKLASSER: Array<{ klass: string; pris: string; vardagar: string; helger: string }> = [
  { klass: "A", pris: "780 kr", vardagar: "17.30–20.30", helger: "10.30–18.30" },
  { klass: "B", pris: "600 kr", vardagar: "16.00–17.30 och 20.30–22.00", helger: "09.00–10.30 och 18.30–22.00" },
  { klass: "C", pris: "450 kr", vardagar: "före 16.00", helger: "–" },
];

const STEG: Array<{ title: string; text: string }> = [
  {
    title: "Hör av dig",
    text: "Berätta vilken veckodag och tid du vill ha och vilken vecka du vill börja. Har du flera alternativ – skriv dem också.",
  },
  {
    title: "Du får ett erbjudande",
    text: "Vi lägger upp ett erbjudande i Mitt konto med startdatum, antal tillfällen och totalpris.",
  },
  {
    title: "Godkänn och betala",
    text: "Du godkänner och betalar i Mitt konto på thebeach.one. Swish är enklast, kort finns som alternativ.",
  },
  {
    title: "Tiden är din",
    text: "Alla tillfällen ligger i din bokningslista hela perioden. Dyk upp och spela.",
  },
];

const LEDIGA_TIDER = [
  "Tisdagar 20.30–22.00",
  "Söndagar 09.00–10.30",
  "Söndagar 20.00–21.30",
  "Dagtid vardagar 07–16 (de flesta tider)",
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Måste jag vara medlem?",
    a: "Ja. Banabonnemang är en medlemsförmån och kräver medlemskap hos The Beach. Bli medlem under [Mitt konto](/konto#medlemskap).",
  },
  {
    q: "Kan jag börja mitt i terminen?",
    a: "Ett abonnemang gäller en hel termin. Har terminen redan börjat? Hör av dig så kan du ansöka om att hoppa på från en senare vecka – priset räknas på de tillfällen som är kvar fram till terminens slut.",
  },
  {
    q: "Vad händer om jag inte kan en vecka?",
    a: "Släpp tiden i Mitt konto så blir den bokningsbar för andra. Bokar någon annan den får du 90 % av värdet tillgodo att använda på en annan bokning inom ett år. Bokas den inte är tillfället förbrukat.",
  },
  {
    q: "Kan vi dela abonnemanget i gänget?",
    a: "Ja. En person står på abonnemanget och tar med sig vilka hen vill – vem som spelar kan variera från vecka till vecka.",
  },
  {
    q: "Hur betalar jag?",
    a: "I Mitt konto på thebeach.one när du godkänner erbjudandet. Swish är det enklaste, men du kan också betala med kort.",
  },
  {
    q: "Gäller det även vår och sommar?",
    a: "Ja, nya terminer öppnar inför varje säsong. Håll utkik här på sidan eller hör av dig så berättar vi när nästa termin går att boka.",
  },
];

export default function AbonnemangPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <Navbar />
      <main className="flex-1">
        <PageHero
          minH="min-h-[56svh]"
          eyebrow="Banabonnemang"
          title={<>Din fasta tid{" "}<br /><span className="italic-accent">i sanden</span></>}
          intro="Samma bana, samma tid, varje vecka hela terminen. Inget letande efter lediga tider, inget bokningsrace – bara ni och sanden. En förmån för dig som är medlem."
          cta={
            <a
              href="#fraga"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Fråga om abonnemang <span aria-hidden="true">→</span>
            </a>
          }
        />

        {/* Så funkar det */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">Så funkar det</p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black">
                En tid som{" "}<br />alltid är din
              </h2>
              <p className="mb-4 max-w-md text-[15px] leading-relaxed text-black/55">
                Med ett banabonnemang har du samma bana och samma tid varje vecka under terminen. Tiden ligger
                klar i din bokningslista, så det enda du behöver göra är att komma och spela.
              </p>
              <p className="max-w-md text-[15px] leading-relaxed text-black/55">
                Ett abonnemang gäller en hel termin – {TERMIN.namn.toLowerCase()} pågår {TERMIN.period}. Har terminen
                redan börjat? Hör av dig så kan du ansöka om att hoppa på från en senare vecka – priset räknas på de
                tillfällen som är kvar.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ul className="divide-y divide-black/10 border border-black/10 bg-white">
                {[
                  "Samma bana och samma tid varje vecka – 90 minuter per tillfälle",
                  "Gäller en hel termin – har den redan börjat kan du ansöka om att hoppa på senare",
                  "Pris per tillfälle efter tidsklass – totalpriset är antal tillfällen × pris",
                  "Kan du inte en vecka? Släpp tiden och få 90 % tillgodo om någon annan bokar den",
                  "En medlemsförmån – kräver medlemskap hos The Beach",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 p-5 text-[15px] leading-snug text-black/70">
                    <span className="shrink-0 pt-0.5 text-lime [text-shadow:0_0_1px_rgba(0,0,0,0.35)]" aria-hidden="true">↗</span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Pris */}
        <section id="pris" className="scroll-mt-8 bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">Pris</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Antal tillfällen{" "}<br />× pris per tillfälle
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-bone/55">
              Priset beror på när i veckan du spelar. Varje tillfälle är 90 minuter och faller i en av tre klasser.
              Totalpriset för abonnemanget är helt enkelt antalet tillfällen gånger priset för klassen.
            </p>
          </Reveal>

          <Reveal className="overflow-x-auto border border-white/10 bg-white/[0.03]">
            <table className="w-full min-w-[560px] text-left text-sm text-bone/70">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40">
                  <th scope="col" className="px-5 py-4 lg:px-7">Klass</th>
                  <th scope="col" className="px-5 py-4 lg:px-7">Per tillfälle</th>
                  <th scope="col" className="px-5 py-4 lg:px-7">Vardagar</th>
                  <th scope="col" className="px-5 py-4 lg:px-7">Helger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {PRISKLASSER.map((p) => (
                  <tr key={p.klass}>
                    <td className="px-5 py-5 lg:px-7">
                      <span className="font-display text-3xl text-lime">{p.klass}</span>
                    </td>
                    <td className="px-5 py-5 font-display text-2xl text-bone lg:px-7 lg:text-3xl">{p.pris}</td>
                    <td className="px-5 py-5 lg:px-7">{p.vardagar}</td>
                    <td className="px-5 py-5 lg:px-7">{p.helger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <div className="mt-0.5 grid grid-cols-1 gap-0.5 lg:grid-cols-2">
            <Reveal delay={0.06} className="border border-lime/30 bg-lime/[0.06] p-7 lg:p-10">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-lime">Räkneexempel</p>
              <p className="font-display text-2xl leading-tight text-bone lg:text-3xl">
                15 tisdagar kl 20.30 = 15 × 600 kr = 9 000 kr
              </p>
              <p className="mt-3 text-sm leading-relaxed text-bone/55">
                Tisdag 20.30 är klass B. Hoppar du på efter terminsstart räknas priset på de tillfällen som är kvar
                fram till terminens slut.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="border border-white/10 bg-white/[0.03] p-7 lg:p-10">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-bone/40">Bra att veta</p>
              <p className="text-sm leading-relaxed text-bone/55">
                Banabonnemang är en medlemsförmån och kräver{" "}
                <Link href={MEDLEMSKAP} className="text-bone underline underline-offset-4 hover:text-lime">medlemskap i The Beach</Link>.
                Det är personligt och gäller privatpersoner – företag och andra juridiska personer har företagstaxa
                och är välkomna via{" "}
                <Link href="/events" className="text-bone underline underline-offset-4 hover:text-lime">event och företag</Link>.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Så går det till */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">Så går det till</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              Fyra steg{" "}<br />till din tid
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
            {STEG.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06} className="border border-black/10 bg-white p-7 lg:p-9">
                <span className="mb-4 block font-display text-3xl text-black/15">0{i + 1}</span>
                <h3 className="mb-3 font-display text-2xl text-black">{s.title}</h3>
                <p className="text-sm leading-relaxed text-black/60">{s.text}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-0.5 grid grid-cols-1 gap-0.5 lg:grid-cols-2">
            <Reveal delay={0.08} className="border border-black/10 bg-white p-7 lg:p-10">
              <h3 className="mb-3 font-display text-2xl text-black">Kan du inte en vecka?</h3>
              <p className="text-sm leading-relaxed text-black/60">
                Släpp tiden i Mitt konto innan den börjar, så blir den bokningsbar för andra. Bokar någon annan den
                får du 90 % av värdet tillgodo att använda på en annan bokning inom ett år. Bokas den inte är
                tillfället förbrukat.
              </p>
            </Reveal>
            <Reveal delay={0.12} className="border border-black/10 bg-white p-7 lg:p-10">
              <h3 className="mb-3 font-display text-2xl text-black">Om vi behöver banan</h3>
              <p className="text-sm leading-relaxed text-black/60">
                I undantagsfall kan vi behöva avboka en abonnemangstid när banan behövs för ett event eller av
                annan anledning. Då meddelar vi dig så tidigt vi kan, och du får hela värdet för det tillfället som
                tillgodo att använda på en annan bokning.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.14} className="mt-8">
            <p className="text-sm text-black/45">
              Allt det finstilta finns i{" "}
              <Link href={VILLKOR} className="font-semibold text-black underline underline-offset-4 hover:text-black/60">
                villkoren för banabonnemang
              </Link>.
            </p>
          </Reveal>
        </section>

        {/* Lediga tider just nu */}
        <section className="bg-mint px-5 py-14 text-black sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">Lediga tider just nu</p>
              <h2 className="mb-3 font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95]">
                Här finns plats{" "}<br />för en fast tid
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-black/55">
                Listan ändras löpande när abonnemang tecknas och tider släpps. Ser du inte din tid – fråga ändå.
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <ul className="grid grid-cols-1 gap-0.5 sm:grid-cols-2">
                {LEDIGA_TIDER.map((t) => (
                  <li key={t} className="border border-black/10 bg-white/70 px-5 py-4 font-display text-lg leading-tight text-black lg:text-xl">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-black/40">Uppdaterad 5 oktober 2026 · {TERMIN.namn}</p>
            </Reveal>
          </div>
        </section>

        {/* Förfrågan */}
        <section id="fraga" className="scroll-mt-8 bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">Förfrågan</p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black lg:text-[clamp(2.75rem,4.5vw,4.5rem)]">
                Fråga om{" "}<br />abonnemang
              </h2>
              <p className="mb-4 max-w-md text-[15px] leading-relaxed text-black/60">
                Skriv vilken tid du vill ha och när du vill börja. Vi kollar vad som är ledigt och lägger upp ett
                erbjudande i ditt konto.
              </p>
              <p className="max-w-md text-[15px] leading-relaxed text-black/60">
                Hellre mejla? Skriv till{" "}
                <a href={ABONNEMANG_MAILTO} className="text-black underline underline-offset-4 transition-colors hover:text-black/60">
                  boka@thebeach.one
                </a>{" "}
                med ämnet Abonnemang.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <AbonnemangFormClient />
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-8">
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">Vanliga frågor</p>
              <h2 className="font-display text-[clamp(2rem,8vw,3rem)] leading-[0.9] text-black">Bra att veta</h2>
            </Reveal>
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={Math.min(i * 0.03, 0.15)}>
                <details className="group border-b border-black/10">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-display text-lg uppercase leading-tight text-black marker:content-none lg:text-xl">
                    {f.q}
                    <span className="shrink-0 text-black/30 transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-6 text-[15px] leading-relaxed text-black/60"><RichText text={f.a} /></p>
                </details>
              </Reveal>
            ))}
            <Reveal delay={0.1} className="mt-8">
              <p className="text-sm text-black/45">
                Fler detaljer hittar du i{" "}
                <Link href={VILLKOR} className="font-semibold text-black underline underline-offset-4 hover:text-black/60">
                  villkoren för banabonnemang
                </Link>.
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
