import { NextResponse } from "next/server";
import {
  accountDeviceId,
  sameOrigin,
} from "@/lib/accountSession";
import { completedAccountLoginResponse, type VerifiedLoginPayload } from "@/lib/accountLogin";
import { appApi } from "@/lib/appApi";

export const dynamic = "force-dynamic";

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
  let payload: VerifiedLoginPayload = {};
  try { payload = JSON.parse(raw) as VerifiedLoginPayload; } catch { /* handled below */ }
  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status });
  }

  try {
    // Tokens are minted by the verified login itself (verify-code) — the
    // old flow minted them afterwards via the spoofable legacy header,
    // which let any API-key holder become any user (audit 2026-07-17).
    return completedAccountLoginResponse(payload);
  } catch (error) {
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "Kunde inte skapa webbessionen" },
      { status: 502 },
    );
  }
}
