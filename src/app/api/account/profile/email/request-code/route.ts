import { accountDeviceId, accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const body = await request.json().catch(() => ({})) as { new_email?: string };
  return proxyAppJson(await appApi(
    "/matchmaking/auth/me/email/request-code",
    { method: "POST", body: JSON.stringify({ new_email: body.new_email }) },
    { token, deviceId: await accountDeviceId() ?? undefined },
  ));
}
