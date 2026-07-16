import type { Metadata } from "next";
import CorporateLanding from "@/components/CorporateLanding";

export const metadata: Metadata = {
  title: "Firmafest i Stockholm — The Beach | Festen på stranden, året runt",
  description:
    "Firmafest med sand mellan tårna — beachvolley, mat, bar och fest i 25 grader, 15 min från Stockholm C. 10–900 gäster, scen och eget kök. Boka i Huddinge.",
  alternates: { canonical: "/firmafest" },
};

export default function FirmafestPage() {
  return (
    <CorporateLanding
      eyebrow="Firmafest"
      title={<>Firmafesten de pratar om<br /><span className="italic-accent">hela året</span></>}
      intro="Byt konferenslokalen mot en strand. Aktivitet, middag, bar och dansgolv under samma tak — mitt i Stockholm, året runt."
      lead="En firmafest ska kännas — inte bara bockas av. Hos oss börjar kvällen med en beachvolleyturnering där alla kan vara med (shorts i december, ja verkligen), och fortsätter med mat och dryck i loungen, scen för tal eller DJ, och fest så länge ni vill. Samma arena där OS- och VM-guldmedaljörerna tränar, 15 minuter från Stockholm C."
      included={[
        "1,5 h beachvolleyturnering med instruktör — inga förkunskaper behövs",
        "Mat och dryck — tapas, buffé eller BBQ, eget kök och full bar",
        "Lounge, scen och ljudanläggning för tal, prisutdelning eller DJ",
        "Pris till kvällens King & Queen of The Beach",
        "Plats för 10–900 gäster — hela arenan kan bli er",
        "Färdiga paket: Las Palmas 745, Algarve 945, Miami 1195 kr/person",
      ]}
      why={[{ h: "Allt under samma tak", p: "Aktivitet, middag, bar och fest utan transporter mellan momenten. Ni kommer hit — resten är löst." }, { h: "Sommar mitt i vintern", p: "3 000 m² sand och 25°C inne, året runt. En firmafest i januari känns som Copacabana." }, { h: "Vi kan stora fester", p: "10 till 900 gäster, scen, eget kök och lång erfarenhet av stora produktioner — utan att tumma på känslan." }]}
      faqs={[
        { q: "Var kan man ha firmafest i Stockholm?", a: "The Beach i Huddinge — en 3 000 m² inomhusstrand 15 minuter från Stockholm C. Beachvolley, middag, bar och fest under samma tak, för 10 till 900 gäster, året runt." },
        { q: "Vad kostar en firmafest?", a: "Färdiga paket från 745 kr/person (Las Palmas). Mest bokat är Algarve, 945 kr/person. Miami 1195 kr/person för helkväll med mer mat och dryck. Priser exklusive moms för företag." },
        { q: "Måste alla spela beachvolley?", a: "Nej. En instruktör leder turneringen och den funkar för alla nivåer — men den som hellre hejar från loungen gör det, med något gott i handen." },
        { q: "Kan vi ha fest för fler än 100 personer?", a: "Ja — arenan tar upp till 900 gäster, med scen och full servering. Vi har producerat allt från 10-personersfester till fullskaliga arrangemang." },
        { q: "Hur bokar vi?", a: "Skicka en förfrågan via formuläret så återkommer vi inom 24 timmar. Eller mejla boka@thebeach.one." },
      ]}
    />
  );
}
