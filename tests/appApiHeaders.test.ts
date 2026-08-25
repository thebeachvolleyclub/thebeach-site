import assert from "node:assert/strict";
import test from "node:test";

import { APP_API_CALLER, appApiHeaders } from "../src/lib/appApiHeaders.core.ts";

test("server-side App API requests carry a stable non-identifying caller label", () => {
  const headers = appApiHeaders("key", "secret", { Accept: "application/json" });
  assert.equal(headers.get("X-API-Key"), "key");
  assert.equal(headers.get("X-TheBeach-Caller"), "thebeach-site");
  assert.equal(
    headers.get("X-TheBeach-Caller-Sig"),
    "84d9514b984f4685613f335a159835c66bcb7601d76a44beaed7f4ace244a631",
  );
  assert.equal(headers.get("Accept"), "application/json");
  assert.equal(APP_API_CALLER, "thebeach-site");
});

test("caller attribution fails closed without the server secret", () => {
  const headers = appApiHeaders("key", "");
  assert.equal(headers.get("X-API-Key"), "key");
  assert.equal(headers.get("X-TheBeach-Caller"), null);
  assert.equal(headers.get("X-TheBeach-Caller-Sig"), null);
});
