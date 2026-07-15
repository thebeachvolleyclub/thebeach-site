import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { accountDeviceId, sameOrigin, setAccountDevice } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { email?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ detail: "Ange en giltig e-postadress" }, { status: 422 });
  }
  const deviceId = await accountDeviceId() ?? `web-${randomUUID()}`;
  const upstream = await appApi(
    "/matchmaking/auth/request-code",
    { method: "POST", body: JSON.stringify({ email }) },
    { deviceId },
  );
  const payload = await upstream.json().catch(() => ({})) as { detail?: string };
  const response = upstream.ok
    ? NextResponse.json(
        { success: true, message: "Verifieringskod skickad till din e-post" },
        { headers: { "Cache-Control": "no-store" } },
      )
    : NextResponse.json(payload, {
        status: upstream.status,
        headers: { "Cache-Control": "no-store" },
      });
  setAccountDevice(response, deviceId);
  return response;
}
