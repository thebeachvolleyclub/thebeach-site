import Reveal from "../Reveal";

/** MOCKUP — "Livet på The Beach" photo mosaic. */
const PHOTOS = [
  { src: "/media/basecamp.webp", alt: "Hallen på The Beach", lbl: "3 000 m² sand inomhus", big: true },
  { src: "/media/landslag-standing.webp", alt: "Landslaget på The Beach", lbl: "Landslagets hemmaplan", big: false },
  { src: "/media/story.webp", alt: "Spel på The Beach", lbl: "800 spelare i veckan", big: false },
  { src: "/media/wilson-extra.webp", alt: "Beachvolleyboll", lbl: "Sommar året runt", big: false },
  { src: "/media/hero-sunset.webp", alt: "Solnedgång över banorna", lbl: "Utebanorna i kvällssol", big: false },
];

export default function GalleryMosaic() {
  return (
    <section className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-28">
      <Reveal>
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          Livet på The Beach
        </span>
        <h2 className="mb-10 font-display text-[clamp(2.25rem,10vw,3.75rem)] uppercase leading-[0.9] tracking-[-0.02em] text-white lg:mb-16 lg:text-[clamp(3rem,5.5vw,5rem)]">
          Sommar.
          <br />
          Året runt.
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-0.5 lg:grid-cols-4">
        {PHOTOS.map((p, i) => (
          <Reveal
            key={p.src}
            delay={i * 0.05}
            className={p.big ? "col-span-2 row-span-2" : "col-span-1"}
          >
            <figure className="group relative h-full min-h-[160px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${p.big ? "aspect-square lg:aspect-auto" : "aspect-square"}`}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8 text-[11px] font-bold uppercase tracking-[0.1em] text-white/90">
                {p.lbl}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-[13px] text-white/40">
        Följ oss på{" "}
        <a
          href="https://www.instagram.com/thebeach_se/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-lime underline-offset-2 hover:underline"
        >
          @thebeach_se
        </a>{" "}
        för mer från sanden.
      </p>
    </section>
  );
}
