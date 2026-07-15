import { NextResponse } from "next/server";
import { accountToken, clearAccountSession, setAccountSession } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await accountToken();
  if (!token) return NextResponse.json({ authenticated: false });
  const upstream = await appApi("/matchmaking/auth/me", undefined, { token });
  if (!upstream.ok) {
    const response = NextResponse.json({ authenticated: false }, { status: upstream.status === 401 ? 200 : upstream.status });
    if (upstream.status === 401) clearAccountSession(response);
    return response;
  }
  const profile = await upstream.json();
  const response = NextResponse.json({ authenticated: true, profile });
  setAccountSession(response, token);
  return response;
}
