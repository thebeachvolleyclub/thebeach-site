import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

type AccountProfile = { id?: string };

export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();

  // The training service still identifies callers through X-User-Id. Resolve
  // that id from the opaque account token on the server so it can never be
  // supplied or changed by the browser.
  const account = await appApi("/matchmaking/auth/me", undefined, { token });
  if (!account.ok) return proxyAppJson(account);
  const profile = await account.json() as AccountProfile;
  if (!profile.id) {
    return Response.json({ detail: "Kontot saknar spelaridentitet" }, { status: 502 });
  }

  return proxyAppJson(await appApi("/training/lookup", undefined, { userId: profile.id }));
}
