import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { validSubscriptionId } from "@/lib/accountSubscription.core";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ subscriptionId: string }> }) {
  const token = await accountToken();
  if (!token) return unauthorized();
  const { subscriptionId } = await params;
  if (!validSubscriptionId(subscriptionId)) return Response.json({ detail: "Ogiltigt abonnemang" }, { status: 400 });
  const response = await proxyAppJson(await appApi(
    `/booking/subscriptions/${encodeURIComponent(subscriptionId)}/payment`,
    undefined,
    { token },
  ));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
