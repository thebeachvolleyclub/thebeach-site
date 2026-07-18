import "server-only";
import { parseTrustedIp, signIp } from "./trustedClientIp.core";

/**
 * Trusted network identity for anonymous-signup throttling (Overseer audit
 * thebeach-app-v2-dd5bcd49). NOT a caller-minted cookie — the client IP as
 * stamped by our trusted reverse proxy on a dedicated internal header, so a
 * visitor cannot reset their bucket by clearing cookies. Pure logic lives in
 * ./trustedClientIp.core (unit-tested).
 *
 * TRUST BOUNDARY (enforced, not just requested): the parser reads ONLY the
 * dedicated `X-TB-Client-IP` header, which Apache strips-then-sets from the
 * real peer — see the versioned config deploy/apache/thebeach-site-clientip.conf.
 * We never read `X-Real-IP` / `X-Forwarded-For`, so a forged client header can
 * never become a trusted signed identity. Until that config is deployed the
 * header is absent and we forward no signed IP (safe degrade).
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
