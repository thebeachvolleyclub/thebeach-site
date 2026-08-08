import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ playerId: string }> },
) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const { playerId } = await context.params;
  if (!/^\d+$/.test(playerId)) {
    return Response.json({ detail: "Ogiltig profil" }, { status: 422 });
  }
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  if (body.decision !== "yes" && body.decision !== "no") {
    return Response.json({ detail: "Du måste svara ja eller nej" }, { status: 422 });
  }
  return proxyAppJson(await appApi(
    `/matchmaking/identity/onboarding/candidates/${playerId}/decision`,
    { method: "POST", body: JSON.stringify({ decision: body.decision }) },
    { token },
  ));
}
