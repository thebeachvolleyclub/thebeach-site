import { NextResponse } from "next/server";
import {
  accountDeviceId,
  sameOrigin,
  setAccountSession,
  setIdentityChoice,
} from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";

export const dynamic = "force-dynamic";

type FamilyUser = { id: string; player_id?: number; name?: string | null; emoji_icon?: string | null; avatar_thumb_url?: string | null };
type VerifyPayload = {
  user?: { id?: string };
  family_users?: FamilyUser[];
  auth_token?: string | null;
  identity_challenge?: string | null;
};

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { email?: string; code?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  const code = (body.code ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ detail: "Kontrollera e-postadressen och den sexsiffriga koden" }, { status: 422 });
  }
  const upstream = await appApi(
    "/matchmaking/auth/verify-code",
    {
      method: "POST",
      headers: { "X-Identity-Flow": "beachid-v2" },
      body: JSON.stringify({ email, code }),
    },
    { deviceId: await accountDeviceId() ?? undefined },
  );
  const raw = await upstream.text();
  let payload: VerifyPayload & { detail?: string } = {};
  try { payload = JSON.parse(raw) as VerifyPayload & { detail?: string }; } catch { /* handled below */ }
  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status });
  }

  try {
    // Tokens are minted by the verified login itself (verify-code) — the
    // old flow minted them afterwards via the spoofable legacy header,
    // which let any API-key holder become any user (audit 2026-07-17).
    const family = Array.isArray(payload.family_users) ? payload.family_users.filter((item) => item?.id) : [];
    if (family.length > 1) {
      if (!payload.identity_challenge) {
        return NextResponse.json({ detail: "Inloggningssvaret saknade identitetsval" }, { status: 502 });
      }
      const response = NextResponse.json({
        requiresSelection: true,
        familyUsers: family,
      });
      // The verified-email challenge stays HttpOnly. The browser only sends
      // the selected Master BeachID, which the App API checks against the
      // challenge's server-side allow-list before minting a user session.
      setIdentityChoice(response, payload.identity_challenge);
      return response;
    }
    const userId = payload.user?.id;
    if (!userId) return NextResponse.json({ detail: "Inloggningssvaret saknade användare" }, { status: 502 });
    if (!payload.auth_token) return NextResponse.json({ detail: "Inloggningssvaret saknade session" }, { status: 502 });
    const response = NextResponse.json({ authenticated: true });
    setAccountSession(response, payload.auth_token);
    return response;
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Kunde inte skapa webbessionen" },
      { status: 502 },
    );
  }
}
