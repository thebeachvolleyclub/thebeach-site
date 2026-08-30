import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  bearerToken,
  isCanonicalSiteRequest,
  isTvBrowserRequest,
  isTvServerRequest,
  tvCorsHeaders,
} from "../src/lib/tvSessionHandoff.core.ts";

function request(headers: Record<string, string> = {}) {
  return new Request("https://thebeach.one/api/account/tv-handoff", { headers });
}

test("TV handoffs accept only the exact canonical host and TV browser origin", () => {
  const valid = request({ host: "thebeach.one", origin: "https://tv.thebeach.one" });
  assert.equal(isCanonicalSiteRequest(valid), true);
  assert.equal(isTvBrowserRequest(valid), true);
  assert.equal(
    isTvBrowserRequest(
      request({
        host: "thebeach.one",
        "x-forwarded-host": "evil.example",
        origin: "https://tv.thebeach.one",
      }),
    ),
    true,
  );
  assert.equal(
    isTvBrowserRequest(
      request({
        host: "evil.example",
        "x-forwarded-host": "thebeach.one",
        origin: "https://tv.thebeach.one",
      }),
    ),
    false,
  );
  assert.equal(isTvBrowserRequest(request({ host: "www.thebeach.one", origin: "https://tv.thebeach.one" })), false);
  assert.equal(isTvBrowserRequest(request({ host: "thebeach.one", origin: "https://evil.example" })), false);
  assert.equal(isTvBrowserRequest(request({ host: "thebeach.one" })), false);
});

test("server proxy permits no Origin but rejects unrelated browser origins", () => {
  assert.equal(isTvServerRequest(request({ host: "thebeach.one" })), true);
  assert.equal(isTvServerRequest(request({ host: "thebeach.one", origin: "https://tv.thebeach.one" })), true);
  assert.equal(isTvServerRequest(request({ host: "thebeach.one", origin: "https://evil.example" })), false);
});

test("handoff CORS is credentialed, exact-origin, and never cacheable", () => {
  const headers = new Headers(tvCorsHeaders());
  assert.equal(headers.get("access-control-allow-origin"), "https://tv.thebeach.one");
  assert.equal(headers.get("access-control-allow-credentials"), "true");
  assert.equal(headers.get("cache-control"), "private, no-store");
  assert.equal(headers.get("vary"), "Origin");
});

test("training proxy accepts only a narrow bearer header", () => {
  assert.equal(bearerToken(request({ authorization: "Bearer narrow-token" })), "narrow-token");
  assert.equal(bearerToken(request({ authorization: "Basic nope" })), null);
  assert.equal(bearerToken(request({ authorization: "Bearer two tokens" })), null);
});

test("website routes keep the broad account bearer away from BeachTV", () => {
  const issue = readFileSync("src/app/api/account/tv-handoff/route.ts", "utf8");
  const redeem = readFileSync("src/app/api/account/tv-handoff/redeem/route.ts", "utf8");
  const training = readFileSync("src/app/api/account/tv-training/route.ts", "utf8");
  const session = readFileSync("src/lib/accountSession.ts", "utf8");

  assert.match(issue, /accountToken\(\)/);
  assert.match(issue, /\/tv\/session-handoffs/);
  assert.match(redeem, /\/tv\/session-handoffs\/redeem/);
  assert.match(training, /\/tv\/training-recordings/);
  assert.doesNotMatch(session, /Domain=.thebeach.one|domain:\s*["']\.thebeach.one/);
  assert.doesNotMatch(issue, /Set-Cookie|response\.cookies/);
});
