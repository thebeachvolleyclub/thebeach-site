export const TV_ORIGIN = (process.env.TV_ORIGIN ?? "https://tv.thebeach.one").replace(/\/$/, "");
export const CANONICAL_SITE_HOST = (process.env.CANONICAL_SITE_HOST ?? "thebeach.one").toLowerCase();

export function requestHost(request: Request): string {
  // Apache preserves the browser-visible Host header for this application.
  // Do not let a client-supplied forwarding header override that boundary.
  return (request.headers.get("host") ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();
}

export function isCanonicalSiteRequest(request: Request): boolean {
  return requestHost(request) === CANONICAL_SITE_HOST;
}

export function isTvBrowserRequest(request: Request): boolean {
  return isCanonicalSiteRequest(request) && request.headers.get("origin") === TV_ORIGIN;
}

export function isTvServerRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  return isCanonicalSiteRequest(request) && (!origin || origin === TV_ORIGIN);
}

export function tvCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": TV_ORIGIN,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "private, no-store",
    Vary: "Origin",
  };
}

export function bearerToken(request: Request): string | null {
  const value = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+([^\s]+)$/i.exec(value);
  return match?.[1] ?? null;
}
