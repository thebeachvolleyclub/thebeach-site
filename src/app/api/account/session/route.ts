import { NextResponse } from "next/server";
import { accountToken, accountContext, accountRequestContextChanged, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function GET() {
  if (await accountRequestContextChanged()) return unauthorized();
  const token = await accountToken();
  const context = await accountContext();
  const headers = { "Cache-Control": "no-store" };
  if (!token) return NextResponse.json({ authenticated: false, context }, { headers });
  const upstream = await appApi("/matchmaking/auth/me", undefined, { token });
  if (!upstream.ok) {
    return NextResponse.json({ authenticated: false, context }, { status: upstream.status === 401 ? 200 : upstream.status, headers });
  }
  const profile = await upstream.json();
  // Read requests must never restore an old cookie after a profile switch (or
  // erase a new cookie when an earlier bearer is revoked while in flight).
  return NextResponse.json({ authenticated: true, profile, context }, { headers });
}
