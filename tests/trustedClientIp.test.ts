import assert from 'node:assert/strict';
import test from 'node:test';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// @ts-expect-error Node's native TS test runner needs the explicit extension.
import { parseTrustedIp, signIp, INTERNAL_CLIENT_IP_HEADER } from '../src/lib/trustedClientIp.core.ts';

// Trusted-network-identity throttle (Overseer audit thebeach-app-v2-dd5bcd49,
// finding 8): the site trusts ONLY the dedicated internal header that Apache
// strips-and-overwrites — never a caller-supplied X-Real-IP / X-Forwarded-For
// — and fails closed without the deployment secret.

const bag = (h: Record<string, string>) => ({ get: (n: string) => h[n.toLowerCase()] ?? null });

test('reads the dedicated internal header set by the proxy', () => {
  assert.equal(parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '203.0.113.7' })), '203.0.113.7');
});

test('IGNORES caller-supplied X-Real-IP (not overwritten by Apache)', () => {
  // The whole finding-8 fix: a forged X-Real-IP must never become identity.
  assert.equal(parseTrustedIp(bag({ 'x-real-ip': '1.2.3.4' })), null);
});

test('IGNORES caller-supplied X-Forwarded-For', () => {
  assert.equal(parseTrustedIp(bag({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })), null);
});

test('a forged X-Real-IP alongside the real internal header cannot override it', () => {
  const ip = parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '198.51.100.5', 'x-real-ip': '1.2.3.4' }));
  assert.equal(ip, '198.51.100.5');
});

test('no proxy stamp → null (no cookie, no fabrication, safe degrade)', () => {
  assert.equal(parseTrustedIp(bag({})), null);
});

test('deleting/rotating cookies is irrelevant — identity is the IP, not a cookie', () => {
  const withCookie = parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '198.51.100.5', cookie: 'tb_vid=whatever' }));
  const noCookie = parseTrustedIp(bag({ [INTERNAL_CLIENT_IP_HEADER]: '198.51.100.5' }));
  assert.equal(withCookie, '198.51.100.5');
  assert.equal(noCookie, '198.51.100.5');
});

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

test('the versioned Apache config strips-then-sets the internal header', () => {
  // The trust boundary is only real if the proxy config exists and does both.
  const conf = readFileSync(
    fileURLToPath(new URL('../deploy/apache/thebeach-site-clientip.conf', import.meta.url)),
    'utf8',
  );
  assert.match(conf, /RequestHeader\s+unset\s+X-TB-Client-IP\s+early/i, 'must strip inbound copy');
  assert.match(conf, /RequestHeader\s+set\s+X-TB-Client-IP\s+"expr=%\{REMOTE_ADDR\}"/i, 'must set from real peer');
});
