import assert from "node:assert/strict";
import test from "node:test";

// @ts-expect-error Node's native TS test runner needs the explicit extension.
import {
  resolveBeachTvTournament,
  resolveBeachTvTournaments,
} from "../src/lib/beachtv-tournaments.ts";

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
