import { NextResponse } from "next/server";
import {
  accountDeviceId, accountToken, clearIdentityChoice,
  sameOrigin, setAccountSession, unauthorized,
} from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { familyPlayerId, familyIdempotencyKey, familyFailure } from "@/lib/familyProfiles.core";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const body = await request.json().catch(() => ({}));
  const playerId = familyPlayerId(body?.player_id);
  const key = request.headers.get("Idempotency-Key");
  if (!playerId || !familyIdempotencyKey(key)) return NextResponse.json({ detail: "Ogiltig profil" }, { status: 422 });
  const upstream = await appApi("/matchmaking/family/switch", {
    method: "POST",
    headers: { "Idempotency-Key": key },
    body: JSON.stringify({ player_id: playerId }),
  }, { token, deviceId: await accountDeviceId() ?? undefined });
  const payload = await upstream.json().catch(() => ({}));
  const headers = { "Cache-Control": "no-store" };
  if (!upstream.ok) {
    // Never reflect any upstream bearer, challenge or private session metadata.
    return NextResponse.json(familyFailure(payload, "Kunde inte byta profil"), { status: upstream.status, headers });
  }
  if (!payload.user?.id || typeof payload.auth_token !== "string" || !payload.auth_token) {
    return NextResponse.json({ detail: "Profilbytet saknade en giltig session" }, { status: 502, headers });
  }
  const response = NextResponse.json({ authenticated: true }, { headers });
  setAccountSession(response, payload.auth_token);
  clearIdentityChoice(response);
  return response;
}
