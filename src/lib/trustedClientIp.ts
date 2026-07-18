import "server-only";
import { parseTrustedIp, signIp } from "./trustedClientIp.core";

/**
 * Trusted network identity for anonymous-signup throttling (Overseer audit
 * thebeach-app-v2-dd5bcd49). NOT a caller-minted cookie — the client IP as
 * seen by our trusted reverse proxy, so a visitor cannot reset their bucket by
 * clearing cookies. Pure logic lives in ./trustedClientIp.core (unit-tested).
 *
 * DEPLOYMENT REQUIREMENT: Apache (the trusted proxy in front of this site)
 * MUST set the client address authoritatively — e.g. `RemoteIPHeader`
 * (mod_remoteip) so `X-Real-IP` / the last `X-Forwarded-For` hop reflect the
 * real peer and cannot be spoofed by a client-supplied header.
 *
 * FAIL-CLOSED SECRET: CLIENT_IP_SECRET has NO public fallback. Unset ⇒ no
 * signed IP is forwarded and the API degrades to its coarse peer bucket +
 * global cap. Production MUST set CLIENT_IP_SECRET (the SAME value as the API).
 */
export function trustedClientIp(request: Request): string | null {
  return parseTrustedIp(request.headers);
}

export function signClientIp(ip: string | null): { ip: string; sig: string } | null {
  return signIp(ip, process.env.CLIENT_IP_SECRET ?? "");
}
