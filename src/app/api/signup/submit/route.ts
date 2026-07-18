import { accountToken, sameOrigin } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { visitorIp, rateLimitOk } from "@/lib/clientRateLimit";

export const dynamic = "force-dynamic";

// Anonymous website signups are throttled PER VISITOR at this trusted edge
// (the API only ever sees the site container). Generous enough for the real
// flow (a visitor registers once, maybe edits), strict enough to stop abuse.
const ANON_MAX_PER_HOUR = 15;
const HOUR_MS = 60 * 60 * 1000;

/**
 * Create or update a season signup. Works signed-out (anonymous web
 * signup) and signed-in. When an account session exists, the verified
 * bearer token is forwarded so the API can upsert the account's single
 * active submission and write profile corrections back to the master
 * registry — the API binds identity to the token, never to a
 * caller-supplied user id.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const body = await request.text();
  const token = await accountToken();
  const ip = visitorIp(request);

  // Per-visitor edge throttle for signed-out submitters only (signed-in ones
  // are identified and gated upstream by their account). Forward the real IP
  // so the API's backstop can also key per visitor instead of per container.
  if (!token && !rateLimitOk(`signup-submit:${ip}`, ANON_MAX_PER_HOUR, HOUR_MS)) {
    return Response.json(
      { detail: "För många anmälningar från den här enheten — försök igen om en stund." },
      { status: 429 },
    );
  }

  return proxyAppJson(
    await appApi(
      "/season-signup/submit",
      { method: "POST", body },
      token ? { token, clientIp: ip } : { clientIp: ip },
    ),
  );
}

