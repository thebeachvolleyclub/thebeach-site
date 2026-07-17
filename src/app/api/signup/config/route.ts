import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

// Public: the season-signup window config (copy, slots, prices, edit lock).
export async function GET() {
  return proxyAppJson(await appApi("/season-signup/config"));
}
