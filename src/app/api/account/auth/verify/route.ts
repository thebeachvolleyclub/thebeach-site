import { NextResponse } from "next/server";
import {
  accountDeviceId,
  sameOrigin,
  setAccountSession,
  setFamilyChoice,
} from "@/lib/accountSession";
import { appApi, appJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

type FamilyUser = { id: string; name?: string | null; emoji_icon?: string | null; avatar_thumb_url?: string | null };
type VerifyPayload = { user?: { id?: string }; family_users?: FamilyUser[] };

async function issueToken(userId: string): Promise<string> {
  const response = await appApi(
    "/matchmaking/auth/issue-token",
    { method: "POST", body: JSON.stringify({ device_label: "thebeach.one" }) },
    { userId },
  );
  const payload = await appJson<{ token: string }>(response);
  if (!payload.token) throw new Error("Kunde inte skapa webbessionen");
  return payload.token;
}

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
    { method: "POST", body: JSON.stringify({ email, code }) },
    { deviceId: await accountDeviceId() ?? undefined },
  );
  const raw = await upstream.text();
  let payload: VerifyPayload & { detail?: string } = {};
  try { payload = JSON.parse(raw) as VerifyPayload & { detail?: string }; } catch { /* handled below */ }
  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status });
  }

  try {
    const family = Array.isArray(payload.family_users) ? payload.family_users.filter((item) => item?.id) : [];
    if (family.length > 1) {
      const response = NextResponse.json({ requiresSelection: true, familyUsers: family });
      for (const member of family) setFamilyChoice(response, member.id, await issueToken(member.id));
      return response;
    }
    const userId = payload.user?.id;
    if (!userId) return NextResponse.json({ detail: "Inloggningssvaret saknade användare" }, { status: 502 });
    const response = NextResponse.json({ authenticated: true });
    setAccountSession(response, await issueToken(userId));
    return response;
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Kunde inte skapa webbessionen" },
      { status: 502 },
    );
  }
}
