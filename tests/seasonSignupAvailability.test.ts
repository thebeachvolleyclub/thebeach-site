import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// @ts-expect-error Node's native TS test runner needs the explicit extension.
import { seasonSignupAvailability } from "../src/lib/seasonSignupAvailability.ts";

test("ordinary registration trusts the existing v3 effective gate", () => {
  assert.deepEqual(
    seasonSignupAvailability({ config_version: 3, is_open: true }),
    { state: "open", opensAt: null },
  );
});

test("waiting-list access requires the explicit v4 effective flag", () => {
  assert.deepEqual(
    seasonSignupAvailability({ config_version: 4, is_open: false, waitlist_open: true }),
    { state: "waitlist", opensAt: null },
  );
  assert.deepEqual(
    seasonSignupAvailability({ config_version: 3, is_open: false, waitlist_open: true }),
    { state: "closed", opensAt: null },
  );
});

test("missing, malformed, and contradictory config fails closed", () => {
  assert.deepEqual(seasonSignupAvailability(null), { state: "closed", opensAt: null });
  assert.deepEqual(
    seasonSignupAvailability({ config_version: 4, is_open: "true", waitlist_open: true }),
    { state: "closed", opensAt: null },
  );
  assert.deepEqual(
    seasonSignupAvailability({ config_version: 4, is_open: false, before_open: true, opens_at: "later" }),
    { state: "closed", opensAt: null },
  );
});

test("a valid server-authored future opening is shown without inventing a date", () => {
  assert.deepEqual(
    seasonSignupAvailability({
      config_version: 3,
      is_open: false,
      before_open: true,
      opens_at: "2026-12-01T20:00:00+01:00",
    }),
    { state: "before_open", opensAt: "2026-12-01T20:00:00+01:00" },
  );
});

test("signup and training pages consume the shared fail-closed state", () => {
  const form = readFileSync("src/components/anmalan/SignupFormClient.tsx", "utf8");
  const groups = readFileSync("src/components/trana/TrainingGroups.tsx", "utf8");

  assert.match(form, /latestConfig = await api<Config>\("\/api\/signup\/config"\)/);
  assert.match(form, /latestAvailability\.state !== availability\.state/);
  assert.match(form, /expected_submission_phase: expectedSubmissionPhase/);
  assert.match(form, /cause instanceof ApiError && cause\.status === 409/);
  assert.match(form, /setConfig\(refreshedConfig\)/);
  assert.match(form, /waitlistNoticeTitle: "Fullbokat — väntelista"/);
  assert.match(form, /waitlistNoticeTitle: "Fully booked — waiting list"/);
  assert.match(groups, /fetch\("\/api\/signup\/config"/);
  assert.match(groups, /state: "closed"/);
  assert.match(groups, /seasonSignupAvailability\(config\)/);
});

test("homepage and training page no longer advertise the stale August opening", () => {
  const home = readFileSync("src/lib/i18n/home.ts", "utf8");
  const training = readFileSync("src/lib/i18n/trana.ts", "utf8");

  assert.doesNotMatch(home, /Registration opens 1 Aug|Anmälan öppnar 1 aug/i);
  assert.doesNotMatch(training, /Registration opens 1 Aug|Anmälan öppnar 1 aug/i);
});
