import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

// The signed-in account's registration (full data + edit-window state).
// Identity comes from the verified bearer token only.
export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();
  return proxyAppJson(await appApi("/season-signup/my-submission", undefined, { token }));
}
