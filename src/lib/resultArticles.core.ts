import {
  responseEnvironmentMatches,
  type AppEnvironment,
} from "./runtimeEnvironment.core.ts";

export type Block =
  | { t: "h2"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "img"; src: string; alt: string; caption?: string; credit?: string }
  | {
      t: "table";
      head: string[];
      rows: string[][];
      note?: string;
      highlightFirstRow?: boolean;
    }
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
          typeof raw.highlightFirstRow === "boolean"
            ? raw.highlightFirstRow
            : undefined,
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

type NextFetchInit = RequestInit & { next?: { revalidate: number } };
type Fetcher = (input: string, init: NextFetchInit) => Promise<Response>;

export async function fetchResultArticles(
  url: string,
  environment: AppEnvironment,
  fresh = false,
  fetcher: Fetcher = fetch,
): Promise<Article[]> {
  const response = await fetcher(url, {
    headers: { Accept: "application/json" },
    ...(fresh ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
  });
  if (
    !responseEnvironmentMatches(
      environment,
      response.headers.get("X-The-Beach-Environment"),
    ) ||
    !response.ok
  ) {
    return [];
  }
  const payload = (await response.json()) as { articles?: unknown[] };
  return (payload.articles ?? [])
    .map(parseResultArticle)
    .filter((article): article is Article => article !== null);
}
