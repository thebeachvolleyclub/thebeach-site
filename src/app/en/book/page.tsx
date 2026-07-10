import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Book a court — The Beach Stockholm | How it works",
  description:
    "Book a beach volleyball court in Stockholm: 10 indoor courts, 1.5 h sessions, up to 8 players per court. Prices and how booking via MATCHi works.",
  alternates: { canonical: "/en/book", languages: { sv: "/boka", en: "/en/book" } },
};

const STEPS = [
  { t: "Pick a time", d: "All available slots are on MATCHi. A session is 1.5 hours and a court takes up to 8 players — you pay per court, not per person." },
  { t: "Book & pay", d: "Create a free MATCHi account (Sweden's standard booking platform for racket sports) and pay directly in the app or on the web." },
  { t: "Come play", d: "Balls are included and waiting in the hall. Changing rooms, 14 showers and a café on site. Barefoot in the sand — it's 25°C inside, all year." },
];

const PRICES = [
  { time: "Daytime", nonMember: "SEK 600", member: "SEK 540" },
  { time: "Shoulder hours", nonMember: "SEK 720", member: "SEK 660" },
  { time: "Evening peak", nonMember: "SEK 840", member: "SEK 720" },
];

export default function EnBook() {
  return (
    <>
      <Navbar locale="en" />
      <main className="flex-1">
        <PageHero
          minH="min-h-[56svh]"
          eyebrow="Book a court"
          title={<>Sand, a ball and<br /><span className="italic-accent">90 minutes</span></>}
          intro="10 indoor courts and 7 outdoor in Huddinge, 15 minutes from Stockholm city centre. Everything you need to know before you book — the booking itself happens on MATCHi."
          cta={
            <a
              href="https://www.matchi.se/facilities/thebeach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Open MATCHi <span aria-hidden="true">→</span>
            </a>
          }
        />

        <section className="bg-base px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="eyebrow mb-4">How it works</p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
              Three steps to the sand
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.06} className="border border-white/10 bg-white/[0.03] p-7 lg:p-10">
                <span className="mb-4 block font-display text-3xl text-lime/40">0{i + 1}</span>
                <h3 className="mb-3 font-display text-2xl uppercase leading-none text-bone lg:text-3xl">{s.t}</h3>
                <p className="text-sm leading-relaxed text-bone/55">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <Reveal className="mb-8">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">Prices</p>
            <h2 className="font-display text-[clamp(2rem,8vw,3.25rem)] leading-[0.9] text-black">
              Per court, 1.5 hours — indoor
            </h2>
          </Reveal>
          <Reveal className="max-w-2xl overflow-hidden border border-black/10 bg-white">
            <table className="w-full border-collapse">
              <caption className="sr-only">Court fees — indoor, per court, 1.5 h</caption>
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.03]">
                  <th scope="col" className="py-3 pl-6 pr-4 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">Time</th>
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-black/40">Non-member</th>
                  <th scope="col" className="py-3 pl-4 pr-6 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-black/70">Member</th>
                </tr>
              </thead>
              <tbody>
                {PRICES.map((r) => (
                  <tr key={r.time} className="border-b border-black/[0.06] last:border-0">
                    <td className="py-3.5 pl-6 pr-4 text-sm font-semibold text-black">{r.time}</td>
                    <td className="px-4 py-3.5 text-sm text-black/50">{r.nonMember}</td>
                    <td className="py-3.5 pl-4 pr-6 text-sm font-semibold text-black">{r.member}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal delay={0.08} className="mt-8 flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-black/40">
              Rather play with a coach, or book the whole place for your team?
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/en/events" className="cursor-pointer bg-black px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85">
                Book an event →
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer locale="en" />
    </>
  );
}
