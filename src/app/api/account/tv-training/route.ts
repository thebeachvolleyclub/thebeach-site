import { appApi, proxyAppJson } from "@/lib/appApi";
import { bearerToken, isTvServerRequest } from "@/lib/tvSessionHandoff.core";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isTvServerRequest(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const token = bearerToken(request);
  if (!token) {
    return Response.json({ detail: "Ogiltig eller utgången TV-session" }, { status: 401 });
  }
  return proxyAppJson(await appApi("/tv/training-recordings", undefined, { token }));
}
