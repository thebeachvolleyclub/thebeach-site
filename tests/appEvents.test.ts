import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  APP_EVENT_REVALIDATE_SECONDS,
  getAppCalendarEvents,
  removeSupersededFredagsmys,
} from "../src/lib/app-events.ts";
import { MONTHS } from "../src/lib/kalender.ts";
import { getMergedMonths, mergedBySlug } from "../src/lib/profixio.ts";

test("Junior Event audience badges default to Familj without changing ordinary events", async () => {
  const base = {
    source: "match",
    subtitle: null,
    type: "event",
    start_at: "2026-10-16T17:30:00+02:00",
    end_at: "2026-10-16T19:00:00+02:00",
    all_day: false,
    venue: "The Beach",
    court: null,
    short_description: null,
    registration_url: "https://example.test/register",
    app_deep_link: "thebeach://event",
    public: true,
  };
  const rows = [
    { ...base, id: "match:1", source_id: "1", title: "Fredagsmys", event_type: "junior", junior_audience: null },
    { ...base, id: "match:2", source_id: "2", title: "Barnpass", event_type: "junior", junior_audience: "children_youth" },
    { ...base, id: "match:3", source_id: "3", title: "Familjedag", event_type: "junior", junior_audience: "family" },
    { ...base, id: "match:4", source_id: "4", title: "Äldre juniorevent", event_type: "junior" },
    { ...base, id: "match:5", source_id: "5", title: "Vanligt event", event_type: "other", junior_audience: "family" },
    { ...base, id: "match:6", source_id: "6", title: "Seriespel", type: "seriespel", event_type: "junior" },
  ];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response(JSON.stringify({
    version: 1,
    timezone: "Europe/Stockholm",
    events: rows,
  }), { status: 200, headers: { "Content-Type": "application/json" } })) as typeof fetch;

  try {
    const events = await getAppCalendarEvents();
    assert.deepEqual(events.map(({ event }) => event.badge), [
      "Familj", "Barn & ungdom", "Familj", "Familj", "Event", "Seriespel",
    ]);
    assert.deepEqual(events.map(({ isJuniorEvent }) => isJuniorEvent), [
      true, true, true, true, false, false,
    ]);
    assert.equal(events[0].date, "2026-10-16");

    const october = MONTHS.find(({ month }) => month === "Oktober 2026");
    assert.ok(october);
    const merged = removeSupersededFredagsmys(october.events, "16", events[0]);
    assert.equal(merged.filter((event) => event.day === "16" && event.slug === "fredagsmys").length, 0);
    assert.equal(merged.filter((event) => event.day === "23" && event.slug === "fredagsmys").length, 1);
    assert.equal(october.events.filter((event) => event.day === "16" && event.slug === "fredagsmys").length, 1);
    assert.equal(removeSupersededFredagsmys(october.events, "16", events[4]), october.events);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("cancelled app passes disappear and newly published junior slugs become resolvable", async () => {
  const base = {
    source: "match",
    subtitle: null,
    type: "event",
    event_type: "junior",
    junior_audience: "children_youth",
    start_at: "2099-10-28T16:00:00+01:00",
    end_at: "2099-10-28T17:30:00+01:00",
    all_day: false,
    venue: "The Beach",
    court: null,
    short_description: null,
    registration_url: "https://example.test/register",
    app_deep_link: "thebeach://event",
    public: true,
  };
  const cancelled = {
    ...base,
    id: "match:cancelled",
    source_id: "cancelled",
    title: "Ungdomsträning nybörjare",
  };
  const published = {
    ...base,
    id: "match:e89ef0d0-ed27-41de-8f60-f0a0c88aafdb",
    source_id: "e89ef0d0-ed27-41de-8f60-f0a0c88aafdb",
    title: "Vinnarbana ungdom",
  };
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  let now = originalNow() + APP_EVENT_REVALIDATE_SECONDS * 3_000;
  Date.now = () => now;
  let appEvents = [cancelled];
  const feedRequests: RequestInit[] = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    if (url.endsWith("/api/public/events")) {
      feedRequests.push(init ?? {});
      return new Response(JSON.stringify({ version: 1, timezone: "Europe/Stockholm", events: appEvents }), { status: 200 });
    }
    if (url.includes("login.php")) {
      return new Response("", { status: 200, headers: { "set-cookie": "profixio-test=1; Path=/" } });
    }
    if (url.includes("terminliste.php")) {
      return new Response("<tr><td>2099.10.30</td> <td>10.30</td> <td>TP 17</td> <td>Other</td> <td>Other</td> <td>Other</td></tr>", { status: 200 });
    }
    if (url.includes("/public/v1/tournaments/by-invitation/")) return new Response("", { status: 404 });
    throw new Error(`Unexpected test URL: ${url}`);
  }) as typeof fetch;

  try {
    assert.ok(await mergedBySlug("app-cancelled"));
    assert.equal(await mergedBySlug("app-e89ef0d0-ed27-41de-8f60-f0a0c88aafdb"), undefined);

    appEvents = [published];
    now += APP_EVENT_REVALIDATE_SECONDS * 1_000 + 1;
    assert.equal(await mergedBySlug("app-cancelled"), undefined);
    const detail = await mergedBySlug("app-e89ef0d0-ed27-41de-8f60-f0a0c88aafdb");
    assert.equal(detail?.ev.title, "Vinnarbana ungdom");
    const months = await getMergedMonths();
    assert.ok(months.some((month) => month.events.some((event) => event.slug === detail?.ev.slug)));
    assert.ok(!months.some((month) => month.events.some((event) => event.title === cancelled.title)));
    assert.equal(feedRequests.length, 2);
    assert.ok(feedRequests.every((request) => request.cache === "no-store"));
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
  }
});

test("an upstream error cannot advertise an old, possibly cancelled event indefinitely", async () => {
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  const initial = originalNow() + APP_EVENT_REVALIDATE_SECONDS * 6_000;
  let now = initial;
  let fail = false;
  Date.now = () => now;
  globalThis.fetch = (async () => {
    if (fail) throw new Error("upstream unavailable");
    return new Response(JSON.stringify({
      version: 1,
      timezone: "Europe/Stockholm",
      events: [{
        id: "match:cancelled",
        source: "match",
        source_id: "cancelled",
        title: "Ungdomsträning nybörjare",
        subtitle: null,
        type: "event",
        event_type: "junior",
        junior_audience: "children_youth",
        start_at: "2099-10-28T16:00:00+01:00",
        end_at: "2099-10-28T17:30:00+01:00",
        all_day: false,
        venue: "The Beach",
        court: null,
        short_description: null,
        registration_url: "https://example.test/register",
        app_deep_link: "thebeach://event",
        public: true,
      }],
    }), { status: 200 });
  }) as typeof fetch;
  const originalError = console.error;
  console.error = () => {};

  try {
    assert.equal((await getAppCalendarEvents()).length, 1);
    fail = true;
    now += APP_EVENT_REVALIDATE_SECONDS * 1_000;
    assert.equal((await getAppCalendarEvents()).length, 1); // brief transient grace
    now += APP_EVENT_REVALIDATE_SECONDS * 1_000;
    assert.deepEqual(await getAppCalendarEvents(), []); // no unbounded stale listings
  } finally {
    console.error = originalError;
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
  }
});

test("every public calendar route regenerates app-event content within one minute", () => {
  for (const route of [
    "src/app/page.tsx",
    "src/app/en/page.tsx",
    "src/app/kalender/page.tsx",
    "src/app/en/calendar/page.tsx",
    "src/app/kalender/[slug]/page.tsx",
    "src/app/skarm/page.tsx",
    "src/app/skarm/[slug]/page.tsx",
    "src/app/sitemap.ts",
  ]) {
    assert.match(readFileSync(route, "utf8"), /export const revalidate = 60;/, route);
  }
});
