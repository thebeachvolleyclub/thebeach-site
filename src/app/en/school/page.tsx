import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SchoolFormEn from "@/components/en/SchoolFormEn";

export const metadata: Metadata = {
  title: "Schools — The Beach Stockholm | A better PE lesson",
  description:
    "Bring your class to Stockholm's beach volleyball arena. SEK 100 per student for 1.5 hours — everything included. Instructor-led sessions and tournaments available.",
  alternates: { canonical: "/en/school", languages: { sv: "/skola", en: "/en/school" } },
};

const INCLUDED = [
  "10 indoor courts — room for the whole class",
  "Nets, lines, antennas and balls",
  "14 showers and changing rooms",
  "Accompanying teachers join for free",
  "Warm all year — summer even in January",
  "Parking and commuter rail nearby",
];

export default function EnSchool() {
  return (
    <>
      <Navbar locale="en" />
      <main className="flex-1">
        <PageHero
          eyebrow="Schools"
          title={<>A better<br /><span className="italic-accent">PE lesson</span></>}
          intro="Bring your class to Stockholm's beach volleyball arena in Huddinge. Sand between the toes, movement and play for everyone — no experience needed, all equipment included."
          cta={
            <a
              href="#request"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Send a request <span aria-hidden="true">→</span>
            </a>
          }
        />

        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <Reveal className="mb-10">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              Everything included
            </p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              Come as you are —<br />we&apos;ve got the rest
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
            {INCLUDED.map((f, i) => (
              <Reveal key={f} delay={i * 0.05} className="border border-black/10 bg-white p-6 lg:p-8">
                <span className="mb-3 block text-lime [text-shadow:0_0_1px_rgba(0,0,0,0.35)]" aria-hidden="true">↗</span>
                <p className="text-[15px] leading-snug text-black/70">{f}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-8 grid grid-cols-1 gap-0.5 sm:grid-cols-2">
            <div className="bg-white p-7 lg:p-9">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/40">Play on your own</p>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="font-display text-4xl text-black">SEK 100</span>
                <span className="text-sm text-black/40">/student · 1.5 h</span>
              </div>
              <p className="text-sm leading-relaxed text-black/55">
                The teacher runs the session, we provide courts and equipment.
                Extend for SEK 30/student per extra 30 minutes.
              </p>
            </div>
            <div className="bg-lime p-7 lg:p-9">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/50">With instructor</p>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="font-display text-4xl text-black">SEK 1,500</span>
                <span className="text-sm text-black/50">up to 40 students</span>
              </div>
              <p className="text-sm leading-relaxed text-black/60">
                Our instructor runs a beach volleyball clinic and closing
                tournament. SEK 2,000 for more than 40 students, on top of the
                per-student price. Best availability weekdays 07–16.
              </p>
            </div>
          </Reveal>
        </section>

        <section id="request" className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
                Book a school visit
              </p>
              <h2 className="mb-5 font-display text-[clamp(2.25rem,9vw,3.5rem)] leading-[0.9] text-black">
                Send a request —<br />we&apos;ll sort the rest
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-black/60">
                Tell us when you&apos;d like to come and how many you are.
                We reply within 24 hours — or email boka@thebeach.one directly.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <SchoolFormEn />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer locale="en" />
    </>
  );
}
