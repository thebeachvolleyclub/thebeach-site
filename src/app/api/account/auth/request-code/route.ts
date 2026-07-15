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
  const text = await upstream.text();
  const response = new NextResponse(text || "{}", {
    status: upstream.status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
  setAccountDevice(response, deviceId);
  return response;
}
