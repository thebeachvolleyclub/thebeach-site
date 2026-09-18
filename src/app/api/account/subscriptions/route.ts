import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();
  const response = await proxyAppJson(await appApi("/booking/subscriptions/mine", undefined, { token }));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
