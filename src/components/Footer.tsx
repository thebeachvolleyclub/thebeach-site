import Logo from "./Logo";

const COLS = [
  {
    title: "Spela",
    links: ["Boka bana", "Hitta partner", "After Beach", "Turneringar", "Kalender"],
  },
  {
    title: "Event",
    links: ["Las Palmas", "Algarve", "Miami", "Konferens", "Skräddarsytt", "Julbord"],
  },
  {
    title: "Mer",
    links: ["Träning", "Vår historia", "Föreningen", "BeachTravels", "Kontakt"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-black px-5 pb-10 pt-14 text-white sm:px-8 lg:px-14 lg:pb-10 lg:pt-24">
      <div className="grid grid-cols-2 gap-10 border-b border-white/[0.06] pb-12 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-16 lg:pb-20">
        <div className="col-span-2 lg:col-span-1">
          <Logo variant="green" className="h-7 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-[1.7] text-white/35">
            Beachvolleybollens hem i Stockholm. Träningsbas för det svenska
            landslaget och ett community för alla som älskar sporten.
          </p>
          <p className="mt-4 text-[13px] leading-[1.65] text-white/25">
            Novavägen 35
            <br />
            141 44 Huddinge
            <br />
            <br />
            boka@thebeach.se
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
              {col.title}
            </h4>
            <ul>
              {col.links.map((l) => (
                <li key={l} className="mb-2.5">
                  <a
                    href="#"
                    className="cursor-pointer text-sm text-white/50 transition-colors hover:text-lime"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start gap-4 text-xs text-white/20 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <span>© {new Date().getFullYear()} The Beach · Beachhallen Tropical AB · 556699-2839</span>
        <div className="flex gap-5">
          {["Instagram", "LinkedIn", "Facebook"].map((s) => (
            <a
              key={s}
              href="#"
              className="cursor-pointer text-xs font-semibold uppercase tracking-[0.08em] text-white/30 transition-colors hover:text-lime"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
