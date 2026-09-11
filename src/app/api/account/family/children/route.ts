import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { familyChildRequest, familyIdempotencyKey } from "@/lib/familyProfiles.core";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const child = familyChildRequest(await request.json().catch(() => null));
  const key = request.headers.get("Idempotency-Key");
  if (!child || !familyIdempotencyKey(key)) {
    return Response.json({ detail: "Kontrollera barnets uppgifter och bekräfta att du ansvarar för barnet." }, { status: 422 });
  }
  return proxyAppJson(await appApi("/matchmaking/family/children", {
    method: "POST",
    headers: { "Idempotency-Key": key },
    body: JSON.stringify(child),
  }, { token }));
}
