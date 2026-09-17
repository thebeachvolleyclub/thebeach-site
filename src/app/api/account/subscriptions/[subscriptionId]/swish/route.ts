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
  const payerAlias = typeof body?.payerAlias === "string" ? body.payerAlias.trim() : "";
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey.trim() : "";
  if (!payerAlias || !/^[+\d][\d ()-]{7,19}$/.test(payerAlias)) {
    return Response.json({ detail: "Ange ett giltigt Swish-nummer" }, { status: 422 });
  }
  if (idempotencyKey.length < 8 || idempotencyKey.length > 100) {
    return Response.json({ detail: "Betalningen saknar ett giltigt försök-ID" }, { status: 422 });
  }
  const response = await proxyAppJson(await appApi(
    `/booking/subscriptions/${encodeURIComponent(subscriptionId)}/swish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payerAlias, idempotencyKey, channel: "WEB" }),
    },
    { token },
  ));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
