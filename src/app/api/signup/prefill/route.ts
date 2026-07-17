import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson, resolveAccountUserId } from "@/lib/appApi";

export const dynamic = "force-dynamic";

// Known data for the signed-in account, so the web form starts filled in.
export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();
  const userId = await resolveAccountUserId(token);
  if (!userId) return unauthorized();
  return proxyAppJson(await appApi("/season-signup/prefill", undefined, { userId }));
}
