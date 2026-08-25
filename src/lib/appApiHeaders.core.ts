import { createHmac } from "node:crypto";

export const APP_API_CALLER = "thebeach-site";

export function appApiHeaders(
  apiKey: string,
  callerSecret: string,
  initial?: HeadersInit,
): Headers {
  const headers = new Headers(initial);
  headers.set("X-API-Key", apiKey);
  // Fail closed when the existing server-to-server secret is unavailable.
  // The signature makes this operational attribution trustworthy; it still
  // grants no application authorization.
  if (callerSecret) {
    headers.set("X-TheBeach-Caller", APP_API_CALLER);
    headers.set(
      "X-TheBeach-Caller-Sig",
      createHmac("sha256", callerSecret)
        .update(`caller:${APP_API_CALLER}`)
        .digest("hex"),
    );
  }
  return headers;
}
