import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson, resolveAccountUserId } from "@/lib/appApi";

export const dynamic = "force-dynamic";

// Cancel the signed-in account's registration (while edits are unlocked).
export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const token = await accountToken();
  if (!token) return unauthorized();
  const userId = await resolveAccountUserId(token);
  if (!userId) return unauthorized();
  return proxyAppJson(
    await appApi("/season-signup/my-submission/cancel", { method: "POST" }, { userId }),
  );
}
