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
 * Whether the operator has ASSERTED the Apache strip-and-overwrite trust
 * boundary is installed (env TRUST_PROXY_CLIENT_IP). DEFAULT-CLOSED: anything
 * other than an explicit truthy opt-in ("1" / "true" / "yes") is false, so an
 * unset/empty/typo'd value means we trust no forwarded IP header.
 */
export function isProxyTrusted(envValue: string | undefined | null): boolean {
  const v = (envValue ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/**
 * The client IP as stamped by our trusted reverse proxy on the dedicated
 * internal header.
 *
 * DEFAULT-CLOSED: `proxyTrusted` must be true — the operator's explicit
 * assertion that the Apache strip-and-overwrite snippet is installed (env
 * TRUST_PROXY_CLIENT_IP). When it is false we return null and read NOTHING,
 * so if the proxy config is absent a client-injected `X-TB-Client-IP` can
 * never be signed and forwarded as a trusted identity — the "absent config
 * safely degrades" property holds by construction, not by hoping the proxy
 * stripped the header. With no trusted stamp the caller forwards no signed IP
 * and the API keys on its coarse peer bucket + global cap.
 *
 * We never fall back to a caller-controllable header (X-Real-IP / XFF).
 */
export function parseTrustedIp(headers: HeaderBag, proxyTrusted: boolean): string | null {
  if (!proxyTrusted) return null; // trust boundary not asserted → trust nothing
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
