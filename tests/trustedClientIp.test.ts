import assert from 'node:assert/strict';
import test from 'node:test';
import { createHmac } from 'node:crypto';

// @ts-expect-error Node's native TS test runner needs the explicit extension.
import { parseTrustedIp, signIp } from '../src/lib/trustedClientIp.core.ts';

// Trusted-network-identity throttle (Overseer audit thebeach-app-v2-dd5bcd49):
// key on a proxy-set IP, never a caller-minted cookie or a client-controllable
// left-most XFF; fail closed without the deployment secret.

const bag = (h: Record<string, string>) => ({ get: (n: string) => h[n.toLowerCase()] ?? null });

test('prefers proxy-set X-Real-IP', () => {
  assert.equal(parseTrustedIp(bag({ 'x-real-ip': '203.0.113.7' })), '203.0.113.7');
});

test('uses the RIGHT-MOST XFF hop (proxy-appended), not the client left-most', () => {
  // Client tried to spoof "1.2.3.4"; the trusted proxy appended the real peer.
  assert.equal(parseTrustedIp(bag({ 'x-forwarded-for': '1.2.3.4, 203.0.113.9' })), '203.0.113.9');
});

test('no proxy identity → null (no cookie, no fabrication)', () => {
  assert.equal(parseTrustedIp(bag({})), null);
});

test('deleting/rotating cookies is irrelevant — identity is the IP, not a cookie', () => {
  // Same IP regardless of any cookie header present or absent.
  const withCookie = parseTrustedIp(bag({ 'x-real-ip': '198.51.100.5', cookie: 'tb_vid=whatever' }));
  const noCookie = parseTrustedIp(bag({ 'x-real-ip': '198.51.100.5' }));
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
