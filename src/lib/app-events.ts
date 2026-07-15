/**
 * Publika aktiviteter från The Beach-appen.
 *
 * App-API:t äger reglerna för vad som får publiceras. Sajten validerar det
 * versionerade svaret, översätter det till kalenderns presentationsmodell och
 * faller tillbaka till senaste lyckade hämtning om API:t tillfälligt är nere.
 */

import type { Ev } from "./kalender";

const FEED_URL = "https://api.beachtv.se/api/public/events";
const REVALIDATE_SECONDS = 6 * 60 * 60;
const REQUEST_TIMEOUT_MS = 5_000;
const STOCKHOLM = "Europe/Stockholm";

type AppFeedEvent = {
  id: string;
  source: "match";
  source_id: string;
  title: string;
  subtitle: string | null;
  type: "seriespel" | "event";
  start_at: string;
  end_at: string;
  all_day: boolean;
  venue: string | null;
  court: string | null;
  short_description: string | null;
  registration_url: string;
  app_deep_link: string;
  public: boolean;
};

type FeedEnvelope = {
  version: 1;
  timezone: "Europe/Stockholm";
  events: AppFeedEvent[];
};

export type AppCalendarEvent = {
  date: string;
  event: Omit<Ev, "day" | "wd">;
};

let lastSuccess: { at: number; events: AppFeedEvent[] } | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isAppFeedEvent(value: unknown): value is AppFeedEvent {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    value.source === "match" &&
    typeof value.source_id === "string" &&
    typeof value.title === "string" &&
    isNullableString(value.subtitle) &&
    (value.type === "seriespel" || value.type === "event") &&
    typeof value.start_at === "string" &&
    Number.isFinite(Date.parse(value.start_at)) &&
    typeof value.end_at === "string" &&
    Number.isFinite(Date.parse(value.end_at)) &&
    typeof value.all_day === "boolean" &&
    isNullableString(value.venue) &&
    isNullableString(value.court) &&
    isNullableString(value.short_description) &&
    typeof value.registration_url === "string" &&
    typeof value.app_deep_link === "string" &&
    typeof value.public === "boolean"
  );
}

function parseFeed(value: unknown): FeedEnvelope {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    value.timezone !== STOCKHOLM ||
    !Array.isArray(value.events)
  ) {
    throw new Error("oväntat format eller feed-version");
  }

  if (!value.events.every(isAppFeedEvent)) {
    throw new Error("en eller flera aktiviteter har ogiltigt format");
  }

  return value as FeedEnvelope;
}

async function fetchAppEvents(): Promise<AppFeedEvent[]> {
  if (lastSuccess && Date.now() - lastSuccess.at < REVALIDATE_SECONDS * 1_000) {
    return lastSuccess.events;
  }

  try {
    const response = await fetch(FEED_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`API:t svarade ${response.status}`);

    const feed = parseFeed(await response.json());
    const events = feed.events.filter((event) => event.public);
    lastSuccess = { at: Date.now(), events };
    return events;
  } catch (error) {
    console.error("[app-events] hämtning misslyckades, använder fallback:", error);
    return lastSuccess?.events ?? [];
  }
}

type StockholmParts = {
  date: string;
  year: number;
  month: number;
  day: number;
  time: string;
};

function stockholmParts(iso: string): StockholmParts {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: STOCKHOLM,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));

  return {
    date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    year,
    month,
    day,
    time: `${get("hour")}:${get("minute")}`,
  };
}

function sentenceCase(value: string): string {
  return value ? value[0].toLocaleUpperCase("sv-SE") + value.slice(1) : value;
}

function slugFor(sourceId: string): string {
  return `app-${sourceId.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`;
}

function presentation(source: AppFeedEvent): AppCalendarEvent {
  const start = stockholmParts(source.start_at);
  const end = stockholmParts(source.end_at);
  const time = source.all_day
    ? "Heldag"
    : start.date === end.date
      ? `${start.time}–${end.time}`
      : `${start.time}–${end.date} ${end.time}`;
  const location = [source.venue, source.court]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
  const meta = [source.subtitle ? sentenceCase(source.subtitle) : null, time, location]
    .filter((part): part is string => Boolean(part))
    .join(" · ");
  const isSeriespel = source.type === "seriespel";

  return {
    date: start.date,
    event: {
      title: source.title,
      meta,
      badge: isSeriespel ? "Seriespel" : "Event",
      badgeTone: "teal",
      type: "event",
      slug: slugFor(source.source_id),
      beskrivning:
        source.short_description ??
        (isSeriespel
          ? "Seriespel på The Beach. Öppna aktiviteten i appen för mer information och anmälan."
          : "Event på The Beach. Öppna aktiviteten i appen för mer information och anmälan."),
      cta: {
        label: "Öppna i The Beach-appen",
        href: source.registration_url || source.app_deep_link,
      },
      skarm: true,
    },
  };
}

export async function getAppCalendarEvents(): Promise<AppCalendarEvent[]> {
  return (await fetchAppEvents()).map(presentation);
}
