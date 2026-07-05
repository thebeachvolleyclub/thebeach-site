import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";

export const metadata: Metadata = {
  title: "Kickoff i Stockholm — The Beach | Kickoff-aktivitet i sanden",
  description:
    "Kickoff som sätter tonen — beachvolley, mat och after beach-känsla i Huddinge, 15 min från Stockholm. Kväll eller dagtid, 10–900 personer, året runt.",
  alternates: { canonical: "/kickoff" },
};

export default function KickoffPage() {
  return (
    <CorporateLanding
      eyebrow="Kickoff"
      title={<>Kickoff som<br /><span className="italic-accent">sätter tonen</span></>}
      intro="Aktivitet, mat och stämning som får hela gänget med sig — kickoff i sanden, mitt i Stockholm."
      lead="Starta terminen, projektet eller säsongen med en kickoff folk pratar om efteråt. Beachvolleyturnering med instruktör, mat och dryck, och en riktig after beach-känsla — kväll eller dagtid, 10 till 900 personer. Inga förkunskaper behövs, alla kan vara med från första bollen."
      included={[
        "1,5 h beachvolleyturnering med instruktör",
        "Mat och dryck — välj nivå (tapas, buffé eller BBQ)",
        "Pris till dagens King & Queen of The Beach",
        "Kväll eller dagtid, vardag eller helg",
        "Plats för 10–900 gäster",
        "Färdiga paket: Las Palmas 745, Algarve 945, Miami 1195 kr/person",
      ]}
      why={[{ h: "Allt på ett ställe", p: "Aktivitet, mat, dryck och lounge under samma tak — ingen transport mellan moment, ingen logistik för er." }, { h: "Mitt i Stockholm", p: "Novavägen 35 i Huddinge, 15 min från Stockholm C. 3 000 m² sand och 28°C inne, året runt." }, { h: "Vi kan stora event", p: "10 till 900 gäster. Lång erfarenhet av komplexa produktioner — inklusive säkerhetsklassade evenemang — utan att tumma på känslan." }]}
      faqs={[
        { q: "Vad kostar en kickoff?", a: "Färdiga paket från 745 kr/person (Las Palmas). Mest bokat är Algarve, 945 kr/person. Miami 1195 kr/person för helkväll. Exklusive moms för företag." },
        { q: "Behövs förkunskaper i beachvolley?", a: "Nej. En instruktör leder allt och det funkar för nybörjare — poängen är att alla ska med och ha kul." },
        { q: "Kväll eller dagtid?", a: "Båda funkar. Dagtid passar planeringsdagar och kickoffer, kväll blir mer fest och after beach." },
        { q: "Hur många kan vara med?", a: "Från 10 upp till 900 gäster." },
        { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar. Eller mejla boka@thebeach.one." },
      ]}
    />
  );
}
