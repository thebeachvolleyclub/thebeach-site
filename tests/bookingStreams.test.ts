import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// @ts-expect-error Node's native TS test runner needs the explicit extension.
import { MASKED_STREAM_LABEL, bookingStreamLabel, hasRequiredStreamConsent } from "../src/lib/bookingStreams.ts";

test("a requested masked recording is labelled honestly without hiding playback", () => {
  assert.equal(
    bookingStreamLabel({ streamRequested: true, videoMasked: true }),
    MASKED_STREAM_LABEL,
  );
  assert.equal(
    MASKED_STREAM_LABEL,
    "Endast ljud och resultat – filmmedgivande saknades",
  );
});

test("new checkout UI requires separate filming consent only for a stream", () => {
  assert.equal(hasRequiredStreamConsent(false, false), true);
  assert.equal(hasRequiredStreamConsent(true, false), false);
  assert.equal(hasRequiredStreamConsent(true, true), true);
});

test("the web gateway forwards only the explicit filming-consent boolean", () => {
  const route = readFileSync(
    fileURLToPath(new URL("../src/app/api/booking/checkout/route.ts", import.meta.url)),
    "utf8",
  );
  assert.match(
    route,
    /streamConsentAttested:\s*body\.streamConsentAttested === true/,
  );
});
