import { NextResponse } from "next/server";
import { accountToken, accountRequestContextChanged, unauthorized, clearAccountSession, clearIdentityChoice, sameOrigin } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  if (await accountRequestContextChanged()) return unauthorized();
  const token = await accountToken();
  if (token) {
    await appApi("/matchmaking/auth/revoke-token", { method: "POST", body: "{}" }, { token });
  }
  const response = NextResponse.json({ success: true });
  clearAccountSession(response);
  clearIdentityChoice(response);
  return response;
}
