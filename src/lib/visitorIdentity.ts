import "server-only";
import { createHmac, randomBytes } from "node:crypto";

/**
 * Proxy-authenticated visitor identity for anonymous signup throttling
 * (Overseer audit thebeach-app-v2-dd5bcd49).
 *
 * The site is the trusted proxy: it mints a stable per-browser opaque id
 * (cookie `tb_vid`) and forwards it to the API HMAC-SIGNED with the private
 * VISITOR_SIG_SECRET. The API trusts only a valid signature, so distinct
 * browsers become distinct API buckets (no collapse into the site-container
 * peer) and a direct public-API-key caller cannot forge the identity.
 *
 * NO PUBLIC FALLBACK: the secret must be provided by deployment. When it is
 * unset, no signed identity is issued (the API degrades to its coarse peer
 * bucket) — production must set VISITOR_SIG_SECRET (the SAME value as the API).
 */

const SECRET = process.env.VISITOR_SIG_SECRET ?? "";
export const VISITOR_COOKIE = "tb_vid";

export function isConfigured(): boolean {
  return SECRET.length > 0;
}

/** A fresh opaque visitor id (URL-safe). */
export function mintVisitorId(): string {
  return randomBytes(18).toString("base64url");
}

/** Sign a visitor id; returns null when no secret is configured. */
export function signVisitorId(id: string): { id: string; sig: string } | null {
  if (!SECRET) return null;
  const sig = createHmac("sha256", SECRET).update(id).digest("hex");
  return { id, sig };
}
