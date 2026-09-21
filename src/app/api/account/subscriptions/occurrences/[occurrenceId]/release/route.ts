import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { validSubscriptionId } from "@/lib/accountSubscription.core";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ occurrenceId: string }> }) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const { occurrenceId } = await params;
  if (!validSubscriptionId(occurrenceId)) return Response.json({ detail: "Ogiltig abonnemangstid" }, { status: 400 });
  const response = await proxyAppJson(await appApi(
    `/booking/subscriptions/occurrences/${encodeURIComponent(occurrenceId)}/release`,
    { method: "POST" },
    { token },
  ));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
