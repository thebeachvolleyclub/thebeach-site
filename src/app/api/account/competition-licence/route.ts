import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { createLicenceRequestPost } from "@/lib/licencePersonnummer.core";

export const dynamic = "force-dynamic";

function privateResponse(response: Response) {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET() {
  const token = await accountToken();
  if (!token) return privateResponse(unauthorized());
  return privateResponse(await proxyAppJson(
    await appApi("/competition-licence/request", undefined, { token }),
  ));
}

export const POST = createLicenceRequestPost({ accountToken, sameOrigin, appApi });
