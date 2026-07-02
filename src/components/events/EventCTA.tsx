import Reveal from "@/components/Reveal";
import EventRequestFormClient from "./EventRequestFormClient";

export default function EventCTA() {
  return (
    <section
      id="forfragan"
      className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-2xl">
        <Reveal>
          {/* eyebrow override: .eyebrow hard-codes lime which fails contrast on lime bg */}
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">
            Osäker på vad som passar?
          </p>
          <h2 className="mb-6 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-black lg:text-[clamp(3rem,5.5vw,5rem)]">
            Skicka en
            <br />
            <span className="italic-accent !text-black/70">förfrågan</span>
          </h2>
          <p className="mb-9 max-w-md text-sm leading-relaxed text-black/60">
            Berätta vilka ni är, ungefär hur många och om ni vill köra kväll
            eller dagtid — så hittar vi rätt upplägg och håller datumet åt er.
            Vi hör av oss inom 24 timmar.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <EventRequestFormClient />
        </Reveal>
      </div>
    </section>
  );
}
