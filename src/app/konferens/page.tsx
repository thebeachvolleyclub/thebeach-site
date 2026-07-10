import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";

export const metadata: Metadata = {
  title: "Konferens i Stockholm — The Beach | Konferens med aktivitet",
  description:
    "Konferens med sand mellan tårna i Huddinge, 15 min från Stockholm. Upp till 3 h möte med projektor + beachvolley, mat och dryck. 10–900 gäster, året runt.",
  alternates: { canonical: "/konferens" },
};

export default function KonferensPage() {
  return (
    <CorporateLanding
      eyebrow="Konferens"
      title={<>Konferens med<br /><span className="italic-accent">sand mellan besluten</span></>}
      intro="Möte och aktivitet på samma ställe — konferens med sand mellan tårna, 15 min från Stockholm C."
      lead="Kör konferensen där energin håller hela dagen. Upp till tre timmars konferens i loungen med projektor och duk, kombinerat med beachvolley, mat och dryck — allt under samma tak i vår inomhusarena. Perfekt för planeringsdagar, kickoffer och ledningskonferenser som ska ge något mer än ett mötesrum."
      included={[
        "Upp till 3 timmars konferens i loungen",
        "Projektor och projektorduk",
        "Beachvolley med instruktör som aktivitet",
        "Mat och dryck — tapas, buffé eller BBQ",
        "Plats för 10–900 gäster",
        "Konferenstillägg 395 kr/person ovanpå valt eventpaket (Las Palmas 745, Algarve 945, Miami 1195 kr/person)",
      ]}
      why={[{ h: "Allt på ett ställe", p: "Aktivitet, mat, dryck och lounge under samma tak — ingen transport mellan moment, ingen logistik för er." }, { h: "Mitt i Stockholm", p: "Novavägen 35 i Huddinge, 15 min från Stockholm C. 3 000 m² sand och 25°C inne, året runt." }, { h: "Vi kan stora event", p: "10 till 900 gäster. Lång erfarenhet av komplexa produktioner — inklusive säkerhetsklassade evenemang — utan att tumma på känslan." }]}
      faqs={[
        { q: "Vad kostar en konferens?", a: "Konferenstillägget är 395 kr/person och läggs ovanpå ett eventpaket — Las Palmas 745 kr, Algarve 945 kr eller Miami 1195 kr per person. Företagspriser anges exklusive moms." },
        { q: "Hur många rymmer ni?", a: "Från 10 upp till 900 gäster. Vi anpassar upplägg och yta efter gruppen." },
        { q: "Kan vi ha möte och aktivitet samma dag?", a: "Ja — det är hela poängen. Konferens i loungen och beachvolley i sanden, samma dag, samma ställe." },
        { q: "Finns teknik för presentationer?", a: "Ja, projektor och projektorduk ingår i konferenstillägget. Behöver ni något särskilt, säg till i förfrågan." },
        { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar med ett upplägg. Eller mejla boka@thebeach.one." },
      ]}
    />
  );
}
