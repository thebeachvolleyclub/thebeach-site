import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import EventFormEn from "@/components/en/EventFormEn";

export const metadata: Metadata = {
  title: "Corporate events & parties — The Beach Stockholm",
  description:
    "Book a beach event in Stockholm: activity, food and drinks in one package. Three concepts from SEK 745/person, groups of 10–900. Conference add-on available.",
  alternates: { canonical: "/en/events", languages: { sv: "/events", en: "/en/events" } },
};

const PACKAGES = [
  {
    tag: "Simple & social", name: "Las Palmas", price: "745",
    desc: "After work, kickoff or a social get-together. The easy choice that always works — whether you're 10 or 50.",
    features: ["1.5 h beach volleyball tournament with instructor", "Tapas — cheese & charcuterie", "1 drink (beer, wine or non-alcoholic)", "Prize for King & Queen of The Beach", "Recommended: 10–50 people"],
  },
  {
    tag: "Most booked", name: "Algarve", price: "945", featured: true,
    desc: "Our most popular package: tournament, dinner and the kind of evening people talk about at the office.",
    features: ["1.5 h tournament with instructor", "Two-course dinner in the lounge", "2 drinks included", "Prize ceremony & music", "10–250 guests"],
  },
  {
    tag: "The full evening", name: "Miami", price: "1 195",
    desc: "The premium experience — for when you want to reward the team properly.",
    features: ["1.5 h tournament with instructor", "Three-course dinner", "Welcome drink + 2 drinks", "Dedicated event host", "15–250 guests"],
  },
];

export default function EnEvents() {
  return (
    <>
      <Navbar locale="en" />
      <main className="flex-1">
        <PageHero
          eyebrow="Events & conferences"
          title={<>An event that<br /><span className="italic-accent">stands out</span></>}
          intro="Sand between your toes in the middle of Stockholm — all year round. Ready-made packages where activity, food and drinks are all included. English-speaking hosts available."
          cta={
            <a
              href="#request"
              className="inline-flex cursor-pointer items-center gap-2 bg-lime px-9 py-4 text-xs font-bold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:bg-lime-bright"
            >
              Send a request <span aria-hidden="true">→</span>
            </a>
          }
        />

        {/* Packages */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
          <Reveal className="mb-10 lg:mb-14">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
              Three concepts
            </p>
            <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
              Pick your beach
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-black/50">
              Prices per person, excluding VAT. Weekday daytime? 10% off.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.06} className={`flex flex-col p-7 lg:p-10 ${p.featured ? "bg-lime" : "border border-black/10 bg-white"}`}>
                <span className={`mb-4 self-start px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${p.featured ? "bg-black text-lime" : "bg-black/[0.07] text-black/45"}`}>
                  {p.tag}
                </span>
                <h3 className="mb-1 font-display text-4xl uppercase leading-none text-black">{p.name}</h3>
                <div className="mb-4 text-[13px] font-semibold text-black/45">
                  from <strong className="font-display text-2xl text-black">SEK {p.price}</strong> /person
                </div>
                <p className="mb-5 text-sm leading-relaxed text-black/55">{p.desc}</p>
                <ul className="mb-6 flex-1 border-t border-black/10">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 border-b border-black/10 py-2 text-[13px] leading-snug text-black/60">
                      <span className="shrink-0 pt-0.5 opacity-40" aria-hidden="true">↗</span>{f}
                    </li>
                  ))}
                </ul>
                <a href="#request" className="text-xs font-bold uppercase tracking-[0.1em] text-black">
                  Send request →
                </a>
              </Reveal>
            ))}
          </div>

          {/* Conference add-on */}
          <Reveal delay={0.1} className="mt-0.5 flex flex-col items-start gap-4 bg-mint p-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:p-11">
            <div>
              <h3 className="mb-1.5 font-display text-[22px] uppercase text-black lg:text-[28px]">
                + Conference in the sand
              </h3>
              <p className="max-w-xl text-sm leading-snug text-black/50">
                Add up to 3 h of conference with projector, screen and lounge
                seating. Works with every package.
              </p>
            </div>
            <div className="shrink-0 font-display text-[28px] text-black lg:text-[32px]">
              +SEK 395 <span className="font-body text-[13px] font-normal text-black/40">/person</span>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="mt-10 border-t border-black/10 pt-8">
            <p className="max-w-2xl text-sm leading-relaxed text-black/40">
              Need something beyond the packages? We host product launches,
              weddings and large-scale events for up to 900 guests — always
              tailor-made. Tell us what you have in mind below.
            </p>
          </Reveal>
        </section>

        <EventFormEn />
      </main>
      <Footer locale="en" />
    </>
  );
}
