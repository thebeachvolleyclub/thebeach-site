import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

function privateResponse(response: Response) {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET() {
  const token = await accountToken();
  if (!token) {
    return privateResponse(unauthorized());
  }

  return privateResponse(await proxyAppJson(
    await appApi("/booking/memberships/mine", undefined, { token }),
  ));
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return privateResponse(Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 }));
  }
  if (Number(request.headers.get("content-length") ?? 0) > 10_000) {
    return privateResponse(Response.json({ detail: "För stor förfrågan" }, { status: 413 }));
  }
  const token = await accountToken();
  if (!token) return privateResponse(unauthorized());

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const productId = typeof body?.productId === "string" ? body.productId.trim() : "";
  const idempotencyKey = typeof body?.idempotencyKey === "string"
    ? body.idempotencyKey.trim()
    : "";
  const payerAlias = typeof body?.payerAlias === "string" ? body.payerAlias.trim() : "";
  if (!productId || productId.length > 100) {
    return privateResponse(Response.json({ detail: "Välj ett medlemskap" }, { status: 422 }));
  }
  if (idempotencyKey.length < 8 || idempotencyKey.length > 100) {
    return privateResponse(Response.json({ detail: "Köpet saknar ett giltigt försök-ID" }, { status: 422 }));
  }
  if (!payerAlias || !/^[+\d][\d ()-]{7,19}$/.test(payerAlias)) {
    return privateResponse(Response.json({ detail: "Ange ett giltigt Swish-nummer" }, { status: 422 }));
  }

  return privateResponse(await proxyAppJson(await appApi(
    "/booking/memberships/purchases",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        idempotencyKey,
        payerAlias,
        channel: "WEB",
      }),
    },
    { token },
  )));
}
