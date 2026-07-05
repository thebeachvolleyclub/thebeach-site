import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";

export const metadata: Metadata = {
  title: "Företagsevent i Stockholm — The Beach | Från AW till storproduktion",
  description:
    "Företagsevent utöver det vanliga — från enkel after work till stora produktioner. Färdiga koncept eller skräddarsytt, 10–900 gäster, i Huddinge 15 min från Stockholm.",
  alternates: { canonical: "/foretagsevent" },
};

export default function ForetagseventPage() {
  return (
    <CorporateLanding
      eyebrow="Företagsevent"
      title={<>Företagsevent<br /><span className="italic-accent">utöver det vanliga</span></>}
      intro="Från enkel after work till stora produktioner — färdiga koncept eller helt skräddarsytt, 10–900 gäster."
      lead="Oavsett om ni planerar en AW, kickoff, konferens, fest eller ett stort företagsevent har vi ett upplägg som funkar — utan krångel. Färdiga eventkoncept där aktivitet, mat, dryck och stämning sitter från start, eller ett skräddarsytt event byggt kring era behov. Sand mellan tårna, 15 min från Stockholm C."
      included={[
        "Färdiga koncept: Las Palmas 745, Algarve 945, Miami 1195 kr/person",
        "Konferenstillägg 395 kr/person",
        "Beachvolley med instruktör, mat och dryck",
        "Skräddarsytt för större event och eventbyråer",
        "10–900 gäster, kväll eller dagtid",
        "Erfarenhet av komplexa och säkerhetsklassade event",
      ]}
      why={[{ h: "Allt på ett ställe", p: "Aktivitet, mat, dryck och lounge under samma tak — ingen transport mellan moment, ingen logistik för er." }, { h: "Mitt i Stockholm", p: "Novavägen 35 i Huddinge, 15 min från Stockholm C. 3 000 m² sand och 25°C inne, året runt." }, { h: "Vi kan stora event", p: "10 till 900 gäster. Lång erfarenhet av komplexa produktioner — inklusive säkerhetsklassade evenemang — utan att tumma på känslan." }]}
      faqs={[
        { q: "Vad kostar ett företagsevent?", a: "Färdiga paket från 745 kr/person (Las Palmas), mest bokat är Algarve 945 kr, och Miami 1195 kr för helkväll. Konferenstillägg +395 kr/person. Större och skräddarsydda event offereras. Exklusive moms." },
        { q: "Hur stora event klarar ni?", a: "Från 10 upp till 900 gäster. Vi har lång erfarenhet av stora produktioner med komplex logistik — inklusive säkerhetsklassade evenemang." },
        { q: "Kan ni skräddarsy?", a: "Ja. Utöver de färdiga paketen bygger vi helt skräddarsydda upplägg för företag och eventbyråer — säg vad ni vill åstadkomma." },
        { q: "Ingår mat och dryck?", a: "Ja, i paketen. Vi skräddarsyr gärna menyer för större sällskap." },
        { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar med ett förslag. Eller mejla boka@thebeach.one." },
      ]}
    />
  );
}
