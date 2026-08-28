import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

function privateResponse(response: Response) {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET() {
  const token = await accountToken();
  if (!token) return privateResponse(unauthorized());
  return privateResponse(await proxyAppJson(
    await appApi("/competition-licence/request", undefined, { token }),
  ));
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return privateResponse(Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 }));
  }
  const token = await accountToken();
  if (!token) return privateResponse(unauthorized());
  const body = await request.json().catch(() => null) as { idempotencyKey?: unknown } | null;
  if (!body || typeof body.idempotencyKey !== "string") {
    return privateResponse(Response.json({ detail: "Förfrågan saknar försök-ID" }, { status: 422 }));
  }
  return privateResponse(await proxyAppJson(await appApi(
    "/competition-licence/requests",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idempotency_key: body.idempotencyKey }),
    },
    { token },
  )));
}
