import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Volleyball, Trophy, Users } from "@/components/icons";
import type { ReactNode } from "react";

/**
 * Så funkar det / Event-typer — evergreen overview of the three main
 * activity categories on The Beach calendar.
 */

type EventType = {
  no: string;
  icon: ReactNode;
  title: string;
  body: string;
  note?: string;
  linkLabel: string;
  linkHref: string;
  external?: boolean;
};

const TYPES: EventType[] = [
  {
    no: "01",
    icon: <Users className="h-5 w-5" />,
    title: "Träningsgrupper",
    body: "Två säsonger per år: Sommarsäsong (måndagar & onsdagar, maj–början av juli, 7 pass) och Höstsäsong (söndagar, måndagar & onsdagar, sena augusti–december, 15 pass). Anmälan till höstens grupper öppnar 1 augusti kl 20:00 — efterfrågan är hög och platserna brukar fyllas snabbt.",
    note: "Frågor om träning: traning@thebeach.one",
    linkLabel: "Läs mer om träning →",
    linkHref: "/trana",
  },
  {
    no: "02",
    icon: <Trophy className="h-5 w-5" />,
    title: "Seriespel",
    body: "Sommarens tävlingsform: strukturerade matcher med garanterat spel varje omgång — Seriespel Sommar körs i 6 omgångar med start i maj. Under höst och vår går bantiden till kurser och träningsgrupper.",
    note: "\"Oavsett om det är din första turnering eller om du jagar rankingpoäng till de stora scenerna är vårt mål att du ska få en riktigt bra turneringsupplevelse hos oss.\"",
    linkLabel: "Se kalender →",
    linkHref: "https://kalendern på denna sida",
    external: true,
  },
  {
    no: "03",
    icon: <Volleyball className="h-5 w-5" />,
    title: "Turneringar",
    body: "The Beach arrangerar SBT 1-stjärniga turneringar (nybörjarvänliga rankingtävlingar), Mixed-turneringar och U19 för juniorer. Stjärnsystemet går från 1 till 4 — The Beach fokuserar på 1-stjärniga och Mixed. Hela turneringskalendern hittas på Profixio. Tävlingslicens krävs.",
    linkLabel: "Så börjar du tävla →",
    linkHref: "/trana",
  },
];

export default function EventTypes() {
  return (
    <section
      id="sa-funkar-det"
      className="bg-panel px-5 py-16 sm:px-8 lg:px-14 lg:py-28"
    >
      {/* Header */}
      <Reveal className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-14 lg:pb-14">
        <div>
          <p className="eyebrow mb-4">Så funkar det</p>
          <h2 className="font-display text-[clamp(2.25rem,10vw,3.75rem)] leading-[0.9] text-bone lg:text-[clamp(3rem,5.5vw,5rem)]">
            Tre sätt att
            <br />
            <span className="italic-accent">spela med</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-bone/45 sm:text-right">
          Oavsett om du vill träna regelbundet, tävla i serie eller delta i en
          turnering — det finns ett upplägg för dig.
        </p>
      </Reveal>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-3">
        {TYPES.map((t, i) => (
          <Reveal
            key={t.no}
            delay={i * 0.08}
            className="flex flex-col border border-line bg-base p-7 lg:p-9"
          >
            {/* Number + icon row */}
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-bone/35">
                {t.no}
              </span>
              <span className="text-lime/60">{t.icon}</span>
            </div>

            {/* Title */}
            <h3 className="mb-3 font-display text-2xl uppercase leading-[0.95] text-bone lg:text-3xl">
              {t.title}
            </h3>

            {/* Body */}
            <p className="mb-4 flex-1 text-[13px] leading-relaxed text-bone/50 lg:text-sm">
              {t.body}
            </p>

            {/* Optional note / quote */}
            {t.note && (
              <p className="mb-5 border-l-2 border-lime/40 pl-4 text-[12px] italic leading-snug text-bone/40">
                {t.note}
              </p>
            )}

            {/* CTA link */}
            {t.external ? (
              <a
                href={t.linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright"
              >
                {t.linkLabel}
              </a>
            ) : (
              <Link
                href={t.linkHref}
                className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-lime transition-colors hover:text-lime-bright"
              >
                {t.linkLabel}
              </Link>
            )}
          </Reveal>
        ))}
      </div>

      {/* Profixio external link note */}
      <Reveal delay={0.3}>
        <div className="mt-4 border border-white/10 bg-panel-2 p-5 lg:px-7">
          <p className="text-[13px] text-bone/40">
            Hela turneringskalendern på{" "}
            <a
              href="https://profixio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bone/70 underline underline-offset-2 hover:text-lime"
            >
              profixio.com
            </a>
            . Tävlingslicens krävs — bli medlem och begär licens via{" "}
            <Link href="/trana" className="text-bone/70 underline underline-offset-2 hover:text-lime">
              träningssidan
            </Link>
            .
          </p>
        </div>
      </Reveal>
    </section>
  );
}
