import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await accountToken();
  const response = token
    ? await proxyAppJson(await appApi("/booking/subscriptions/credits/mine", undefined, { token }))
    : unauthorized();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
