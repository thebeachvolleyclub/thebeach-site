import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { accountDeviceId, sameOrigin, setAccountDevice } from "@/lib/accountSession";
import { completedAccountLoginResponse, type VerifiedLoginPayload } from "@/lib/accountLogin";
import { appApi } from "@/lib/appApi";
import { stagingAutoLoginConfig } from "@/lib/stagingAutoLogin.core";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { email?: string };
  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ detail: "Ange en giltig e-postadress" }, { status: 422 });
  }

  const stagingLogin = stagingAutoLoginConfig({
    enabled: process.env.APP_ENV === "demo"
      ? process.env.DEMO_AUTO_LOGIN
      : process.env.STAGING_AUTO_LOGIN,
    environment: process.env.APP_ENV,
    requestHost: request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
    appApiUrl: process.env.APP_API_URL,
    deviceId: process.env.APP_ENV === "demo"
      ? process.env.DEMO_AUTO_LOGIN_DEVICE_ID
      : process.env.STAGING_AUTO_LOGIN_DEVICE_ID,
  });
  if (stagingLogin) {
    const upstream = await appApi(
      "/matchmaking/auth/verify-code",
      {
        method: "POST",
        headers: { "X-Identity-Flow": "beachid-v2" },
        // The isolated API recognizes the server-only staging/demo device and
        // therefore ignores this placeholder. It is never accepted by prod.
        body: JSON.stringify({ email, code: "000000" }),
      },
      { deviceId: stagingLogin.deviceId },
    );
    const raw = await upstream.text();
    let payload: VerifiedLoginPayload = {};
    try { payload = JSON.parse(raw) as VerifiedLoginPayload; } catch { /* handled below */ }
    if (!upstream.ok) {
      return NextResponse.json(payload, {
        status: upstream.status,
        headers: { "Cache-Control": "no-store" },
      });
    }
    const response = completedAccountLoginResponse(payload);
    setAccountDevice(response, stagingLogin.deviceId);
    return response;
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
