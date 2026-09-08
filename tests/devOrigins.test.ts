import assert from "node:assert/strict";
import { test } from "node:test";
// @ts-expect-error Node's native TypeScript runner needs the explicit extension.
import config from "../next.config.ts";

test("only the two authenticated development website origins are allowed", () => {
  assert.deepEqual(config.allowedDevOrigins, [
    "staging.thebeach.one",
    "arena.dev.thebeach.one",
  ]);
});

test("the shared development origin does not change production output", () => {
  assert.equal(config.output, "standalone");
  assert.equal(config.assetPrefix, undefined);
  assert.equal(config.basePath, undefined);
});
