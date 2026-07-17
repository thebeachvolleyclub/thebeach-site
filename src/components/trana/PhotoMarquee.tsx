"use client";

/**
 * PhotoMarquee — självrullande fotoremsa med folk som tränar och spelar.
 * Interaktiv: paus vid hover, dra för att styra — riktningen följer draget.
 * Samma wrap-teknik som brand-tickern (Marquee.tsx).
 */

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
} from "motion/react";

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

// keep a value within [min, max)
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

const BASE_VELOCITY = 1.1; // % av spårbredden per sekund

function Track() {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  const trackRef = useRef<HTMLDivElement>(null);
  const direction = useRef(-1); // -1 = vänster (default), 1 = höger
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
    const pct = (dx / trackRef.current.scrollWidth) * 100;
    baseX.set(baseX.get() + pct);
    // riktningen följer senaste draget
    if (dx > 1) direction.current = 1;
    else if (dx < -1) direction.current = -1;
  };

  const endDrag = () => {
    dragging.current = false;
  };

  const run = (key: string, hidden = false) => (
    <div className="flex shrink-0" aria-hidden={hidden || undefined}>
      {PHOTOS.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${key}-${p.src}`}
          src={p.src}
          alt={hidden ? "" : p.alt}
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
      onMouseLeave={() => {
        hovered.current = false;
        endDrag();
      }}
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

export default function PhotoMarquee() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Bilder från träningen"
      className="overflow-hidden bg-base py-10 lg:py-14"
    >
      {reduce ? (
        <div className="no-scrollbar flex overflow-x-auto">
          {PHOTOS.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.src}
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="mr-1 h-[240px] w-auto object-cover lg:h-[320px]"
            />
          ))}
        </div>
      ) : (
        <Track />
      )}
    </section>
  );
}
