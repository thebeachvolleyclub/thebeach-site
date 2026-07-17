import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson, resolveAccountUserId } from "@/lib/appApi";

export const dynamic = "force-dynamic";

// The signed-in account's registration (full data + edit-window state).
export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();
  const userId = await resolveAccountUserId(token);
  if (!userId) return unauthorized();
  return proxyAppJson(await appApi("/season-signup/my-submission", undefined, { userId }));
}
