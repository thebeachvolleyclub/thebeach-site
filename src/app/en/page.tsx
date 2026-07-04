import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import EventFormEn from "@/components/en/EventFormEn";

export const metadata: Metadata = {
  title: "The Beach — Beach volleyball & beach events in Stockholm",
  description:
    "Stockholm's indoor beach arena: 10 courts, a 3,000 m² beach, food & drinks — 15 minutes from the city centre. Corporate events, team days and play, all year round.",
  alternates: { canonical: "/en", languages: { sv: "/", en: "/en" } },
  openGraph: {
    title: "The Beach — Where it's always summer",
    description:
      "Indoor beach arena in Stockholm. Corporate events for 10–900 guests, beach volleyball all year round.",
    type: "website",
  },
};

const QUICK = [
  { n: "01", t: "Play", d: "Book a court via MATCHi — 1.5 h, up to 8 players, balls included.", href: "/en/book" },
  { n: "02", t: "Book an event", d: "Team days, kickoffs and parties for 10–900 guests. Food & drinks included.", href: "/en/events" },
  { n: "03", t: "Schools", d: "A better PE lesson on real sand — everything included.", href: "/en/school" },
  { n: "04", t: "About us", d: "The training base of Olympic champions — and everyone else.", href: "/en/about" },
];

const STATS = [
  { v: "Olympic gold", d: "Paris 2024 — Åhman/Hellvig train here" },
  { v: "World-champion gold", d: "Adelaide 2025 — an all-Swedish final" },
  { v: "800 players", d: "on our sand every week" },
];

export default function EnHome() {
  return (
    <>
      <Navbar locale="en" />
      <main className="flex-1">
        <PageHero
          eyebrow="Beach volleyball & events · Huddinge, Stockholm"
          title={<>Where it&apos;s<br /><span className="italic-accent">always summer</span></>}
          intro="A 3,000 m² indoor beach 15 minutes from Stockholm city centre. 10 indoor courts, 7 outdoor, a stage, full food & beverage — and 28°C in January."
          cta={
            <>
              <a
                href="#request"
                className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
              >
                Book an event <span aria-hidden="true">→</span>
              </a>
              <Link
                href="/en/book"
                className="cursor-pointer text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-bone/55 underline-offset-4 transition-colors hover:text-bone hover:underline"
              >
                How to book a court
              </Link>
            </>
          }
        />

        {/* Quick nav */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK.map((q, i) => (
              <Reveal key={q.n} delay={i * 0.05}>
                <Link href={q.href} className="group flex h-full flex-col border border-black/10 bg-white p-7 transition-colors hover:bg-black hover:text-white lg:p-8">
                  <span className="mb-4 text-[11px] font-bold text-black/25 group-hover:text-lime">{q.n}</span>
                  <h2 className="mb-2 font-display text-2xl uppercase leading-none lg:text-3xl">{q.t}</h2>
                  <p className="flex-1 text-sm leading-relaxed text-black/50 group-hover:text-white/60">{q.d}</p>
                  <span className="mt-5 text-lg" aria-hidden="true">→</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Credentials */}
        <section className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <Reveal className="mb-10">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
              Basecamp for the world&apos;s best
            </p>
            <h2 className="max-w-3xl font-display text-[clamp(2.25rem,9vw,3.75rem)] leading-[0.9] text-black">
              &ldquo;A miniature Copacabana in a warehouse south of Stockholm.&rdquo;
            </h2>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.15em] text-black/40">— Al Jazeera</p>
          </Reveal>
          <Reveal delay={0.05} className="mb-10 max-w-2xl">
            <p className="mb-4 text-[15px] leading-[1.7] text-black/70 lg:text-[17px]">
              The Beach is the home of Swedish beach volleyball when it matters
              most. Åhman/Hellvig train here — Olympic gold and World Championship
              gold. And the world title was settled in an all-Swedish final:
              Åhman/Hellvig against Hölting Nilsson/Andersson — two Swedish pairs
              from our sand playing for the title against each other. That&apos;s how
              wild it is.
            </p>
            <p className="mb-4 text-[15px] leading-[1.7] text-black/70 lg:text-[17px]">
              On top of that, the entire Swedish national team programme is based
              here — every national head coach and squad, junior and senior.
            </p>
            <p className="text-[15px] leading-[1.7] text-black/70 lg:text-[17px]">
              Since 2006 we&apos;ve built a facility and a community that&apos;s open to
              everyone. Whether you&apos;re chasing the stars or just playing for the
              fun of it, you&apos;re just as welcome in the sand. 10 indoor courts and
              7 outdoor — room for the world elite and the first-timer alike.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.v} delay={i * 0.05} className="border-t-2 border-black/80 pt-4">
                <p className="font-display text-2xl uppercase leading-none text-black lg:text-3xl">{s.v}</p>
                <p className="mt-1.5 text-sm text-black/55">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <EventFormEn />
      </main>
      <Footer locale="en" />
    </>
  );
}
