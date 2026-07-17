import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

// Known data for the signed-in account, so the web form starts filled in.
// The verified bearer token IS the identity — the upstream API no longer
// accepts a caller-supplied user id for owner-scoped reads.
export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();
  return proxyAppJson(await appApi("/season-signup/prefill", undefined, { token }));
}
