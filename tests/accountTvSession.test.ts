import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { projectTvTrainingSessions } from "../src/lib/accountTvTraining.core.ts";

const accountSession = readFileSync("src/lib/accountSession.ts", "utf8");
const accountCookies = readFileSync("src/lib/accountCookies.ts", "utf8");
const proxySource = readFileSync("src/proxy.ts", "utf8");
const routeSource = readFileSync("src/app/api/account/tv-training/route.ts", "utf8");

test("the existing account session is mirrored to an HttpOnly TV handoff", () => {
  assert.match(accountCookies, /TV_ACCOUNT_COOKIE = "tb_account_tv_session"/);
  assert.match(accountCookies, /TV_ACCOUNT_COOKIE_DOMAIN = "\.thebeach\.one"/);
  assert.match(accountSession, /response\.cookies\.set\(TV_ACCOUNT_COOKIE, token/);
  assert.match(accountSession, /domain: TV_ACCOUNT_COOKIE_DOMAIN/);
  assert.match(accountSession, /httpOnly: true/);
  assert.match(proxySource, /accountToken && accountToken !== tvToken/);
  assert.match(proxySource, /host !== "thebeach\.one"/);
  assert.match(proxySource, /"Cache-Control", "private, no-store"/);
  assert.match(proxySource, /"Vary", "Cookie"/);
});

test("the TV BFF uses only the shared profile session and fixed app routes", () => {
  assert.match(routeSource, /const token = await tvAccountToken\(\)/);
  assert.match(routeSource, /"\/matchmaking\/auth\/me"/);
  assert.match(
    routeSource,
    /"\/training\/sessions\?include_past=true&include_recordings=true"/,
  );
  assert.doesNotMatch(routeSource, /X-User-Id|group_name.*request|searchParams/);
  assert.match(routeSource, /"Cache-Control": "private, no-store"/);
});

test("the TV handoff strips unrelated profile and training fields", () => {
  const projected = projectTvTrainingSessions({
    sessions: [
      {
        id: 90,
        group_name: "Vega 5",
        session_date: "2026-08-25",
        court: 7,
        coach_notes: "private note",
        recordings: [
          {
            broadcast_id: "abc123",
            court: 7,
            court_name: "Bana 7",
            start_time: "2026-08-25T18:30:00",
            internal_provider_state: "secret",
          },
        ],
      },
    ],
    can_cancel_session: true,
  });

  assert.deepEqual(projected, [
    {
      group_name: "Vega 5",
      session_date: "2026-08-25",
      court: 7,
      courts: null,
      recordings: [
        {
          broadcast_id: "abc123",
          court: 7,
          court_name: "Bana 7",
          start_time: "2026-08-25T18:30:00",
        },
      ],
    },
  ]);
});
