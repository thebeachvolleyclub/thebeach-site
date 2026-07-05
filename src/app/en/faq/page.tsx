import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";

export const metadata: Metadata = {
  title: "FAQ — The Beach",
  description:
    "Quick answers before your visit: booking, gear, showers, parking, food and prices. Can't find it? Email boka@thebeach.one.",
  alternates: {
    canonical: "/en/faq",
    languages: { sv: "/faq", en: "/en/faq", "x-default": "/faq" },
  },
};

const FAQ: { q: string; a: string }[] = [
  { q: "How do I book a court?", a: "Courts are booked via our [book a court page](/en/book). A standard session is 1.5 hours. Events, school visits and groups are booked via the request form or boka@thebeach.one." },
  { q: "I've never played — can I still come?", a: "Absolutely. The beginner course is built for first-timers, and try-out sessions and events need no experience at all. Just bring workout clothes." },
  { q: "What do I need to bring?", a: "Just yourself and workout clothes. Balls, nets and all equipment are here. You play barefoot in the sand — all year round, it's always warm inside." },
  { q: "Are there showers and changing rooms?", a: "Yes — 14 showers and changing rooms on site." },
  { q: "How do I get there?", a: "Novavägen 35, 141 44 Huddinge. Commuter train to Flemingsberg or Stuvsta and a short walk, or by car — there's plenty of parking right by the hall." },
  { q: "Is there food and drink?", a: "Yes, there's a café and bar in the lounge. For events, food is included in the packages (Las Palmas, Algarve, Miami) and we're happy to tailor menus for larger groups." },
  { q: "What does an event cost?", a: "Ready-made packages from 745 SEK/person (Las Palmas). The most booked is Algarve, 945 SEK/person. Conference add-on +395 SEK/person. Corporate prices are excl. VAT." },
  { q: "Can children play?", a: "Yes — we run kids' and youth training, kids' parties (ages 6–11) and welcome school classes on weekdays. See [Schools](/en/school)." },
  { q: "How do I cancel training or a course?", a: "It depends what you want to cancel. Course (beginner or intermediate): email boka@thebeach.one as soon as you can — if your spot can be filled by someone else you keep the value as credit for the next course, and if you cancel in good time before it begins we credit you. Training group: the terms you accepted at registration apply — read [cancellation & terms](/avanmalan) and cancel via the form there. Court booking: cancel directly in MATCHi." },
  { q: "I'm in a training group and not happy with it. What do I do?", a: "Fill in a change request and we'll work on it as fast as we can. If you feel you're placed at the wrong level, talk to your coach after practice first. Avoid emailing the front desk or mentioning it in passing — it easily leads to misunderstandings. You keep your spot until something else is decided and confirmed in writing. Read more and file your [change request](/andringsanmalan)." },
];

export default function FaqEnPage() {
  return (
    <>
      <Navbar locale="en" />
      <main className="flex-1">
        <PageHero
          minH="min-h-[46svh]"
          eyebrow="FAQ"
          title={<>Frequently<br /><span className="italic-accent">asked</span></>}
          intro="Quick answers before your visit. Can't find what you're looking for? Email boka@thebeach.one and we'll reply within 24 hours."
        />
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
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
          </div>
        </section>
      </main>
      <Footer locale="en" />
    </>
  );
}
