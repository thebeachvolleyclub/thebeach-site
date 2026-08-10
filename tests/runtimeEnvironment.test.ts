import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  isDemoHostname,
  parseAppEnvironment,
  responseEnvironmentMatches,
  serviceEndpoint,
} from "../src/lib/runtimeEnvironment.core.ts";

test("recognizes only the explicit demo hostname namespace", () => {
  assert.equal(isDemoHostname("arena.dev.thebeach.one"), true);
  assert.equal(isDemoHostname("ADMIN.DEV.THEBEACH.ONE."), true);
  assert.equal(isDemoHostname("thebeach.one"), false);
  assert.equal(isDemoHostname("dev.thebeach.one.evil.example"), false);
});

test("accepts only the two supported runtime environments", () => {
  assert.equal(parseAppEnvironment(undefined), "production");
  assert.equal(parseAppEnvironment("production"), "production");
  assert.equal(parseAppEnvironment("DEMO"), "demo");
  assert.throws(() => parseAppEnvironment("staging"), /Unsupported APP_ENV/);
});

test("demo endpoints cannot fall back to production or the host gateway", () => {
  assert.equal(
    serviceEndpoint("APP_API_URL", "http://app-api:8849", "demo"),
    "http://app-api:8849",
  );
  assert.equal(
    serviceEndpoint("APP_API_URL", "https://api.dev.thebeach.one/", "demo"),
    "https://api.dev.thebeach.one",
  );
  assert.throws(
    () => serviceEndpoint("APP_API_URL", undefined, "demo", "https://api.beachtv.se"),
    /must be configured in demo/,
  );
  assert.throws(
    () => serviceEndpoint("APP_API_URL", "https://api.beachtv.se", "demo"),
    /isolated demo service/,
  );
  assert.throws(
    () => serviceEndpoint("APP_API_URL", "http://host.docker.internal:8849", "demo"),
    /isolated demo service/,
  );
  assert.throws(
    () => serviceEndpoint("APP_API_URL", "https://api.dev.thebeach.one", "production"),
    /must not point to a demo service/,
  );
});

test("demo requires an explicit response environment marker", () => {
  assert.equal(responseEnvironmentMatches("demo", "demo"), true);
  assert.equal(responseEnvironmentMatches("demo", null), false);
  assert.equal(responseEnvironmentMatches("demo", "production"), false);
  assert.equal(responseEnvironmentMatches("production", null), true);
  assert.equal(responseEnvironmentMatches("production", "demo"), false);
});

test("demo chrome and analytics use runtime hostname detection", () => {
  const chrome = readFileSync(
    "src/components/RuntimeEnvironmentChrome.tsx",
    "utf8",
  );
  const analytics = readFileSync(
    "src/components/Analytics.tsx",
    "utf8",
  );
  assert.match(chrome, /syntetisk testdata/);
  assert.match(chrome, /inga riktiga betalningar/);
  assert.match(analytics, /isDemoHostname\(window\.location\.hostname\)/);
});
