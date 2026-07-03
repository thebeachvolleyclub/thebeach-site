import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About us — The Beach Stockholm",
  description:
    "Founded in 2006 to play beach volleyball all year round. Today: a 3,000 m² arena in Huddinge, training base of Olympic champions and home to 800 weekly players.",
  alternates: { canonical: "/en/about", languages: { sv: "/om-oss", en: "/en/about" } },
};

const MILESTONES = [
  { y: "2006", t: "The Beach opens in Södertälje — because we wanted to play beach volleyball all year round." },
  { y: "2011", t: "BeachTravels launches: training camps on the world's finest beaches." },
  { y: "2022", t: "Our purpose-built arena in Huddinge opens — 3,000 m², 10 indoor courts, 7 outdoor." },
  { y: "2024", t: "Åhman/Hellvig — who train at The Beach — win Olympic gold in Paris." },
  { y: "2025", t: "An all-Swedish World Championship final in Adelaide. Both teams train here in winter." },
  { y: "2026", t: "Named Entrepreneur of the Year in Huddinge. The journey continues." },
];

const TEAM = [
  { n: "David Cabrera", r: "CEO & co-founder", d: "Events, partnerships and most things behind the scenes.", e: "david@thebeach.one", tel: "+46 704 32 20 28", note: "Text first — David rarely answers unknown numbers." },
  { n: "Mattias Magnusson", r: "Sports director & co-founder", d: "Training groups, courses and the coaching staff. Three-time Swedish champion, Coach of the Year.", e: "mattias@thebeach.one", tel: "+46 733 66 54 33 (SMS preferred)" },
  { n: "Jeybee Ahlkoury", r: "Facility manager", d: "Reception and day-to-day operations in the venue.", e: "jb@thebeach.one", note: "Currently on parental leave." },
  { n: "Måns Björn", r: "Head of youth", d: "Everything kids & youth — from first touch to U19.", e: "mans@thebeach.one" },
  { n: "Rasmus Boden", r: "Business developer & coach", d: "Develops the operation, coaches, and runs tournaments and league play.", e: "rasmus.boden@thebeach.one" },
  { n: "Rasmus Jonsson", r: "CEO, BeachTravels", d: "Leads our sister company for training camps abroad — and captains the Swedish men's national team.", e: "rasmus@beachtravels.se" },
];

export default function EnAbout() {
  return (
    <>
      <Navbar locale="en" />
      <main className="flex-1">
        <PageHero
          eyebrow="About us"
          title={<>Built by players,<br /><span className="italic-accent">for players</span></>}
          intro="We started The Beach in 2006 to play beach volleyball all year round. The goal never changed: create the best possible conditions for anyone who wants to play — beginner or pro."
          cta={
            <a
              href="#contact"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Contact us <span aria-hidden="true">→</span>
            </a>
          }
        />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">The journey</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              20 years of summer
            </h2>
          </Reveal>
          <div className="mx-auto max-w-3xl">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.y} delay={i * 0.04} className="flex items-start gap-6 border-b border-black/[0.07] py-5">
                <span className="w-16 shrink-0 font-display text-2xl text-black lg:text-3xl">{m.y}</span>
                <p className="pt-1 text-[15px] leading-relaxed text-black/60">{m.t}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-base px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">The team</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              The people behind<br />the sand
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((t, i) => (
              <Reveal key={t.n} delay={i * 0.05} className="flex flex-col border border-white/10 bg-white/[0.03] p-7 lg:p-8">
                <h3 className="font-display text-2xl uppercase leading-none text-bone">{t.n}</h3>
                <p className="mb-3 mt-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-lime">{t.r}</p>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-bone/55">{t.d}</p>
                <a href={`mailto:${t.e}`} className="text-[13px] font-semibold text-bone/80 underline-offset-4 hover:underline">{t.e}</a>
                {t.tel ? <p className="mt-1 text-[13px] text-bone/45">{t.tel}</p> : null}
                {t.note ? <p className="mt-2 text-[11px] leading-snug text-bone/30">{t.note}</p> : null}
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">Getting here</p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black">
                15 minutes from<br />Stockholm Central
              </h2>
              <p className="mb-6 max-w-md text-[15px] leading-relaxed text-black/60">
                Novavägen 35, 141 44 Huddinge. Commuter rail to Flemingsberg or
                Stuvsta and a short walk — or drive, with plenty of parking
                right outside.
              </p>
              <a
                href="https://maps.google.com/?q=The+Beach+Novav%C3%A4gen+35+Huddinge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 bg-black px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
              >
                Open in Google Maps <span aria-hidden="true">→</span>
              </a>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">Contact</p>
              <div className="flex flex-col divide-y divide-black/10 bg-white/40">
                <a href="mailto:boka@thebeach.one" className="flex items-center justify-between p-5 transition-colors hover:bg-white/60">
                  <span className="text-sm font-semibold text-black/70">Bookings & events</span>
                  <span className="font-display text-lg text-black">boka@thebeach.one</span>
                </a>
                <a href="mailto:david@thebeach.one" className="flex items-center justify-between p-5 transition-colors hover:bg-white/60">
                  <span className="text-sm font-semibold text-black/70">Corporate & partnerships</span>
                  <span className="font-display text-lg text-black">david@thebeach.one</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale="en" />
    </>
  );
}
