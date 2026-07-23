"use client";

/**
 * EventPhotoMarquee — fotoremsa på eventsidan med rotation.
 * Regler (Davids beslut 2026-07-17):
 *  - caia3_bianca är ALLTID bild nummer 2.
 *  - Antingen caia eller caia_4 är ALLTID med.
 *  - Övriga bilder varieras slumpmässigt per sidladdning (blandas vid mount,
 *    innan remsan hunnit synas — SSR-ordningen är deterministisk så hydration
 *    aldrig krockar).
 * Interaktion: paus vid hover, dra för att styra riktning (samma som /trana).
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react";
import type { Locale } from "@/lib/i18n";
import { eventsDict } from "@/lib/i18n/events";

const DIR = "/media/event-snurra/";
const BIANCA = "caia3_bianca.webp";
const PAIR = ["caia.webp", "caia_4.webp"]; // exakt en av dessa är alltid med
const POOL = [
  "caia2.webp",
  "464906822_18461757397011036_773880143378.webp",
  "464975740_18461757421011036_372323269673.webp",
  "465010864_18461757439011036_396870421886.webp",
  "480986290_18483194650011036_617624271829.webp",
  "481259826_18483703744011036_187197535172.webp",
  "481807707_18483703753011036_842008665023.webp",
  "505470545_18505253833011036_905929504629.webp",
  "508687863_18506196583011036_836687121168.webp",
  "508715357_18506196637011036_547678628729.webp",
  "553375831_18523924249011036_364245759346.webp",
  "589259365_18539522536011036_842946002145.webp",
  "623369149_18564775819011864_828713781087.webp",
  "631472259_18553388026011036_178426126433.webp",
  "632138755_18553388035011036_470621099431.webp",
  "alfa_laval_192.webp",
  "alfa_laval_245.webp",
  "dji_20251128_210558_170.webp",
  "dji_20251128_215603_862.webp",
  "pxl_20251128_203603728mp.webp",
  "pxl_20260124_194423008mp.webp",
  "avanza-logga_dji_20251128_194332_727.webp",
];
const VISIBLE_FROM_POOL = 9; // totalt 11 bilder i remsan per laddning

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function compose(random: boolean): string[] {
  const pair = random ? PAIR[Math.floor(Math.random() * PAIR.length)] : PAIR[0];
  const pool = (random ? shuffle(POOL) : POOL).slice(0, VISIBLE_FROM_POOL);
  // bianca alltid position 2; paret slumpas in bland resten
  const rest = random
    ? shuffle([pair, ...pool.slice(1)])
    : [pair, ...pool.slice(1)];
  return [pool[0], BIANCA, ...rest];
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const BASE_VELOCITY = 1.1;

function Track({ photos, alt }: { photos: string[]; alt: string }) {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const trackRef = useRef<HTMLDivElement>(null);
  const direction = useRef(-1);
  const hovered = useRef(false);
  const dragging = useRef(false);
  const lastX = useRef(0);

  useAnimationFrame((_, delta) => {
    if (hovered.current || dragging.current) return;
    baseX.set(baseX.get() + direction.current * BASE_VELOCITY * (delta / 1000));
  });

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !trackRef.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    baseX.set(baseX.get() + (dx / trackRef.current.scrollWidth) * 100);
    if (dx > 1) direction.current = 1;
    else if (dx < -1) direction.current = -1;
  };
  const endDrag = () => { dragging.current = false; };

  const run = (key: string, hidden = false) => (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {photos.map((p, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${key}-${p}-${i}`}
          src={DIR + p}
          alt={hidden ? "" : alt}
          loading="lazy"
          draggable={false}
          className="mr-1 h-[240px] w-auto select-none object-cover lg:mr-1.5 lg:h-[320px]"
        />
      ))}
    </div>
  );

  return (
    <motion.div
      ref={trackRef}
      className="flex w-max cursor-grab touch-pan-y active:cursor-grabbing"
      style={{ x }}
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => { hovered.current = false; endDrag(); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {run("a")}
      {run("b", true)}
    </motion.div>
  );
}

export default function EventPhotoMarquee({ locale }: { locale: Locale }) {
  const t = eventsDict[locale];
  const reduce = useReducedMotion();
  const [photos, setPhotos] = useState<string[]>(() => compose(false));
  useEffect(() => { setPhotos(compose(true)); }, []);

  return (
    <section
      aria-label={t.marquee.ariaLabel}
      className="overflow-hidden bg-black py-10 lg:py-14"
    >
      {reduce ? (
        <div className="no-scrollbar flex overflow-x-auto">
          {photos.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p} src={DIR + p} alt={t.marquee.alt} loading="lazy"
              className="mr-1 h-[240px] w-auto object-cover lg:h-[320px]" />
          ))}
        </div>
      ) : (
        <Track photos={photos} alt={t.marquee.alt} />
      )}
    </section>
  );
}
