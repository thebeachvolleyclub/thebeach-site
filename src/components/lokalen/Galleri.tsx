"use client";

/**
 * Galleri — filtrerbart bildgalleri för /lokalen.
 * Två axlar: yta (kopplad till planlösningen) och eventtyp.
 * Filtren byggs av datat, så nya bilder räcker för att nya filter ska dyka upp.
 * Alt-texterna ägs av datat i src/lib/lokalen.ts; filteretiketterna kommer ur
 * ordboken så att /en/venue får engelska knappar.
 */

import { useMemo, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { BILDER, aktivaYtor, aktivaTyper, type YtaKey, type TypKey } from "@/lib/lokalen";
import type { Locale } from "@/lib/i18n";
import { lokalenDict } from "@/lib/i18n/lokalen";

export default function Galleri({ locale = "sv" }: { locale?: Locale } = {}) {
  const t = lokalenDict[locale].galleri;
  const ytaText = lokalenDict[locale].ytor;
  const typText = lokalenDict[locale].typer;
  const [yta, setYta] = useState<YtaKey | "alla">("alla");
  const [typ, setTyp] = useState<TypKey | "alla">("alla");
  const [oppen, setOppen] = useState<number | null>(null);

  const ytor = useMemo(() => aktivaYtor(), []);
  const typer = useMemo(() => aktivaTyper(), []);

  const bilder = useMemo(
    () =>
      BILDER.filter((b) => (yta === "alla" || b.yta.includes(yta)) && (typ === "alla" || b.typ.includes(typ))).sort(
        (a, b) => (a.prio ?? 9) - (b.prio ?? 9)
      ),
    [yta, typ]
  );

  const stang = useCallback(() => setOppen(null), []);
  const stega = useCallback(
    (steg: number) => setOppen((i) => (i === null ? null : (i + steg + bilder.length) % bilder.length)),
    [bilder.length]
  );

  useEffect(() => {
    if (oppen === null) return;
    const tangent = (e: KeyboardEvent) => {
      if (e.key === "Escape") stang();
      if (e.key === "ArrowRight") stega(1);
      if (e.key === "ArrowLeft") stega(-1);
    };
    window.addEventListener("keydown", tangent);
    return () => window.removeEventListener("keydown", tangent);
  }, [oppen, stang, stega]);

  const knapp = (aktiv: boolean) =>
    `rounded-full border px-4 py-2 text-sm transition ${
      aktiv ? "border-black bg-black text-white" : "border-black/15 bg-white/60 text-black/70 hover:border-black/40"
    }`;

  return (
    <section id="bilder" className="bg-sand px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/40">{t.eyebrow}</p>
        <h2 className="mb-8 font-display text-[clamp(2rem,7vw,3.25rem)] uppercase leading-[0.95] tracking-[-0.02em] text-black">
          {t.title}
        </h2>

        <div className="mb-3 flex flex-wrap gap-2">
          <button className={knapp(typ === "alla")} onClick={() => setTyp("alla")}>
            {t.allaTillfallen}
          </button>
          {typer.map((ty) => (
            <button key={ty.key} className={knapp(typ === ty.key)} onClick={() => setTyp(ty.key)}>
              {typText[ty.key]}
            </button>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button className={knapp(yta === "alla")} onClick={() => setYta("alla")}>
            {t.helaLokalen}
          </button>
          {ytor.map((y) => (
            <button key={y.key} className={knapp(yta === y.key)} onClick={() => setYta(y.key)} title={ytaText[y.key].beskrivning}>
              {ytaText[y.key].namn}
            </button>
          ))}
        </div>

        {bilder.length === 0 ? (
          <p className="py-12 text-center text-sm text-black/50">
            {t.tomt}
          </p>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {bilder.map((b, i) => (
              <button
                key={b.fil + i}
                onClick={() => setOppen(i)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-black/5"
                aria-label={b.alt}
              >
                <Image
                  src={b.fil}
                  alt={b.alt}
                  width={b.format === "staende" ? 900 : 1400}
                  height={b.format === "staende" ? 1200 : 933}
                  className="h-auto w-full transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {b.koncept ? (
                  <span className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
                    {t.konceptbild}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs text-black/40">
          {bilder.length} {bilder.length === 1 ? t.bildSingular : t.bildPlural}
        </p>
      </div>

      {oppen !== null && bilder[oppen] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={stang}
          role="dialog"
          aria-modal="true"
        >
          <button className="absolute right-5 top-5 text-3xl text-white/70 hover:text-white" onClick={stang} aria-label={t.stang}>
            ×
          </button>
          <button
            className="absolute left-4 text-4xl text-white/60 hover:text-white"
            onClick={(e) => { e.stopPropagation(); stega(-1); }}
            aria-label={t.foregaende}
          >
            ‹
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={bilder[oppen].fil}
              alt={bilder[oppen].alt}
              width={1600}
              height={1100}
              className="max-h-[80svh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-white/70">
              {bilder[oppen].alt}
              {bilder[oppen].koncept ? (
                <span className="mt-1 block text-xs text-white/45">
                  {t.konceptNot}
                </span>
              ) : null}
            </figcaption>
          </figure>
          <button
            className="absolute right-4 text-4xl text-white/60 hover:text-white"
            onClick={(e) => { e.stopPropagation(); stega(1); }}
            aria-label={t.nasta}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
