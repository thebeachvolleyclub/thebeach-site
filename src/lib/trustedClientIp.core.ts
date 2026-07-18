import { createHmac } from "node:crypto";

// Pure, testable trusted-network-identity logic (no `server-only` / request
// coupling) for the anonymous-signup throttle (Overseer audit
// thebeach-app-v2-dd5bcd49).

export interface HeaderBag {
  get(name: string): string | null;
}

/**
 * The client IP as seen by our trusted reverse proxy. Reads only proxy-set
 * values (X-Real-IP, or the RIGHT-MOST X-Forwarded-For hop appended by the
 * proxy) — never the client-controllable left-most XFF entry, and never a
 * cookie. Returns null when no proxy identity is present.
 */
export function parseTrustedIp(headers: HeaderBag): string | null {
  const real = headers.get("x-real-ip");
  if (real) return real.trim().slice(0, 64);
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1].slice(0, 64);
  }
  return null;
}

/** Sign a client IP with the deployment secret. Returns null when the secret
 *  is unset (fail-closed: no signed identity is issued) or there is no IP. */
export function signIp(ip: string | null, secret: string): { ip: string; sig: string } | null {
  if (!secret || !ip) return null;
  return { ip, sig: createHmac("sha256", secret).update(ip).digest("hex") };
}
