import assert from "node:assert/strict";
import test from "node:test";

import { APP_API_CALLER, appApiHeaders } from "../src/lib/appApiHeaders.core.ts";

test("server-side App API requests carry a stable non-identifying caller label", () => {
  const headers = appApiHeaders("key", { Accept: "application/json" });
  assert.equal(headers.get("X-API-Key"), "key");
  assert.equal(headers.get("X-TheBeach-Caller"), "thebeach-site");
  assert.equal(headers.get("Accept"), "application/json");
  assert.equal(APP_API_CALLER, "thebeach-site");
});
