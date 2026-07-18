import "server-only";

/**
 * Edge rate limiting for anonymous website actions (Overseer audit
 * thebeach-app-v2-dd5bcd49).
 *
 * A SIGNED, per-browser sliding window carried entirely in a cookie:
 *   - No IP header is trusted (the audit's spoofable X-Real-IP / XFF concern) —
 *     the limit is per browser, not per claimed IP.
 *   - Stateless: the window lives in the HMAC-signed cookie, so there is no
 *     server map to grow, reset on restart, or fragment across replicas.
 *   - Tamper-evident: a forged/edited cookie fails the signature check and is
 *     treated as empty.
 * It is a soft control (a visitor can clear cookies); the upstream API keeps an
 * independent bounded backstop, and authoritative per-client throttling for a
 * scaled deployment belongs at the reverse proxy / CDN (infra follow-up).
 *
 * The pure primitives live in ./signedWindow (kept server-only-free so they can
 * be unit tested for tamper/bypass).
 */
export { evaluate, readWindow, writeWindow, sign } from "./signedWindow";
