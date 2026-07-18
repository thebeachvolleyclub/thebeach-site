import assert from 'node:assert/strict';
import test from 'node:test';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// @ts-expect-error Node's native TS test runner needs the explicit extension.
import { parseTrustedIp, signIp, isProxyTrusted, INTERNAL_CLIENT_IP_HEADER } from '../src/lib/trustedClientIp.core.ts';

// Trusted-network-identity throttle (Overseer audit thebeach-app-v2-dd5bcd49,
// finding 8): the site trusts the dedicated internal header ONLY when the
// operator has asserted the Apache strip-and-overwrite boundary is installed
// (DEFAULT-CLOSED). It never reads a caller-supplied X-Real-IP / X-Forwarded-For,
// and fails closed without the deployment secret.

const bag = (h: Record<string, string>) => ({ get: (n: string) => h[n.toLowerCase()] ?? null });
const TRUSTED = true;   // proxy trust boundary asserted (TRUST_PROXY_CLIENT_IP set)
const UNTRUSTED = false; // boundary NOT asserted (Apache snippet not installed)

// ---- The env flag is DEFAULT-CLOSED (only explicit opt-in trusts the proxy) --

test('isProxyTrusted defaults closed for unset / empty / typo values', () => {
  for (const v of [undefined, null, '', '  ', '0', 'false', 'no', 'off', 'ture']) {
    assert.equal(isProxyTrusted(v as string | undefined), false, `should be closed for ${JSON.stringify(v)}`);
  }
});

test('isProxyTrusted opens only on an explicit truthy opt-in', () => {
  for (const v of ['1', 'true', 'TRUE', 'yes', ' Yes ']) {
    assert.equal(isProxyTrusted(v), true, `should be open for ${JSON.stringify(v)}`);
  }
});

// ---- DEFAULT-CLOSED degrade: the core of the finding-8 evidence gap ---------

test('proxy trust NOT asserted → injected X-TB-Client-IP is IGNORED (safe degrade)', () => {
  // This is exactly the "absent Apache config" case: a client injects the
  // internal header directly to Next. With the boundary unasserted we read
  // NOTHING, so it can never be signed and forwarded as a trusted identity.
  assert.equal(parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '1.2.3.4' }), UNTRUSTED), null);
});

test('proxy trust NOT asserted → returns null even with a real-looking IP', () => {
  assert.equal(parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '203.0.113.7' }), UNTRUSTED), null);
});

// ---- Boundary asserted (Apache installed): read the stamped header ----------

test('boundary asserted → reads the dedicated internal header', () => {
  assert.equal(parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '203.0.113.7' }), TRUSTED), '203.0.113.7');
});

test('boundary asserted → still IGNORES caller-supplied X-Real-IP', () => {
  assert.equal(parseTrustedIp(bag({ 'x-real-ip': '1.2.3.4' }), TRUSTED), null);
});

test('boundary asserted → still IGNORES caller-supplied X-Forwarded-For', () => {
  assert.equal(parseTrustedIp(bag({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }), TRUSTED), null);
});

test('boundary asserted → a forged X-Real-IP cannot override the stamped internal header', () => {
  const ip = parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '198.51.100.5', 'x-real-ip': '1.2.3.4' }), TRUSTED);
  assert.equal(ip, '198.51.100.5');
});

test('boundary asserted, no stamp → null (safe degrade)', () => {
  assert.equal(parseTrustedIp(bag({}), TRUSTED), null);
});

test('deleting/rotating cookies is irrelevant — identity is the IP, not a cookie', () => {
  const withCookie = parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '198.51.100.5', cookie: 'tb_vid=whatever' }), TRUSTED);
  const noCookie = parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '198.51.100.5' }), TRUSTED);
  assert.equal(withCookie, '198.51.100.5');
  assert.equal(noCookie, '198.51.100.5');
});

// ---- Signing ----------------------------------------------------------------

test('signIp fails closed without a secret', () => {
  assert.equal(signIp('203.0.113.7', ''), null);
  assert.equal(signIp(null, 'secret'), null);
});

test('signIp produces the exact signature the API verifies', () => {
  const secret = 'deploy-secret';
  const signed = signIp('203.0.113.7', secret);
  assert.ok(signed);
  const expected = createHmac('sha256', secret).update('203.0.113.7').digest('hex');
  assert.equal(signed!.sig, expected);
  assert.equal(signed!.ip, '203.0.113.7');
});

// ---- Versioned proxy config -------------------------------------------------

test('the versioned Apache config strips-then-sets the internal header', () => {
  const conf = readFileSync(
    fileURLToPath(new URL('../deploy/apache/thebeach-site-clientip.conf', import.meta.url)),
    'utf8',
  );
  assert.match(conf, /RequestHeader\s+unset\s+X-TB-Client-IP\s+early/i, 'must strip inbound copy');
  assert.match(conf, /RequestHeader\s+set\s+X-TB-Client-IP\s+"expr=%\{REMOTE_ADDR\}"/i, 'must set from real peer');
});
