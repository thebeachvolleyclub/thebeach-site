/**
 * NYHETER — sajtens redaktionella innehåll. Navet för allt som inte är en händelse.
 *
 * Kalendern (src/lib/kalender.ts) svarar på "vad händer?".
 * Den här filen svarar på "vad har hänt, och varför spelar det roll?".
 *
 * Lägg nyaste artikeln ÖVERST. Uppdatera HÄR (eller be Lisa/AI-teamet).
 * - slug     → artikeln får en egen sida på /nyheter/<slug>
 * - datum    → ISO (YYYY-MM-DD). Styr sortering och publiceringsdatum i Google.
 * - ingress  → fetstilt inledning + meta description + OG-text
 * - body     → block, se Block-typen nedan
 *
 * Bilder: ladda upp via https://staging.thebeach.one/__media eller lägg i
 * public/media/nyheter/. Ange alltid fotograf i `credit`.
 */

import {
  parseAppEnvironment,
  responseEnvironmentMatches,
  serviceEndpoint,
} from "./runtimeEnvironment.core.ts";

export type Block =
  | { t: "h2"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "img"; src: string; alt: string; caption?: string; credit?: string }
  | { t: "table"; head: string[]; rows: string[][]; note?: string; highlightFirstRow?: boolean }
  | { t: "cta"; label: string; href: string; secondary?: boolean }
  | { t: "callout"; title: string; text: string };

export type Article = {
  slug: string;
  datum: string;
  uppdaterad?: string;
  kicker: string;
  title: string;
  ingress: string;
  hero?: { src: string; alt: string; caption?: string; credit?: string };
  taggar?: string[];
  body: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "hostens-traningar-2026",
    datum: "2026-08-17",
    kicker: "Höstterminen 2026",
    title: "Nedräkningen har startat — allt inför höstens träningar",
    ingress:
      "All organiserad träning startar söndag den 30 augusti. EM-framgångarna inspirerar och anmälningstempot är högt — här är läget för träningsgrupper, kurser, barn & ungdom och allt annat som händer i höst.",
    taggar: ["Träning", "Kurser", "Barn & ungdom", "Landslaget"],
    hero: {
      src: "/media/landslag-fotosession.webp",
      alt: "Landslagsspelarna framför solnedgångsväggen på The Beach.",
      caption: "EM-framgångarna inspirerar — och det märks i anmälningstempot.",
      credit: "The Beach",
    },
    body: [
      { t: "p", text: "Hösten närmar sig och vi är superpeppade att dra igång all organiserad träning. EM-framgångarna inspirerar — och det märks inte minst i anmälningstempot till höstens träningar. **All organiserad träning startar söndag den 30 augusti** och framåt." },

      { t: "h2", text: "Träningsgrupper" },
      { t: "p", text: "Ordinarie anmälan är stängd och vi jobbar just nu med att skapa jämna, bra grupper. Som tidigare meddelat siktar vi på att vara klara med höstens träningsgrupper **senast den 23 augusti**." },

      { t: "h2", text: "Grundkurser & fortsättningskurser" },
      { t: "p", text: "**Grundkurs tisdagar 19.00** blev snabbt fullbokad — vi har öppnat upp 8 platser till. **Grundkurs torsdagar 20.30** har än så länge gott om plats, men det brukar smälla till rätt snabbt. Vill du vara med är det läge att signa nu." },
      { t: "p", text: "Fortsättningskurserna på tisdagar och torsdagar har ungefär samma status — platser finns, men de brukar gå fort." },
      { t: "cta", label: "Se kurser och tider", href: "/trana" },

      { t: "h2", text: "Barn & ungdom" },
      { t: "p", text: "Planeringen inför terminsstarten pågår för fullt. Precis som tidigare gäller att man behåller sin plats tills man avanmäler sig. Det är många i kö — om du eller ditt barn inte önskar ha kvar platsen, maila mans@thebeach.one så går den vidare till nästa på tur." },
      { t: "p", text: "Vill du eller ditt barn vara med? Fyll i anmälningsformuläret — vi gör vårt bästa för att skapa plats för så många som möjligt. Ett tips: de mest populära tiderna är svårast att få plats på. Titta gärna på de tidigare tiderna på vardagar — där är chansen som störst." },
      { t: "cta", label: "Anmälan barn & ungdom HT26", href: "https://www.svenskalag.se/thebeach/formular/anmalan-till-barn-ungdomsgrupper-ht26/38601" },

      { t: "h2", text: "Klubblags-SM för ungdomar 5–6 september" },
      { t: "p", text: "Vi arrangerar Klubblags-SM för ungdomar hos oss helgen den 5–6 september, i fyra klasser: **U16F, U18F, U16P och U18P**. Vi är superpeppade att välkomna lirare från hela landet!" },

      { t: "h2", text: "Lördagar blir Swedish Beach Tour-dagar" },
      { t: "p", text: "I princip varje lördag under hela terminen kör vi sanktionerad turnering. Vi väntar på att turneringarna ska godkännas — så fort de är det ser du dem i kalendern, både här på hemsidan och i appen." },
      { t: "cta", label: "Till kalendern", href: "/kalender", secondary: true },

      { t: "h2", text: "Abonnemang" },
      { t: "p", text: "När den organiserade träningsverksamheten växer blir det färre banor lediga för bokning. Vi har fått stort intresse för abonnemang på sistone men inte hunnit ikapp än — och vi väntar på att några pusselbitar ska falla på plats innan vi kan återkomma om vilka som får abonnemang. Saknar du svar, eller vill du anmäla intresse? Maila david@thebeach.one." },

      { t: "h2", text: "Landslagskoll: nästa stopp Montreal" },
      { t: "p", text: "Vi tog ett snack med förbundskapten Rasmus Jonsson i morse, och det händer mycket i landslagsvärlden just nu." },
      {
        t: "img",
        src: "/media/nyheter/host26-montreal.webp",
        alt: "Elmer och Jacke framför solnedgångsväggen på The Beach.",
        caption: "Elmer och Jacke — näst på tur: Elite16 i Montreal.",
        credit: "The Beach",
      },
      { t: "p", text: "Efter EM-succén reser **Elmer och Jacke** tillsammans med Rasmus till Montreal för att spela **Elite16** — en av de största tävlingarna på touren. Matcherna visas på **SVT Play** med Mattias Magnusson som expertkommentator. De går på nätterna svensk tid, men det fina är att du kan se dem när du vill i efterhand." },
      { t: "p", text: "För våra OS- och VM-mästare **David och Jonis, samt Anders**, blir det enligt planen inget Montreal den här gången. Efter många tuffa matcher i Polen väntar i stället välförtjänt återhämtning på hemmaplan." },
      { t: "p", text: "Blickar vi framåt startar den OS-kvalificerande perioden mot **Los Angeles 2028** i november. Exakt när och var är fortfarande oklart — planen från början var Doha, men med det oroliga läget i regionen är det troligt att tävlingarna hamnar på en annan adress. Vi håller er uppdaterade." },

      { t: "callout", title: "PS. Klubbmästerskap nu på söndag!", text: "Missa inte — mer info och anmälan hittar du i kalendern och i appen." },
    ],
  },
  {
    slug: "flest-sm-guld-2026",
    datum: "2026-08-05",
    kicker: "Beachvolley-SM 2026",
    title: "The Beach tog flest SM-guld av alla klubbar i Sverige",
    ingress:
      "13 guldmedaljer. Fler än någon annan klubb i landet – och mer än dubbelt så många som tvåan. Under sju dagar i Åhus tog The Beach medalj i 19 av 28 klasser, från U17 till Veteran 60+.",
    taggar: ["SM", "Tävling", "Föreningen"],
    hero: {
      src: "/media/nyheter/sm26-senior-dam.webp",
      alt: "Prispallen i Senior-SM Damer, Beachvolley-SM 2026 i Åhus.",
      caption: "Sara Cavretti högst upp på pallen i Senior-SM Damer.",
      credit: "Robert Boman",
    },
    body: [
      { t: "p", text: "Beachvolley-SM 2026 avgjordes 24–30 juli på Åhus Beach. 719 lag, 37 klasser, en hel beachvolleyby med 35 planer. När sanden lagt sig hade The Beach-spelare stått på prispallen 23 gånger – 13 guld, 4 silver och 6 brons." },
      { t: "p", text: "Ingen annan klubb i Sverige tog fler guld." },

      { t: "h2", text: "Guldligan – SM 2026" },
      {
        t: "table",
        head: ["#", "Klubb", "Guld", "Silver", "Brons", "Totalt"],
        highlightFirstRow: true,
        rows: [
          ["1", "The Beach", "13", "4", "6", "23"],
          ["2", "Göteborg BC", "6", "17", "14", "37"],
          ["3", "Habo Wolley", "6", "1", "5", "12"],
          ["4", "Malmö BC", "4", "5", "7", "16"],
          ["5", "Stöcke IF", "3", "4", "1", "8"],
          ["6", "Karlskrona VBK", "3", "1", "0", "4"],
          ["7", "Lunds VK", "3", "0", "1", "4"],
          ["8", "Säters IF", "2", "2", "1", "5"],
          ["9", "Beachbrothers BC", "2", "1", "5", "8"],
          ["10", "Nyköpings FK", "2", "0", "2", "4"],
        ],
        note: "Räknat per medaljör, inte per lag – många par består av spelare från olika klubbar. Miniorklasserna ingår inte.",
      },

      { t: "h2", text: "Cavretti svensk mästare" },
      { t: "p", text: "Det tyngsta guldet kom på söndagen. **Sara Cavretti** vann Senior-SM Damer tillsammans med Helene Jernbeck (Slow Down BK) – hennes första SM-titel i seniorklassen, och den mest prestigefyllda titeln som delas ut under veckan." },
      { t: "img", src: "/media/nyheter/sm26-u18-pojkar.webp", alt: "Prispallen i U18-SM Pojkar.", caption: "Elliott Bolin, guld i U18-SM Pojkar tillsammans med Love Linder.", credit: "Felicia Brink" },

      { t: "h2", text: "Två dubbla mästare" },
      { t: "p", text: "**Malin Axland** vann två SM-guld på tre dagar: Veteran 45+ Damer med Anna Thollander, och Veteran 50+ Damer med Ellen Stavblom (Fyrishov BC)." },
      { t: "img", src: "/media/nyheter/sm26-vet45-damer.webp", alt: "Prispallen i Veteran-SM 45+ Damer.", caption: "Malin Axland och Anna Thollander, guld i Veteran-SM 45+ Damer.", credit: "Felicia Brink" },
      { t: "p", text: "**Irma Mtabingwa Demilo** gjorde samma sak i ungdomsklasserna. Guld i U17 Flickor med Elsa Åström (Stöcke IF), och guld i U18 Flickor med Lova Hägglund. Två åldersklasser, samma vecka, två titlar." },
      { t: "img", src: "/media/nyheter/sm26-u18-flickor.webp", alt: "Prispallen i U18-SM Flickor.", caption: "Irma Mtabingwa Demilo och Lova Hägglund, guld i U18-SM Flickor.", credit: "Felicia Brink" },
      { t: "p", text: "**Karin Leander** tog guld i Veteran 55+ Damer och brons i Veteran 50+ Damer – båda tillsammans med Ulrika Fromin (Lidingö SK)." },
      { t: "p", text: "**Ingrid Axland** var nära hela vägen: silver i både Junior-SM Damer och U19 Flickor, tillsammans med Emelie Öpik (Solna VBK)." },
      { t: "img", src: "/media/nyheter/sm26-vet35-herrar.webp", alt: "Prispallen i Veteran-SM 35+ Herrar.", caption: "Ossian Öhman och Viktor Jonsson, guld i Veteran-SM 35+ Herrar.", credit: "Felicia Brink" },

      { t: "h2", text: "Samtliga medaljörer" },
      { t: "p", text: "**Guld**" },
      { t: "ul", items: [
        "**Ossian Öhman / Viktor Jonsson** – Veteran-SM 35+ Herrar",
        "**Irma Mtabingwa Demilo / Lova Hägglund** – U18-SM Flickor",
        "**Malin Axland / Anna Thollander** – Veteran-SM 45+ Damer",
        "**Sara Cavretti** – Senior-SM Damer (med Helene Jernbeck, Slow Down BK)",
        "**Irma Mtabingwa Demilo** – U17-SM Flickor (med Elsa Åström, Stöcke IF)",
        "**Elliott Bolin** – U18-SM Pojkar (med Love Linder, Säters IF)",
        "**Camilla Nilsson** – Veteran-SM 35+ Damer (med Kaisa Wallin, Göteborg BC)",
        "**Malin Axland** – Veteran-SM 50+ Damer (med Ellen Stavblom, Fyrishov BC)",
        "**Karin Leander** – Veteran-SM 55+ Damer (med Ulrika Fromin, Lidingö SK)",
        "**Michael Gustafsson** – Veteran-SM 60+ Herrar (med Peter Tholse, Nyköpings FK)",
      ] },
      { t: "p", text: "**Silver**" },
      { t: "ul", items: [
        "**Staffan Äng / Mathijs Bolin** – Veteran-SM 45+ Herrar",
        "**Ingrid Axland** – Junior-SM Damer (med Emelie Öpik, Solna VBK)",
        "**Ingrid Axland** – U19-SM Flickor (med Emelie Öpik, Solna VBK)",
      ] },
      { t: "p", text: "**Brons**" },
      { t: "ul", items: [
        "**Maja Berg** – Junior-SM Damer (med Ebba Tannerfalk, Ljungby VBK)",
        "**Tina Thurin** – Mixed-SM (med Jakob Molin, Sollentuna VK)",
        "**Adrian Lalami** – U19-SM Pojkar (med Amos Bäckström, Linköping BAC)",
        "**Erik Rundqvist** – Veteran-SM 45+ Herrar (med Erik Soxbo, Fyrishov BC)",
        "**Karin Leander** – Veteran-SM 50+ Damer (med Ulrika Fromin, Lidingö SK)",
        "**Ulf Åkerstedt** – Veteran-SM 55+ Herrar (med Stefan Akteus, Beachbrothers BC)",
      ] },

      { t: "h2", text: "Bredden är det verkliga resultatet" },
      { t: "p", text: "Nitton spelare. Yngsta medaljören föddes 2010, äldsta tävlar i 60+. Guld i ungdomsklasser, guld i seniorklassen, guld i fem veteranklasser." },
      { t: "p", text: "Det säger något annat än att vi har några vassa spetsspelare. Det säger att spelare hos oss utvecklas hela vägen – och fortsätter tävla långt efter att många andra slutat. Det är precis det vi bygger i Huddinge: en klubb där en 15-åring och en 60-åring tränar i samma sand, mot samma standard." },
      { t: "p", text: "Stort grattis till samtliga medaljörer." },

      { t: "h2", text: "Först: klubbens egna mästerskap – 23 augusti" },
      { t: "p", text: "Innan höstens SM väntar en dag som är till för alla er andra. **Söndag 23 augusti avgörs Klubbmästerskapet 2026** – då korar vi klubbens egna mästare och hyllar hela säsongens prestationer." },
      { t: "callout", title: "Alla medlemmar är varmt välkomna", text: "Du anmäler dig individuellt via The Beach-appen, så du behöver ingen partner. Ta med dig kompisen från träningsgruppen, eller kom själv och bli ihopsatt på plats." },
      {
        t: "table",
        head: ["Tid", "Vad"],
        rows: [
          ["12:00", "Uppvärmning"],
          ["12:10", "Turneringsstart – 3 omgångar"],
          ["12:55", "3 omgångar"],
          ["13:40", "3 omgångar"],
          ["14:25", "3 omgångar"],
          ["15:00", "Mat och hyllning av säsongens framgångar"],
          ["15:30–16:50", "Finaler"],
        ],
      },
      { t: "p", text: "Det är samma sand, samma standard – men den här dagen handlar inte om ranking eller licenser. Den handlar om klubben." },
      { t: "cta", label: "Anmäl dig till Klubbmästerskapet", href: "/kalender/klubbmasterskapet-2026" },

      { t: "h2", text: "Sedan: ett SM kvar – och det avgörs hos oss" },
      { t: "p", text: "Säsongen är inte slut. **5–6 september avgörs Klubblags-SM för ungdomar på The Beach i Huddinge** – årets sista svenska mästerskap i beachvolley, på vår egen sand." },
      { t: "p", text: "Två klasser spelas: **U16-Mästerskapet** och **U18-SM**, med upp till 12 klubblag per klass. Varje klubblag består av 4–6 spelare som formerar två par, och varje klubbmatch avgörs i bäst av tre – förstalag mot förstalag, andralag mot andralag, och vid 1–1 ett avgörande golden set till 15 där en helt ny konstellation måste kliva in. Gruppspel på lördagen, semifinaler och finaler på söndagen." },
      { t: "p", text: "Och vi går in som **regerande mästare på flicksidan.**" },
      { t: "p", text: "Premiäråret 2025 arrangerade vi det första ungdomsklubblags-SM:et någonsin – 156 spelare, 24 coacher, fyra egna lag – och vårt flicklag vann hela turneringen med bara ett förlorat set på vägen. Finalen mot Sollentuna VK slutade 2–0, 2–0. Guldlaget bestod av Maja Berg, Ingrid Axland, Emelie Öpik och Irma Mtabingwa Demilo." },
      { t: "img", src: "/media/nyheter/klubblags-sm-2025-guld.webp", alt: "The Beach och Habo Wolley med guldmedaljerna på Klubblags-SM för ungdomar 2025.", caption: "Guldjubel på hemmaplan 2025 – The Beach och Habo Wolley tog guld i varsin klass.", credit: "Ellinor Barmyr" },
      { t: "p", text: "Tre av dem stod på pallen i Åhus i somras. Demilo med två SM-guld, Ingrid Axland med två silver, Maja Berg med brons." },
      { t: "p", text: "Nu ska titeln försvaras. Hemma." },
      { t: "cta", label: "All info och startfält", href: "https://volleyboll.se/beachvolley/klubblags-sm/ungdomstavlingen" },
      { t: "cta", label: "Läs om guldhelgen 2025", href: "https://www.svenskalag.se/thebeach/nyheter/2385232/klubblags-sm-for-ungdomar-2025-vilken-fest/", secondary: true },
    ],
  },
];

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function strings(value: unknown): string[] | null {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : null;
}

function safeImageSrc(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (value.startsWith("/") || value.startsWith("https://thebeach.one/"))
  );
}

function safeHref(value: unknown): value is string {
  return (
    typeof value === "string" &&
    (value.startsWith("/") || value.startsWith("#") || /^https:\/\//.test(value))
  );
}

function parseBlock(value: unknown): Block | null {
  const raw = record(value);
  if (!raw || typeof raw.t !== "string") return null;
  switch (raw.t) {
    case "h2":
    case "p":
      return typeof raw.text === "string" ? { t: raw.t, text: raw.text } : null;
    case "ul": {
      const items = strings(raw.items);
      return items ? { t: "ul", items } : null;
    }
    case "img":
      return safeImageSrc(raw.src) && typeof raw.alt === "string"
        ? {
            t: "img",
            src: raw.src,
            alt: raw.alt,
            caption: typeof raw.caption === "string" ? raw.caption : undefined,
            credit: typeof raw.credit === "string" ? raw.credit : undefined,
          }
        : null;
    case "table": {
      const head = strings(raw.head);
      const rawRows = Array.isArray(raw.rows) ? raw.rows : null;
      const rows = rawRows
        ? rawRows.map(strings).filter((row): row is string[] => row !== null)
        : null;
      if (!head || !rows || !rawRows || rows.length !== rawRows.length) return null;
      return {
        t: "table",
        head,
        rows,
        note: typeof raw.note === "string" ? raw.note : undefined,
        highlightFirstRow:
          typeof raw.highlightFirstRow === "boolean" ? raw.highlightFirstRow : undefined,
      };
    }
    case "cta":
      return typeof raw.label === "string" && safeHref(raw.href)
        ? {
            t: "cta",
            label: raw.label,
            href: raw.href,
            secondary: typeof raw.secondary === "boolean" ? raw.secondary : undefined,
          }
        : null;
    case "callout":
      return typeof raw.title === "string" && typeof raw.text === "string"
        ? { t: "callout", title: raw.title, text: raw.text }
        : null;
    default:
      return null;
  }
}

/** Fail closed on malformed AI output; a bad remote article must never break the site. */
export function parseResultArticle(value: unknown): Article | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const body = Array.isArray(raw.body)
    ? raw.body.map(parseBlock).filter((block): block is Block => block !== null)
    : [];
  if (
    typeof raw.slug !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(raw.slug) ||
    typeof raw.datum !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(raw.datum) ||
    typeof raw.kicker !== "string" ||
    typeof raw.title !== "string" ||
    typeof raw.ingress !== "string" ||
    body.length === 0
  ) {
    return null;
  }
  const hero =
    raw.hero &&
    typeof raw.hero === "object" &&
    safeImageSrc((raw.hero as { src?: unknown }).src) &&
    typeof (raw.hero as { alt?: unknown }).alt === "string"
      ? (raw.hero as Article["hero"])
      : undefined;
  return {
    slug: raw.slug,
    datum: raw.datum,
    uppdaterad:
      typeof raw.uppdaterad === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.uppdaterad)
        ? raw.uppdaterad
        : undefined,
    kicker: raw.kicker,
    title: raw.title,
    ingress: raw.ingress,
    hero,
    taggar: Array.isArray(raw.taggar)
      ? raw.taggar.filter((tag): tag is string => typeof tag === "string")
      : undefined,
    body,
  };
}

async function resultArticles(fresh = false): Promise<Article[]> {
  try {
    const environment = parseAppEnvironment(process.env.APP_ENV);
    const url = serviceEndpoint(
      "RESULT_ARTICLES_URL",
      process.env.RESULT_ARTICLES_URL,
      environment,
      "https://api.beachtv.se/results/articles",
    );
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
    });
    if (
      !responseEnvironmentMatches(
        environment,
        response.headers.get("X-The-Beach-Environment"),
      )
    ) {
      return [];
    }
    if (!response.ok) return [];
    const payload = (await response.json()) as { articles?: unknown[] };
    return (payload.articles ?? [])
      .map(parseResultArticle)
      .filter((article): article is Article => article !== null);
  } catch {
    return [];
  }
}

/** Alla lokala och AI-redigerade artiklar, nyast först. */
export async function allArticles(): Promise<Article[]> {
  const merged = new Map<string, Article>();
  for (const article of await resultArticles()) merged.set(article.slug, article);
  // Handredigerade artiklar win on slug collisions.
  for (const article of ARTICLES) merged.set(article.slug, article);
  // Vid datum-lika: handredigerade artiklar före auto-genererade resultatartiklar.
  const localSlugs = new Set(ARTICLES.map((a) => a.slug));
  return [...merged.values()].sort(
    (a, b) =>
      b.datum.localeCompare(a.datum) ||
      Number(localSlugs.has(b.slug)) - Number(localSlugs.has(a.slug))
  );
}

export async function articleBySlug(slug: string): Promise<Article | undefined> {
  // Local editorial work always wins a collision. Remote-only slugs must use a
  // fresh lookup: caching an empty build-time response would otherwise turn a
  // newly published Resultat article into a persistent 404.
  const local = ARTICLES.find((article) => article.slug === slug);
  if (local) return local;
  return (await resultArticles(true)).find((article) => article.slug === slug);
}

const MONTHS_SV = ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"];

/** "2026-08-05" → "5 augusti 2026" */
export function formatDatum(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS_SV[m - 1]} ${y}`;
}
