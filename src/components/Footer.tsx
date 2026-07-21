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
      { label: "The Beach TV", href: "https://tv.thebeach.one", ext: true },
      { label: "Föreningen", href: "/foreningen" },
      { label: "Skolor", href: "/skola" },
    ],
  },
  {
    title: "Event",
    links: [
      { label: "Lokalen", href: "/lokalen" },
      { label: "Boka event", href: "/events" },
      { label: "Företagsevent", href: "/foretagsevent" },
      { label: "Konferens", href: "/konferens" },
      { label: "Kickoff", href: "/kickoff" },
      { label: "Teambuilding", href: "/teambuilding" },
      { label: "Firmafest", href: "/firmafest" },
      { label: "Svensexa", href: "/svensexa" },
      { label: "Möhippa", href: "/mohippa" },
      { label: "Barnkalas", href: "/barnkalas" },
      { label: "Julbord", href: "/julbord" },
    ],
  },
  {
    title: "Mer",
    links: [
      { label: "Om oss", href: "/om-oss" },
      { label: "Se lokalen", href: "/lokalen" },
      { label: "Hållbarhet", href: "/hallbarhet" },
      { label: "Kontakt", href: "/om-oss#kontakt" },
      { label: "FAQ", href: "/faq" },
      { label: "BeachTravels", href: "/beachtravels" },
      { label: "Nyhetsbrev", href: "/#nyhetsbrev" },
    ],
  },
];

const COLS_EN: { title: string; links: FLink[] }[] = [
  {
    title: "Play",
    links: [
      { label: "Book a court", href: "/en/book" },
      { label: "Calendar", href: "/kalender" },
      { label: "Schools", href: "/en/school" },
    ],
  },
  {
    title: "Events",
    links: [
      { label: "Book an event", href: "/en/events" },
      { label: "Conference", href: "/en/events" },
      { label: "Custom & large groups", href: "/en/events#request" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "About us", href: "/en/about" },
      { label: "Sustainability", href: "/hallbarhet" },
      { label: "FAQ", href: "/en/faq" },
      { label: "Contact", href: "/en/about#contact" },
      { label: "BeachTravels", href: "/beachtravels" },
      { label: "Newsletter", href: "/#nyhetsbrev" },
    ],
  },
];

export default function Footer({ locale = "sv" }: { locale?: "sv" | "en" }) {
  const cols = locale === "en" ? COLS_EN : COLS;
  const tagline =
    locale === "en"
      ? "The mecca of beach volleyball in Sweden. Training base for the Swedish national team and a community for everyone who loves the sport. Everyone is warmly welcome!"
      : "Beachvolleybollens mecka i Sverige. Träningsbas för det svenska landslaget och ett community för alla som älskar sporten. Alla är varmt välkomna till oss!";
  return (
    <footer className="bg-black px-5 pb-10 pt-14 text-white sm:px-8 lg:px-14 lg:pb-10 lg:pt-24">
      <div className="grid grid-cols-2 gap-10 border-b border-white/[0.06] pb-12 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-16 lg:pb-20">
        <div className="col-span-2 lg:col-span-1">
          <Logo variant="green" className="h-7 w-auto" />
          <p className="mt-5 max-w-xs text-sm leading-[1.7] text-white/35">
            {tagline}
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

        {cols.map((col) => (
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
          © {new Date().getFullYear()} The Beach Volley Club Huddinge ·
          802503-0928 ·{" "}
          <Link href="/integritetspolicy" className="transition-colors hover:text-lime">
            {locale === "en" ? "Privacy policy" : "Integritetspolicy"}
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
