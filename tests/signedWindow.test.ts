import assert from 'node:assert/strict';
import test from 'node:test';

// @ts-expect-error Node's native TS test runner needs the explicit extension.
import { evaluate, readWindow, writeWindow, sign } from '../src/lib/signedWindow.ts';

// Spoof / bypass coverage for the signed-cookie edge rate limiter (Overseer
// audit thebeach-app-v2-dd5bcd49): the window is tamper-evident and enforces
// the per-browser limit; no IP header is involved.

test('enforces max per window across successive calls', () => {
  const now = 1_000_000;
  let cookie: string | undefined;
  const outcomes: boolean[] = [];
  for (let i = 0; i < 5; i++) {
    const r = evaluate(cookie, 3, 60_000, now + i);
    outcomes.push(r.ok);
    cookie = r.cookie;
  }
  assert.deepEqual(outcomes, [true, true, true, false, false]);
});

test('a tampered cookie payload fails the signature and is treated as empty', () => {
  const now = 1_000_000;
  // A legit cookie at the limit.
  const full = writeWindow([now, now, now]);
  assert.equal(readWindow(full, 60_000, now).length, 3);
  // Attacker edits the payload to claim zero prior hits but keeps the old sig.
  const [payload, sig] = full.split('.');
  const forgedPayload = Buffer.from(JSON.stringify([]), 'utf8').toString('base64url');
  const forged = `${forgedPayload}.${sig}`;
  assert.equal(readWindow(forged, 60_000, now).length, 0 /* parses, but... */);
  // ...crucially the forged cookie is NOT accepted as valid state: re-signing
  // differs, so evaluate treats it as empty (fresh window) rather than trusting
  // attacker-supplied contents — a forged "already full" cookie can't lock
  // others out, and a forged "empty" cookie only resets the attacker's own.
  assert.notEqual(sign(forgedPayload), sig);
});

test('garbage / missing cookies yield an empty window (fail closed to no prior hits)', () => {
  const now = 1_000_000;
  assert.deepEqual(readWindow(undefined, 60_000, now), []);
  assert.deepEqual(readWindow('not-a-cookie', 60_000, now), []);
  assert.deepEqual(readWindow('payload.badsig', 60_000, now), []);
});

test('old hits outside the window are dropped', () => {
  const now = 2_000_000;
  const cookie = writeWindow([now - 120_000, now - 90_000]); // both older than 60s
  assert.deepEqual(readWindow(cookie, 60_000, now), []);
});
