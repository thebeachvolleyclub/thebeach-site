/**
 * Hjältebild per kursnivå.
 *
 * Kurserna i plattformen har inget bildfält, så kopplingen görs här på nivån.
 * Nya kurser får därmed rätt bild automatiskt utan att någon lägger in något.
 *
 * Valet är medvetet olika för de två produkterna. Grundkursens största hinder
 * är rädslan för att vara sämst i rummet — därför skratt och gemenskap, inte
 * teknik. Fortsättningen säljer utveckling och intensitet, och tål en duell.
 */
type Hero = { src: string; alt: { sv: string; en: string } };

const GRUND: Hero = {
  src: "/media/trana/trana-10.webp",
  alt: {
    sv: "Två spelare skrattar tillsammans efter ett träningspass på The Beach",
    en: "Two players laughing together after a session at The Beach",
  },
};

const FORTSATTNING: Hero = {
  src: "/media/trana/trana-05.webp",
  alt: {
    sv: "Spelare avslutar en boll vid nätet på inomhusbanorna",
    en: "A player finishing a rally at the net on the indoor courts",
  },
};

export function courseHero(level: string | null | undefined): Hero {
  const key = (level ?? "").toLowerCase();
  if (key.startsWith("forts") || key.startsWith("inter")) return FORTSATTNING;
  return GRUND;
}
