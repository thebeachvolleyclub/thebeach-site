import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();
  return proxyAppJson(await appApi("/training/invoices/mine", undefined, { token }));
}
