import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  accountDeviceId,
  clearIdentityChoice,
  IDENTITY_CHOICE_COOKIE,
  sameOrigin,
  setAccountSession,
} from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";

export const dynamic = "force-dynamic";

const PLAYER_ID = /^\d{1,10}$/;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { userId?: string };
  const playerId = body.userId ?? "";
  if (!PLAYER_ID.test(playerId)) return NextResponse.json({ detail: "Ogiltig användare" }, { status: 422 });
  const challenge = (await cookies()).get(IDENTITY_CHOICE_COOKIE)?.value;
  if (!challenge) return NextResponse.json({ detail: "Valet har gått ut. Logga in igen." }, { status: 401 });

  const upstream = await appApi(
    "/matchmaking/auth/select-identity",
    {
      method: "POST",
      headers: { "X-Identity-Flow": "beachid-v2" },
      body: JSON.stringify({ challenge, player_id: Number(playerId) }),
    },
    { deviceId: await accountDeviceId() ?? undefined },
  );
  const payload = await upstream.json().catch(() => ({})) as {
    detail?: string;
    auth_token?: string | null;
    user?: { id?: string };
  };
  if (!upstream.ok) {
    const response = NextResponse.json(payload, { status: upstream.status });
    if (upstream.status === 401) clearIdentityChoice(response);
    return response;
  }
  if (!payload.user?.id || !payload.auth_token) {
    return NextResponse.json({ detail: "Inloggningssvaret saknade session" }, { status: 502 });
  }
  const response = NextResponse.json({ authenticated: true });
  setAccountSession(response, payload.auth_token);
  clearIdentityChoice(response);
  return response;
}
