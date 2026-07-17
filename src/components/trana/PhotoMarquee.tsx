/**
 * PhotoMarquee — självrullande fotoremsa med folk som tränar och spelar.
 * Samma keyframe som brand-tickern (ticker-scroll), långsammare tempo.
 * Server component — ren CSS-animation, ingen JS.
 */

const PHOTOS = [
  { src: "/media/trana/trana-01.webp", alt: "Spelare baggrar i sanden på The Beach" },
  { src: "/media/trana/trana-10.webp", alt: "Två spelare skrattar efter träningen" },
  { src: "/media/trana/trana-02.webp", alt: "Två spelare i spel vid nätet" },
  { src: "/media/trana/trana-07.webp", alt: "Fullt med spel på inomhusbanorna" },
  { src: "/media/trana/trana-03.webp", alt: "Två spelare firar en vunnen boll" },
  { src: "/media/trana/trana-06.webp", alt: "Träningsgrupp med coach på banan" },
  { src: "/media/trana/trana-05.webp", alt: "Spelare smashar vid nätet" },
  { src: "/media/trana/trana-08.webp", alt: "Träningsgäng samlat efter passet" },
  { src: "/media/trana/trana-04.webp", alt: "Spel på utomhusbanorna" },
  { src: "/media/trana/trana-11.webp", alt: "Ungdomslag med coach efter turnering" },
  { src: "/media/trana/trana-09.webp", alt: "Blockduell vid nätet" },
  { src: "/media/trana/trana-12.webp", alt: "Träningsgrupp framför solnedgångsväggen" },
];

export default function PhotoMarquee() {
  const run = (key: string, hidden = false) => (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {PHOTOS.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${key}-${p.src}`}
          src={p.src}
          alt={hidden ? "" : p.alt}
          loading="lazy"
          className="mr-1 h-[240px] w-auto object-cover lg:mr-1.5 lg:h-[320px]"
        />
      ))}
    </div>
  );

  return (
    <section
      aria-label="Bilder från träningen"
      className="overflow-hidden bg-cream pb-16 lg:pb-28"
    >
      <div
        className="flex w-max animate-ticker motion-reduce:w-full motion-reduce:animate-none motion-reduce:overflow-x-auto"
        style={{ animationDuration: "70s" }}
      >
        {run("a")}
        {run("b", true)}
      </div>
    </section>
  );
}
