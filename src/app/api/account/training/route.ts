import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();

  // The verified bearer is the identity. Keep it server-side and forward it
  // directly; the retired caller-supplied identity header is no longer accepted.
  return proxyAppJson(await appApi("/training/lookup", undefined, { token }));
}
