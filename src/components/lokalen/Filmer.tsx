"use client";

/**
 * Filmer — klippen från lokalen. Poster laddas som bild; videon hämtas först
 * när besökaren klickar, så sidan förblir lätt även med många klipp.
 */

import { useState } from "react";
import Image from "next/image";
import { FILMER } from "@/lib/lokalen";

export default function Filmer() {
  const [spelar, setSpelar] = useState<string | null>(null);

  if (FILMER.length === 0) return null;

  return (
    <section id="film" className="bg-black px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/40">Film</p>
        <h2 className="mb-4 font-display text-[clamp(2rem,7vw,3.25rem)] uppercase leading-[0.95] tracking-[-0.02em] text-white">
          Lokalen i rörelse
        </h2>
        <p className="mb-10 max-w-2xl text-sm leading-relaxed text-white/55">
          Stillbilder visar hur det ser ut. Film visar hur det känns — ljudnivån, ljuset,
          hur folk rör sig genom huset.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FILMER.map((f) => {
            const aktiv = spelar === f.fil;
            return (
              <figure key={f.fil} className="overflow-hidden rounded-2xl bg-white/5">
                <div className={`relative ${f.format === "staende" ? "aspect-[9/16]" : "aspect-video"}`}>
                  {aktiv ? (
                    <video
                      src={f.fil}
                      poster={f.poster}
                      controls
                      autoPlay
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <button
                      onClick={() => setSpelar(f.fil)}
                      className="group absolute inset-0 h-full w-full"
                      aria-label={`Spela upp: ${f.titel}`}
                    >
                      <Image
                        src={f.poster}
                        alt={f.titel}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/10" />
                      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-lime text-black shadow-lg transition group-hover:scale-110">
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor" aria-hidden="true">
                          <path d="M0 0v20l18-10L0 0z" />
                        </svg>
                      </span>
                    </button>
                  )}
                </div>
                <figcaption className="px-4 py-3 text-sm text-white/70">{f.titel}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
