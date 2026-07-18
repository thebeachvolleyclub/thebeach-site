import { createHmac, timingSafeEqual } from "node:crypto";

// Pure, testable signed-sliding-window primitives used by the edge rate
// limiter (clientRateLimit.ts). Kept free of `server-only` so it can be unit
// tested; contains no request/response coupling.

const SECRET = process.env.SIGNUP_RL_SECRET ?? process.env.PROXY_IP_SECRET ?? "tb-signup-rl-v1";

export function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** Recent-hit timestamps (ms) from a signed cookie value. Invalid, missing, or
 *  tampered values yield an empty window (fail closed to "no prior hits"). */
export function readWindow(cookieValue: string | undefined, windowMs: number, now: number): number[] {
  if (!cookieValue) return [];
  const dot = cookieValue.lastIndexOf(".");
  if (dot < 0) return [];
  const payload = cookieValue.slice(0, dot);
  const sig = cookieValue.slice(dot + 1);
  if (!safeEqual(sig, sign(payload))) return [];
  try {
    const arr = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!Array.isArray(arr)) return [];
    return arr.filter((t) => typeof t === "number" && now - t < windowMs);
  } catch {
    return [];
  }
}

export function writeWindow(hits: number[]): string {
  const payload = Buffer.from(JSON.stringify(hits), "utf8").toString("base64url");
  return `${payload}.${sign(payload)}`;
}

/** Within `max` per `windowMs`? Returns ok + the cookie value to set (this
 *  event recorded when ok). */
export function evaluate(
  cookieValue: string | undefined,
  max: number,
  windowMs: number,
  now: number = Date.now(),
): { ok: boolean; cookie: string } {
  const hits = readWindow(cookieValue, windowMs, now);
  if (hits.length >= max) return { ok: false, cookie: writeWindow(hits) };
  hits.push(now);
  return { ok: true, cookie: writeWindow(hits) };
}
