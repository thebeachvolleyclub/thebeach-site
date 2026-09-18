import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { validSubscriptionId } from "@/lib/accountSubscription.core";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ subscriptionId: string }> }) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const { subscriptionId } = await params;
  if (!validSubscriptionId(subscriptionId)) return Response.json({ detail: "Ogiltigt abonnemang" }, { status: 400 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const termsVersion = typeof body?.termsVersion === "string" ? body.termsVersion.trim() : "";
  if (!termsVersion || termsVersion.length > 64 || body?.personalUseAccepted !== true) {
    return Response.json({ detail: "Godkänn abonnemangsvillkoren" }, { status: 422 });
  }
  const response = await proxyAppJson(await appApi(
    `/booking/subscriptions/${encodeURIComponent(subscriptionId)}/accept`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ termsVersion, personalUseAccepted: true }),
    },
    { token },
  ));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
