import "server-only";
import { parseTrustedIp, signIp, isProxyTrusted } from "./trustedClientIp.core";

/**
 * Trusted network identity for anonymous-signup throttling (Overseer audit
 * thebeach-app-v2-dd5bcd49). NOT a caller-minted cookie — the client IP as
 * stamped by our trusted reverse proxy on a dedicated internal header, so a
 * visitor cannot reset their bucket by clearing cookies. Pure logic lives in
 * ./trustedClientIp.core (unit-tested).
 *
 * DEFAULT-CLOSED TRUST BOUNDARY: the parser reads the `X-TB-Client-IP` header
 * ONLY when `TRUST_PROXY_CLIENT_IP` is set — the operator's explicit assertion
 * that the versioned Apache snippet (deploy/apache/thebeach-site-clientip.conf,
 * which strips any inbound copy then stamps the real peer) is installed. If it
 * is NOT set, we read nothing and forward no signed IP, so a client-injected
 * `X-TB-Client-IP` can never become a trusted identity even when the proxy
 * config is absent (the API degrades to its peer bucket + global cap). We never
 * read `X-Real-IP` / `X-Forwarded-For`.
 *
 * FAIL-CLOSED SECRET: CLIENT_IP_SECRET has NO public fallback. Unset ⇒ no
 * signed IP is forwarded. Production MUST set CLIENT_IP_SECRET (the SAME value
 * as the API) AND TRUST_PROXY_CLIENT_IP (only after installing the Apache snippet).
 */
export function proxyClientIpTrusted(): boolean {
  return isProxyTrusted(process.env.TRUST_PROXY_CLIENT_IP);
}

export function trustedClientIp(request: Request): string | null {
  return parseTrustedIp(request.headers, proxyClientIpTrusted());
}

export function signClientIp(ip: string | null): { ip: string; sig: string } | null {
  return signIp(ip, process.env.CLIENT_IP_SECRET ?? "");
}
