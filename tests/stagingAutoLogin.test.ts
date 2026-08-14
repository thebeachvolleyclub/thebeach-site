import assert from "node:assert/strict";
import test from "node:test";

import { stagingAutoLoginConfig } from "../src/lib/stagingAutoLogin.core.ts";

const valid = {
  enabled: "true",
  requestHost: "staging.thebeach.one",
  appApiUrl: "https://api.dev.thebeach.one",
  deviceId: "staging-web-instant-login-v1",
};

test("staging auto-login requires the complete isolated staging boundary", () => {
  assert.deepEqual(stagingAutoLoginConfig(valid), { deviceId: valid.deviceId });
  assert.deepEqual(stagingAutoLoginConfig({ ...valid, requestHost: "staging.thebeach.one:443" }), {
    deviceId: valid.deviceId,
  });
});

test("staging auto-login cannot be enabled on production hosts or APIs", () => {
  assert.equal(stagingAutoLoginConfig({ ...valid, requestHost: "thebeach.one" }), null);
  assert.equal(stagingAutoLoginConfig({ ...valid, appApiUrl: "https://api.beachtv.se" }), null);
  assert.equal(stagingAutoLoginConfig({ ...valid, appApiUrl: "http://api.dev.thebeach.one" }), null);
});

test("staging auto-login fails closed for a missing flag or malformed device", () => {
  assert.equal(stagingAutoLoginConfig({ ...valid, enabled: undefined }), null);
  assert.equal(stagingAutoLoginConfig({ ...valid, enabled: "false" }), null);
  assert.equal(stagingAutoLoginConfig({ ...valid, deviceId: "web-device" }), null);
});

test("demo auto-login requires the complete one-container boundary", () => {
  const demo = {
    enabled: "true",
    environment: "demo",
    requestHost: "arena.dev.thebeach.one",
    appApiUrl: "http://app-api:8849",
    deviceId: "demo-web-instant-login-v1",
  };
  assert.deepEqual(stagingAutoLoginConfig(demo), { deviceId: demo.deviceId });
  assert.equal(stagingAutoLoginConfig({ ...demo, environment: "production" }), null);
  assert.equal(stagingAutoLoginConfig({ ...demo, requestHost: "thebeach.one" }), null);
  assert.equal(stagingAutoLoginConfig({ ...demo, appApiUrl: "https://api.beachtv.se" }), null);
  assert.equal(stagingAutoLoginConfig({ ...demo, deviceId: "staging-web-instant-login-v1" }), null);
});
