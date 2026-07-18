import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

/**
 * Profile-setup duplicate flow, option 2: the visitor recognised the masked
 * email on the duplicate alert but no longer has access to that inbox — file
 * a merge request (admin resolves; the user continues creating their profile
 * and is contacted when the merge is handled). The API re-validates that the
 * player is a genuine name-duplicate candidate for this account.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const body = await request.json().catch(() => ({})) as { player_id?: number };
  if (!Number.isInteger(body.player_id)) {
    return Response.json({ detail: "Ogiltig begäran" }, { status: 422 });
  }
  return proxyAppJson(
    await appApi(
      "/matchmaking/users/me/merge-request",
      { method: "POST", body: JSON.stringify({ player_id: body.player_id }) },
      { token },
    ),
  );
}
