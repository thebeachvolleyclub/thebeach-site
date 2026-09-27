import assert from "node:assert/strict";
import test from "node:test";

import { getAppCalendarEvents, removeSupersededFredagsmys } from "../src/lib/app-events.ts";
import { MONTHS } from "../src/lib/kalender.ts";

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
