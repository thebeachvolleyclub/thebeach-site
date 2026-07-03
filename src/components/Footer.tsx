import Link from "next/link";
import Logo from "./Logo";

type FLink = { label: string; href: string; ext?: boolean };

const COLS: { title: string; links: FLink[] }[] = [
  {
    title: "Spela",
    links: [
      { label: "Boka bana", href: "/boka" },
      { label: "Träna", href: "/trana" },
      { label: "Kalender", href: "/kalender" },
      { label: "Föreningen", href: "/foreningen" },
      { label: "Skolor", href: "/skola" },
    ],
  },
  {
    title: "Event",
    links: [
      { label: "Boka event", href: "/events" },
      { label: "Konferens", href: "/events" },
      { label: "Barnkalas", href: "/barnkalas" },
      { label: "Julbord", href: "/julbord" },
      { label: "Skräddarsytt", href: "/events#forfragan" },
    ],
  },
  {
    title: "Mer",
    links: [
      { label: "Om oss", href: "/om-oss" },
      { label: "Kontakt", href: "/om-oss#kontakt" },
      { label: "Presentkort", href: "/presentkort" },
      { label: "FAQ", href: "/faq" },
      { label: "BeachTravels", href: "/beachtravels" },
      { label: "Nyhetsbrev", href: "https://407ccf77.sibforms.com/serve/MUIFAFEOMibvaZ5ur4jcCa6kQeEtwIe3YnMA62Sgo4YlTJwJ28HlgGz4x16Tlb2YRcy1yEqhvpeM0zrIWRJ5HFOsJeiWoMOFK3oeQSbZl5cGH9xkcyKUq95BKScNgnPwAjLBw9uSiX71UOkhHF-1bQf34QMcicuB7yhbYg3GZ8D1-f35qwN8nDayK8Si5Tr2uFAy_d-w3hnLMqzJ", ext: true },
    ],
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
            boka@thebeach.one
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
              {col.title}
            </h4>
            <ul>
              {col.links.map((l) => (
                <li key={l.label} className="mb-2.5">
                  {l.ext ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-sm text-white/50 transition-colors hover:text-lime"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="cursor-pointer text-sm text-white/50 transition-colors hover:text-lime"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start gap-4 text-xs text-white/20 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <span>
          © {new Date().getFullYear()} The Beach · Beachhallen Tropical AB ·
          556699-2839 ·{" "}
          <Link href="/integritetspolicy" className="transition-colors hover:text-lime">
            Integritetspolicy
          </Link>
        </span>
        <div className="flex gap-5">
          <a
            href="https://www.instagram.com/thebeach_se/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-xs font-semibold uppercase tracking-[0.08em] text-white/30 transition-colors hover:text-lime"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
