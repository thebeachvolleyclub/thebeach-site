import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.new_email === "string" ? body.new_email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ detail: "Ange barnets egen e-postadress." }, { status: 422 });
  return proxyAppJson(await appApi("/matchmaking/family/personal-email/request", {
    method: "POST", body: JSON.stringify({ new_email: email }),
  }, { token }));
}
