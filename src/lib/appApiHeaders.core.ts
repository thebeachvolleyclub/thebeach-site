export const APP_API_CALLER = "thebeach-site";

export function appApiHeaders(
  apiKey: string,
  initial?: HeadersInit,
): Headers {
  const headers = new Headers(initial);
  headers.set("X-API-Key", apiKey);
  // Stable service label for privacy-safe, caller-aware operations telemetry.
  // It is attribution metadata, not authentication or authorization.
  headers.set("X-TheBeach-Caller", APP_API_CALLER);
  return headers;
}
