import assert from "node:assert/strict";
import test from "node:test";

// @ts-expect-error Node's native TS test runner needs the explicit extension.
import {
  BEACH_TV_LOOKUP_CACHE_MAX_ENTRIES,
  BEACH_TV_LOOKUP_CONCURRENCY,
  resolveBeachTvTournament,
  resolveBeachTvTournaments,
} from "../src/lib/beachtv-tournaments.ts";
// @ts-expect-error Node's native TS test runner needs the explicit extension.
import {
  attachBeachTvLinksToRenderedManualRows,
  snapshotInvitationsForRenderedManualRows,
} from "../src/lib/calendar-tv-links.core.ts";

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

test("resolves an ibId through BeachTV without constructing a slug", async () => {
  let requestedUrl = "";
  const href = await resolveBeachTvTournament(
    "11038",
    async (url) => {
      requestedUrl = url;
      return jsonResponse(200, {
        id: "53978",
        profixio_invitation_id: "11038",
        slug: "a-slug-the-site-must-not-use",
      });
    },
  );

  assert.equal(
    requestedUrl,
    "https://tv.thebeach.one/public/v1/tournaments/by-invitation/11038",
  );
  assert.equal(href, "https://tv.thebeach.one/turnering/by-ibid/11038");
  assert.doesNotMatch(href!, /a-slug/);
});

test("omits the CTA for blank and unresolved ibIds", async () => {
  let calls = 0;
  const fetcher = async () => {
    calls += 1;
    return jsonResponse(404, { detail: "tournament not found" });
  };

  assert.equal(await resolveBeachTvTournament("", fetcher), null);
  assert.equal(await resolveBeachTvTournament("99999", fetcher), null);
  assert.equal(calls, 1);
});

test("a timeout or 5xx is logged and never fails the calendar", async () => {
  const logged: string[] = [];
  const logger = (message: string) => logged.push(message);

  assert.equal(
    await resolveBeachTvTournament(
      "11039",
      async () => {
        throw new Error("timeout");
      },
      logger,
    ),
    null,
  );
  assert.equal(
    await resolveBeachTvTournament(
      "11040",
      async () => jsonResponse(503, {}),
      logger,
    ),
    null,
  );
  assert.equal(logged.length, 2);
  assert.match(logged[0], /11039/);
  assert.match(logged[1], /11040/);
});

test("deduplicates identical ibIds within a calendar render", async () => {
  const calls: string[] = [];
  const resolved = await resolveBeachTvTournaments(
    ["11039", " 11039 ", "", "11040"],
    async (url) => {
      calls.push(url);
      const invitationId = url.split("/").at(-1)!;
      return jsonResponse(200, {
        id: invitationId === "11039" ? "53979" : "53980",
        profixio_invitation_id: invitationId,
      });
    },
  );

  assert.equal(calls.length, 2);
  assert.equal(resolved.get("11039"), "https://tv.thebeach.one/turnering/by-ibid/11039");
  assert.equal(resolved.get("11040"), "https://tv.thebeach.one/turnering/by-ibid/11040");
});

test("single-flights the same lookup across simultaneous calendar renders", async () => {
  let calls = 0;
  let releaseLookup!: () => void;
  const lookupGate = new Promise<void>((resolve) => {
    releaseLookup = resolve;
  });
  const fetcher = async () => {
    calls += 1;
    await lookupGate;
    return jsonResponse(200, {
      id: "53981",
      profixio_invitation_id: "11041",
    });
  };

  const first = resolveBeachTvTournaments(["11041"], fetcher);
  const second = resolveBeachTvTournaments(["11041"], fetcher);
  await new Promise<void>((resolve) => setImmediate(resolve));

  assert.equal(calls, 1);
  releaseLookup();
  const [firstResult, secondResult] = await Promise.all([first, second]);
  assert.deepEqual(firstResult, secondResult);
  assert.equal(calls, 1);
});

test("bounds shared downstream concurrency and caches unresolved invitations", async () => {
  const invitationIds = Array.from({ length: 17 }, (_, index) => String(12000 + index));
  const callsByInvitation = new Map<string, number>();
  let active = 0;
  let maxActive = 0;
  const fetcher = async (url: string) => {
    const invitationId = url.split("/").at(-1)!;
    callsByInvitation.set(invitationId, (callsByInvitation.get(invitationId) ?? 0) + 1);
    active += 1;
    maxActive = Math.max(maxActive, active);
    await new Promise<void>((resolve) => setTimeout(resolve, 5));
    active -= 1;
    return jsonResponse(404, { detail: "tournament not found" });
  };

  const results = await Promise.all([
    resolveBeachTvTournaments(invitationIds, fetcher),
    resolveBeachTvTournaments([...invitationIds].reverse(), fetcher),
    resolveBeachTvTournaments(invitationIds.slice(0, 8), fetcher),
  ]);

  assert.ok(results.every((result) => result.size === 0));
  assert.equal(callsByInvitation.size, invitationIds.length);
  assert.ok([...callsByInvitation.values()].every((calls) => calls === 1));
  assert.equal(maxActive, BEACH_TV_LOOKUP_CONCURRENCY);

  await resolveBeachTvTournaments(invitationIds, fetcher);
  assert.ok([...callsByInvitation.values()].every((calls) => calls === 1));
});

test("strictly bounds cached invitation results across non-revisited IDs", async () => {
  const callsByInvitation = new Map<string, number>();
  const fetcher = async (url: string) => {
    const invitationId = url.split("/").at(-1)!;
    callsByInvitation.set(invitationId, (callsByInvitation.get(invitationId) ?? 0) + 1);
    return jsonResponse(404, { detail: "tournament not found" });
  };
  const invitationIds = Array.from(
    { length: BEACH_TV_LOOKUP_CACHE_MAX_ENTRIES + 1 },
    (_, index) => String(13000 + index),
  );

  for (const invitationId of invitationIds) {
    await resolveBeachTvTournament(invitationId, fetcher);
  }

  // The newest negative result is retained, while the oldest has been evicted
  // once the strict process-cache limit is crossed.
  await resolveBeachTvTournament(invitationIds.at(-1)!, fetcher);
  await resolveBeachTvTournament(invitationIds[0], fetcher);

  assert.equal(callsByInvitation.get(invitationIds.at(-1)!), 1);
  assert.equal(callsByInvitation.get(invitationIds[0]), 2);
  assert.equal(
    [...callsByInvitation.values()].reduce((total, calls) => total + calls, 0),
    BEACH_TV_LOOKUP_CACHE_MAX_ENTRIES + 2,
  );
});

test("does not cache transient BeachTV failures", async () => {
  let calls = 0;
  const fetcher = async () => {
    calls += 1;
    if (calls === 1) return jsonResponse(503, {});
    return jsonResponse(200, {
      id: "53982",
      profixio_invitation_id: "11042",
    });
  };
  const logged: string[] = [];

  assert.equal(
    await resolveBeachTvTournament("11042", fetcher, (message) => logged.push(message)),
    null,
  );
  assert.equal(
    await resolveBeachTvTournament("11042", fetcher, (message) => logged.push(message)),
    "https://tv.thebeach.one/turnering/by-ibid/11042",
  );
  assert.equal(calls, 2);
  assert.equal(logged.length, 1);
});

test("a snapshot ibId enriches only an already-rendered manual tournament", () => {
  const months = [
    {
      month: "Juli 2026",
      events: [
        { day: "11", type: "tournament", title: "SBT1" },
        { day: "18", type: "training", title: "Träning" },
      ],
    },
  ];
  const snapshot = [
    { date: "2026-07-11", ibId: "11003" },
    { date: "2026-07-18", ibId: "11038" },
    { date: "2026-07-25", ibId: "" },
  ];
  const sources = snapshotInvitationsForRenderedManualRows(months, snapshot);

  assert.deepEqual(sources, [{ date: "2026-07-11", ibId: "11003" }]);
  attachBeachTvLinksToRenderedManualRows(
    months,
    sources,
    new Map([["11003", "https://tv.thebeach.one/turnering/by-ibid/11003"]]),
  );

  assert.equal(months.length, 1);
  assert.equal(months[0].events.length, 2);
  assert.deepEqual(months[0].events[0], {
    day: "11",
    type: "tournament",
    title: "SBT1",
    tvCta: {
      label: "Se tävlingen på BeachTV",
      href: "https://tv.thebeach.one/turnering/by-ibid/11003",
    },
  });
  assert.deepEqual(months[0].events[1], {
    day: "18",
    type: "training",
    title: "Träning",
  });
});
