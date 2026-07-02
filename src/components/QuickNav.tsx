const ITEMS = [
  { n: "01", title: "Spela", href: "https://www.matchi.se/facilities/thebeach", ext: true },
  { n: "02", title: "Träna", href: "#training", ext: false },
  { n: "03", title: "Boka Event", href: "#event", ext: false },
  { n: "04", title: "Tävla", href: "#calendar", ext: false },
];

/** Cream four-up quick links, hover → lime. */
export default function QuickNav() {
  return (
    <div className="grid grid-cols-2 border-b border-black/10 bg-cream sm:grid-cols-4">
      {ITEMS.map((it) => (
        <a
          key={it.n}
          href={it.href}
          target={it.ext ? "_blank" : undefined}
          rel={it.ext ? "noopener noreferrer" : undefined}
          className="group flex cursor-pointer flex-col gap-1.5 border-b border-black/10 px-5 py-7 transition-colors duration-200 last:border-b-0 hover:bg-lime sm:border-b-0 sm:border-r sm:px-10 sm:py-11 sm:[&:nth-child(2n)]:border-r sm:last:border-r-0 [&:nth-last-child(-n+2)]:border-b-0"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/30">
            {it.n}
          </span>
          <span className="flex-1 font-display text-xl uppercase leading-none tracking-[-0.01em] text-black lg:text-2xl">
            {it.title}
          </span>
          <span className="mt-2.5 text-lg text-black/25 transition-transform duration-200 group-hover:translate-x-1 lg:mt-4 lg:text-xl">
            →
          </span>
        </a>
      ))}
    </div>
  );
}
