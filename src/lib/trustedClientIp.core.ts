import { createHmac } from "node:crypto";

// Pure, testable trusted-network-identity logic (no `server-only` / request
// coupling) for the anonymous-signup throttle (Overseer audit
// thebeach-app-v2-dd5bcd49).

export interface HeaderBag {
  get(name: string): string | null;
}

/**
 * The ONE header the site trusts for the client IP. It is set AUTHORITATIVELY
 * by our reverse proxy (Apache), which strips any inbound copy first — see
 * deploy/apache/thebeach-site-clientip.conf. It is deliberately NOT a header a
 * client can set end-to-end: we do NOT read `X-Real-IP` or `X-Forwarded-For`
 * here, because both are caller-supplied at the app layer and Apache does not
 * currently overwrite them. The name is distinctive so a client-sent value is
 * unmistakable and gets unset at the edge.
 */
export const INTERNAL_CLIENT_IP_HEADER = "x-tb-client-ip";

/**
 * The client IP as stamped by our trusted reverse proxy on the dedicated
 * internal header. Returns null when the proxy did not stamp it (e.g. the
 * Apache rewrite is not deployed) — the caller then forwards no signed IP and
 * the API degrades to its coarse peer bucket + global cap. We never fall back
 * to a caller-controllable header, so a forged `X-Real-IP` can never become a
 * trusted signed identity.
 */
export function parseTrustedIp(headers: HeaderBag): string | null {
  const stamped = headers.get(INTERNAL_CLIENT_IP_HEADER);
  if (stamped) {
    const ip = stamped.trim().slice(0, 64);
    if (ip) return ip;
  }
  return null;
}

/** Sign a client IP with the deployment secret. Returns null when the secret
 *  is unset (fail-closed: no signed identity is issued) or there is no IP. */
export function signIp(ip: string | null, secret: string): { ip: string; sig: string } | null {
  if (!secret || !ip) return null;
  return { ip, sig: createHmac("sha256", secret).update(ip).digest("hex") };
}
