import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { og } from "@/lib/seo";
import kampanjData from "@/data/coachkampanj.json";

/**
 * Coachkampanjen — intern värvningstävling bland coacherna, 7–21 aug 2026.
 *
 * Sidan är AVSIKTLIGT oindexerad (robots: noindex) och ligger varken i
 * sitemap.ts eller i någon meny. Den ska vara nåbar för den som har länken.
 *
 * Datan i src/data/coachkampanj.json fylls på för hand av en människa under
 * kampanjen. Ingen fetch — JSON:en importeras rakt in i serverkomponenten.
 * `revalidate` gör att nedräkningen räknas om löpande i stället för att
 * frysas vid build.
 */

export const revalidate = 3600;

type Deltagare = { namn: string; kod: string; antal: number };
type Kampanj = {
  uppdaterad: string;
  startar: string;
  slutar: string;
  troskel: number;
  deltagare: Deltagare[];
};

const kampanj = kampanjData as Kampanj;

const TITLE = "Coachkampanjen";
const DESC =
  "Ställningen i coachernas värvningstävling. Dela din kampanjkod, ge halva priset på grundkurs i beachvolley — och kvala in till goodiebagen.";

export const metadata: Metadata = {
  title: `${TITLE} — ställningen | The Beach`,
  description: DESC,
  robots: { index: false, follow: false },
  openGraph: og("/coachkampanjen", TITLE, DESC),
};

const TZ = "Europe/Stockholm";
const MAX_PLATSER = 20;

/** "YYYY-MM-DD" → millisekunder vid midnatt UTC. Ger heldygnsdiff utan DST-brus. */
function dagNummer(datum: string): number {
  const [y, m, d] = datum.split("-").map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

/** Dagens datum i Stockholm som "YYYY-MM-DD" — serverns egen tidszon spelar ingen roll. */
function idagIStockholm(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: TZ });
}

function dagarMellan(från: string, till: string): number {
  return Math.round((dagNummer(till) - dagNummer(från)) / 86_400_000);
}

function formateraUppdaterad(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const datum = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TZ,
    day: "numeric",
    month: "long",
  }).format(d);
  const tid = new Intl.DateTimeFormat("sv-SE", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
  return `${datum} kl. ${tid}`;
}

/** Raden som renderas — medvetet UTAN `kod`, koderna ska aldrig nå sidan. */
type Rad = { namn: string; antal: number; placering: number };

/** Sorterar fallande på antal, hoppar över nollor och låter lika antal dela placering. */
function beräknaStällning(deltagare: Deltagare[]): Rad[] {
  const aktiva = deltagare
    .filter((d) => d.antal > 0)
    .sort((a, b) => b.antal - a.antal || a.namn.localeCompare(b.namn, "sv-SE"));

  let placering = 0;
  let föregåendeAntal: number | null = null;

  return aktiva.map((d, i) => {
    if (d.antal !== föregåendeAntal) {
      placering = i + 1;
      föregåendeAntal = d.antal;
    }
    return { namn: d.namn, antal: d.antal, placering };
  });
}

export default function CoachkampanjenPage() {
  const { startar, slutar, troskel, uppdaterad, deltagare } = kampanj;

  const idag = idagIStockholm();
  const dagarKvar = dagarMellan(idag, slutar);
  const dagarTillStart = dagarMellan(idag, startar);
  const avslutad = dagarKvar < 0;
  const inteStartad = dagarTillStart > 0;

  const nedräkning = avslutad
    ? "Kampanjen är avslutad"
    : inteStartad
      ? dagarTillStart === 1
        ? "Startar imorgon"
        : `Startar om ${dagarTillStart} dagar`
      : dagarKvar === 0
        ? "Sista dagen!"
        : dagarKvar === 1
          ? "1 dag kvar"
          : `${dagarKvar} dagar kvar`;

  const hela = beräknaStällning(deltagare);
  const ställning = hela.slice(0, MAX_PLATSER);
  const övriga = hela.length - ställning.length;
  const flest = ställning[0]?.antal ?? 0;
  const antalKvalade = hela.filter((d) => d.antal >= troskel).length;
  const totaltVärvade = hela.reduce((s, d) => s + d.antal, 0);
  const uppdateradText = formateraUppdaterad(uppdaterad);

  const heroCta = (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <span
        className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] ${
          avslutad ? "bg-white/10 text-bone" : "bg-lime text-black"
        }`}
      >
        {nedräkning}
      </span>
      <span className="text-[11px] uppercase tracking-[0.14em] text-bone/45">
        7–21 augusti 2026
      </span>
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageHero
          eyebrow="Internt — coacherna"
          title={
            <>
              Vem värvar <span className="italic-accent">flest</span>?
            </>
          }
          intro="Två veckor. En personlig kampanjkod per coach som ger halva priset på grundkurs i beachvolley. Den som får in flest nya spelare vinner — och alla som kvalar in får en goodiebag."
          cta={heroCta}
        />

        {/* Ställningen */}
        <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-8">
              <p className="eyebrow mb-4">Ställningen</p>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-bone">
                {avslutad ? "Så slutade det" : "Topplistan just nu"}
              </h2>
              {ställning.length > 0 ? (
                <p className="mt-4 text-[15px] leading-relaxed text-bone/55">
                  {totaltVärvade} värvade {avslutad ? "totalt" : "hittills"} av{" "}
                  {hela.length} {hela.length === 1 ? "coach" : "coacher"}.{" "}
                  {antalKvalade > 0 ? (
                    <span className="text-lime">
                      {antalKvalade === 1 ? "En" : antalKvalade}{" "}
                      {avslutad
                        ? "kvalade in till goodiebagen."
                        : "har redan kvalat in till goodiebagen."}
                    </span>
                  ) : avslutad ? (
                    <>Ingen nådde {troskel}.</>
                  ) : (
                    <>Ingen har nått {troskel} än — goodiebagen står och väntar.</>
                  )}
                </p>
              ) : null}
            </Reveal>

            {ställning.length === 0 ? (
              /* Tomt läge */
              <Reveal>
                <div className="border border-lime/30 bg-panel px-6 py-14 text-center sm:px-10 sm:py-16">
                  <p className="font-display text-[clamp(1.5rem,6vw,2.25rem)] leading-[0.95] text-lime">
                    Första platsen står oöppnad
                  </p>
                  <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-bone/60">
                    Ingen har värvat någon än — vilket betyder att listan är helt öppen.
                    Den första koden som används sätter dig direkt i topp, och därifrån är
                    det bara att bygga vidare. Dela din kod, så syns du här nästa gång
                    listan uppdateras.
                  </p>
                </div>
              </Reveal>
            ) : (
              <ul className="space-y-2">
                {ställning.map((rad, i) => {
                  const kvalad = rad.antal >= troskel;
                  const leder = rad.placering === 1;
                  const kvarTillKval = troskel - rad.antal;
                  const bredd = flest > 0 ? Math.max(8, (rad.antal / flest) * 100) : 0;

                  return (
                    <Reveal key={`${i}-${rad.namn}`} delay={Math.min(i * 0.04, 0.32)}>
                      <li
                        className={`flex items-center gap-4 border px-4 py-4 sm:gap-5 sm:px-6 ${
                          leder
                            ? "border-lime bg-lime"
                            : kvalad
                              ? "border-lime/40 bg-panel-2"
                              : "border-line bg-panel"
                        }`}
                      >
                        {/* Placering */}
                        <span
                          className={`w-9 shrink-0 text-center font-display text-2xl leading-none sm:w-12 sm:text-3xl ${
                            leder ? "text-black" : kvalad ? "text-lime" : "text-bone/45"
                          }`}
                        >
                          {rad.placering}
                        </span>

                        {/* Namn + status */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate font-display text-lg leading-tight sm:text-xl ${
                              leder ? "text-black" : "text-bone"
                            }`}
                          >
                            {rad.namn}
                          </p>

                          <div
                            className={`mt-2 h-[3px] w-full overflow-hidden ${
                              leder ? "bg-black/15" : "bg-white/10"
                            }`}
                            aria-hidden="true"
                          >
                            <div
                              className={`h-full ${leder ? "bg-black" : kvalad ? "bg-lime" : "bg-bone/35"}`}
                              style={{ width: `${bredd}%` }}
                            />
                          </div>

                          <p
                            className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                              leder
                                ? "text-black/70"
                                : kvalad
                                  ? "text-lime"
                                  : "text-bone/45"
                            }`}
                          >
                            {leder && kvalad ? (
                              <>Leder — goodiebag med något extra</>
                            ) : kvalad ? (
                              <>Goodiebag säkrad</>
                            ) : leder ? (
                              <>Leder — {kvarTillKval} kvar till goodiebagen</>
                            ) : (
                              <>{kvarTillKval} kvar till goodiebagen</>
                            )}
                          </p>
                        </div>

                        {/* Antal */}
                        <div className="shrink-0 text-right">
                          <span
                            className={`font-display text-3xl leading-none sm:text-4xl ${
                              leder ? "text-black" : kvalad ? "text-lime" : "text-bone"
                            }`}
                          >
                            {rad.antal}
                          </span>
                          <span
                            className={`block text-[10px] uppercase tracking-[0.14em] ${
                              leder ? "text-black/60" : "text-bone/40"
                            }`}
                          >
                            {rad.antal === 1 ? "värvad" : "värvade"}
                          </span>
                        </div>
                      </li>
                    </Reveal>
                  );
                })}
              </ul>
            )}

            {övriga > 0 ? (
              <Reveal delay={0.05}>
                <p className="mt-5 text-[13px] leading-relaxed text-bone/45">
                  Listan visar topp {MAX_PLATSER}. {övriga}{" "}
                  {övriga === 1 ? "coach till har" : "coacher till har"} värvat minst en —
                  fortsätt så syns du här.
                </p>
              </Reveal>
            ) : null}

            {/* Uppdaterad-stämpel */}
            <Reveal delay={0.08}>
              <div className="mt-8 border-t border-line pt-5">
                <p className="text-[13px] leading-relaxed text-bone/50">
                  {uppdateradText ? (
                    <>
                      <span className="font-semibold text-bone/75">
                        Uppdaterad {uppdateradText}
                      </span>{" "}
                      —{" "}
                    </>
                  ) : null}
                  listan räknas ihop för hand och uppdateras några gånger i veckan, inte i
                  realtid. Har du värvat någon som ännu inte syns här dyker den upp vid
                  nästa uppdatering.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Så funkar det */}
        <section className="bg-cream px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <Reveal className="mb-8">
              <p className="eyebrow eyebrow-ink mb-4">Så funkar det</p>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                Tre steg, två veckor
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                {
                  n: "01",
                  h: "Dela din kod",
                  p: "Varje coach har en egen personlig kampanjkod. Skicka den till kompisar, kollegor, syskon — alla som borde testa beachvolley.",
                },
                {
                  n: "02",
                  h: "De får halva priset",
                  p: "Koden ger 50 % rabatt på grundkurs i beachvolley. Ett rätt bra argument att äntligen boka in sig.",
                },
                {
                  n: "03",
                  h: "Du klättrar på listan",
                  p: "Varje anmälan med din kod räknas. Ställningen ovan visar vem som ligger bäst till.",
                },
              ].map((steg, i) => (
                <Reveal key={steg.n} delay={i * 0.06}>
                  <div className="h-full border-t-2 border-[#639922] pt-4">
                    <p className="font-display text-2xl leading-none text-[#639922]">
                      {steg.n}
                    </p>
                    <h3 className="mt-3 font-display text-xl leading-tight text-black">
                      {steg.h}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-black/70">
                      {steg.p}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Goodiebagen */}
        <section className="bg-lime px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
          <div className="mx-auto flex max-w-3xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <Reveal>
              <h2 className="font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-[0.95] text-black">
                Alla som kvalar in får en goodiebag
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-black/70">
                Värvar du {troskel} eller fler får du en personlig goodiebag från oss. Den
                som värvar allra flest får dessutom något extra i sin. Alla som nått{" "}
                {troskel} är markerade i listan ovan — resten ser hur många som fattas.
              </p>
            </Reveal>
            <Reveal delay={0.06} className="shrink-0">
              <div className="inline-flex flex-col items-start border-2 border-black px-6 py-4">
                <span className="font-display text-4xl leading-none text-black">
                  {troskel}+
                </span>
                <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-black/70">
                  = goodiebag
                </span>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
