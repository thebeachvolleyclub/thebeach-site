import { accountToken, sameOrigin } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

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
  return proxyAppJson(
    await appApi("/season-signup/submit", { method: "POST", body }, token ? { token } : undefined),
  );
}
