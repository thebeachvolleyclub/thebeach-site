import { appApi, proxyAppJson } from "@/lib/appApi";
import { isTvServerRequest } from "@/lib/tvSessionHandoff.core";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isTvServerRequest(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const code = typeof body?.code === "string" ? body.code : "";
  if (!code || code.length > 128) {
    return Response.json({ detail: "Ogiltig eller utgången överlämning" }, { status: 400 });
  }
  return proxyAppJson(await appApi("/tv/session-handoffs/redeem", {
    method: "POST",
    body: JSON.stringify({ code }),
  }));
}
