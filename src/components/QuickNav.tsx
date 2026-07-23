import type { Locale } from "@/lib/i18n";
import { homeDict } from "@/lib/i18n/home";

/** Photo quick-nav med Event & konferens som fjärde väg in.
 *  Texter/länkar ur startsidans ordbok — pos = object-position så att
 *  ansikten/huvuden alltid är med. */
export default function QuickNav({ locale = "sv" }: { locale?: Locale }) {
  const items = homeDict[locale].quicknav;
  return (
    <div className="grid grid-cols-2 gap-0.5 bg-black sm:grid-cols-4">
      {items.map((it) => (
        <a
          key={it.n}
          href={it.href}
          className="group relative flex h-44 cursor-pointer flex-col justify-between overflow-hidden p-5 sm:h-56 lg:h-72 lg:p-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={it.img}
            alt={it.alt}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${it.pos}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 transition-colors duration-300 group-hover:from-black/70" />
          <span className="relative text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
            {it.n}
          </span>
          <span className="relative flex items-end justify-between gap-2">
            <span className="font-display text-xl uppercase leading-none tracking-[-0.01em] text-white lg:text-3xl">
              {it.title}
            </span>
            <span className="text-lg text-lime transition-transform duration-200 group-hover:translate-x-1 lg:text-xl">
              →
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
