import { accountToken, sameOrigin } from "@/lib/accountSession";
import { appApi, proxyAppJson, resolveAccountUserId } from "@/lib/appApi";

export const dynamic = "force-dynamic";

/**
 * Create or update a season signup. Works signed-out (anonymous web
 * signup) and signed-in — when a valid account session exists the app
 * user id is attached server-side so the API can upsert the account's
 * single active submission and write profile corrections back to the
 * master registry (same behaviour as the app).
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const body = await request.text();
  const token = await accountToken();
  const userId = token ? await resolveAccountUserId(token) : null;
  return proxyAppJson(
    await appApi("/season-signup/submit", { method: "POST", body }, userId ? { userId } : undefined),
  );
}
