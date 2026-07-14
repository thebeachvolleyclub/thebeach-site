import ParallaxImage from "../ParallaxImage";

/** MOCKUP — full-bleed parallax photo break between sections. */
export default function PhotoBreak({
  src,
  alt,
  caption,
  kicker,
}: {
  src: string;
  alt: string;
  caption?: string;
  kicker?: string;
}) {
  return (
    <section className="relative isolate flex h-[45vh] min-h-[320px] items-end overflow-hidden lg:h-[60vh]">
      <ParallaxImage src={src} alt={alt} className="object-[50%_30%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      {(caption || kicker) && (
        <div className="relative px-5 pb-8 sm:px-8 lg:px-14 lg:pb-12">
          {kicker && (
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-lime">
              {kicker}
            </span>
          )}
          {caption && (
            <p className="max-w-xl font-display text-2xl uppercase leading-[0.95] tracking-[-0.01em] text-white lg:text-4xl">
              {caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
