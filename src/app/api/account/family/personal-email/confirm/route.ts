import { NextResponse } from "next/server";
import { accountToken, clearIdentityChoice, sameOrigin, setAccountSession, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { familyFailure } from "@/lib/familyProfiles.core";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.new_email === "string" ? body.new_email.trim().toLowerCase() : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{6}$/.test(code) || body.retire_parent_contact !== true) {
    return NextResponse.json({ detail: "Ange koden och bekräfta att föräldrakontakten ska tas bort." }, { status: 422 });
  }
  const upstream = await appApi("/matchmaking/family/personal-email/confirm", {
    method: "POST", body: JSON.stringify({ new_email: email, code, retire_parent_contact: true }),
  }, { token });
  const payload = await upstream.json().catch(() => ({}));
  const headers = { "Cache-Control": "no-store" };
  if (!upstream.ok) return NextResponse.json(familyFailure(payload, "Kunde inte verifiera den egna adressen."), { status: upstream.status, headers });
  if (!payload.user?.id || typeof payload.auth_token !== "string" || !payload.auth_token) {
    return NextResponse.json({ detail: "E-postbytet saknade en giltig session." }, { status: 502, headers });
  }
  const response = NextResponse.json({ authenticated: true, email: payload.email }, { headers });
  setAccountSession(response, payload.auth_token);
  clearIdentityChoice(response);
  return response;
}
