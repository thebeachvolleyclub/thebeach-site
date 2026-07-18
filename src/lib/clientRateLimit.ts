import "server-only";

/**
 * Edge rate limiting for anonymous website actions (Overseer audit
 * thebeach-app-v2-dd5bcd49). The site is the trusted public edge that can see
 * per-visitor addresses; the upstream API only ever sees the site container,
 * so per-visitor throttling MUST happen here.
 *
 * In-memory sliding window, keyed on the real visitor IP. The prod site runs
 * as a single container (`next start`), so one process-local store is the
 * shared store; if the site is ever horizontally scaled this must move to a
 * shared store (e.g. Redis).
 */

/**
 * Real visitor IP, derived only from trusted server-set signals — never a
 * raw browser header. Prefers X-Real-IP (set by our Apache front), then the
 * RIGHT-MOST X-Forwarded-For entry (the hop Apache appends), so a client that
 * pre-seeds X-Forwarded-For can't spoof its identity.
 */
export function visitorIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim().slice(0, 64);
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1].slice(0, 64);
  }
  return "unknown";
}

const buckets = new Map<string, number[]>();
// Bound the number of tracked keys so a flood of distinct visitor IPs can't
// grow memory without limit. Map preserves insertion order, so the first keys
// are the oldest — evict those when over capacity.
const MAX_BUCKETS = 20_000;

function pruneAndBound(now: number, windowMs: number): void {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, hits] of buckets) {
    const live = hits.filter((t) => now - t < windowMs);
    if (live.length === 0) buckets.delete(key);
    else buckets.set(key, live);
  }
  // Still over capacity after pruning expired entries → evict oldest keys.
  while (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next().value;
    if (oldest === undefined) break;
    buckets.delete(oldest);
  }
}

/**
 * Returns true when this key is within `max` events per `windowMs`, recording
 * the event; false when the limit is exceeded (nothing recorded). Key
 * cardinality is bounded.
 *
 * NOTE: this store is process-local. Prod runs one site container, so it is
 * effectively the shared store; if the site is ever horizontally scaled this
 * must move to a shared store (e.g. Redis) to stay coherent. The upstream API
 * keeps an independent signed-IP backstop regardless.
 */
export function rateLimitOk(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  pruneAndBound(now, windowMs);
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}
