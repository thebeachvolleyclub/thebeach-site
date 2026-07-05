import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";

export const metadata: Metadata = {
  title: "Teambuilding i Stockholm — The Beach | Teambuilding inomhus året runt",
  description:
    "Teambuilding som bygger lag på riktigt — beachvolley är samarbete, skratt och lite tävling. Inomhus i Huddinge, 28°C året runt. Inga förkunskaper, 10–900 personer.",
  alternates: { canonical: "/teambuilding" },
};

export default function TeambuildingPage() {
  return (
    <CorporateLanding
      eyebrow="Teambuilding"
      title={<>Teambuilding<br /><span className="italic-accent">i sanden</span></>}
      intro="Beachvolley är samarbete, skratt och lite tävling — teambuilding som bygger lag på riktigt, inomhus året runt."
      lead="Inget svetsar ihop ett team som att kämpa, skratta och heja fram varandra i sanden. Instruktörsledd beachvolley som funkar för alla nivåer — nybörjare som vana — kombinerat med mat och dryck. Och eftersom vi är inomhus med 28°C är det lika bra i januari som i juli."
      included={[
        "Instruktörsledd beachvolley för alla nivåer",
        "Inga förkunskaper — alla kan vara med",
        "Lagindelning och lekfull tävling",
        "Mat och dryck efter önskemål",
        "Inomhus, 28°C, året runt",
        "Plats för 10–900 gäster · paket från 745 kr/person",
      ]}
      why={[{ h: "Allt på ett ställe", p: "Aktivitet, mat, dryck och lounge under samma tak — ingen transport mellan moment, ingen logistik för er." }, { h: "Mitt i Stockholm", p: "Novavägen 35 i Huddinge, 15 min från Stockholm C. 3 000 m² sand och 28°C inne, året runt." }, { h: "Vi kan stora event", p: "10 till 900 gäster. Lång erfarenhet av komplexa produktioner — inklusive säkerhetsklassade evenemang — utan att tumma på känslan." }]}
      faqs={[
        { q: "Behöver man kunna spela beachvolley?", a: "Nej. En instruktör leder passet och lägger nivån efter gruppen — hela poängen är att alla ska med, oavsett vana." },
        { q: "Funkar det på vintern?", a: "Ja. Vi är inomhus med 28°C året runt — teambuilding i sanden mitt i vintern är en av våra mest uppskattade grejer." },
        { q: "Hur stora grupper tar ni?", a: "Från 10 upp till 900 gäster." },
        { q: "Kan vi kombinera med mat eller konferens?", a: "Ja — lägg till mat och dryck, eller ett konferenstillägg (395 kr/person) om ni vill köra möte samma dag." },
        { q: "Vad kostar det?", a: "Färdiga paket från 745 kr/person (Las Palmas). Skicka en förfrågan så sätter vi ihop ett upplägg." },
      ]}
    />
  );
}
