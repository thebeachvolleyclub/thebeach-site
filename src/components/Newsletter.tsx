import Reveal from "./Reveal";

const BREVO_FORM =
  "https://407ccf77.sibforms.com/serve/MUIFAFEOMibvaZ5ur4jcCa6kQeEtwIe3YnMA62Sgo4YlTJwJ28HlgGz4x16Tlb2YRcy1yEqhvpeM0zrIWRJ5HFOsJeiWoMOFK3oeQSbZl5cGH9xkcyKUq95BKScNgnPwAjLBw9uSiX71UOkhHF-1bQf34QMcicuB7yhbYg3GZ8D1-f35qwN8nDayK8Si5Tr2uFAy_d-w3hnLMqzJ";

/**
 * Nyhetsbrevssektion (Brevo). Träningsgrupperna säljer slut på timmar —
 * listan är kanalen för att vara först. Dubbel opt-in är på i Brevo.
 */
export default function Newsletter() {
  return (
    <section className="bg-lime px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <div className="mx-auto flex max-w-[1500px] flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <Reveal>
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/50">
            Nyhetsbrev
          </p>
          <h2 className="mb-4 font-display text-[clamp(2rem,9vw,3.5rem)] leading-[0.9] text-black">
            Var först att veta
          </h2>
          <p className="max-w-xl text-[15px] leading-relaxed text-black/60">
            Träningsgrupperna släpps en gång per säsong och går fort. Med
            nyhetsbrevet får du släpp, event och sista-minuten-tider direkt i
            inkorgen — före alla andra.
          </p>
        </Reveal>
        <Reveal delay={0.06} className="shrink-0">
          <a
            href={BREVO_FORM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 bg-black px-10 py-5 text-sm font-bold uppercase tracking-[0.08em] text-lime transition-colors hover:bg-black/85"
          >
            Håll mig uppdaterad <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
