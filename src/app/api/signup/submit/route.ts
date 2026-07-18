import { accountToken, sameOrigin } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { trustedClientIp, signClientIp } from "@/lib/trustedClientIp";

export const dynamic = "force-dynamic";

/**
 * Create or update a season signup. Anonymous submitters are throttled at the
 * API by a durable per-client-IP + global limiter; this route forwards the
 * trusted network IP (from our reverse proxy) HMAC-signed so the API can key
 * per client rather than per site-container peer. There is deliberately no
 * cookie-based limiter here — a cookie can be cleared to reset it.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const body = await request.text();
  const token = await accountToken();
  const signedIp = signClientIp(trustedClientIp(request));

  return proxyAppJson(
    await appApi(
      "/season-signup/submit",
      { method: "POST", body },
      {
        ...(token ? { token } : {}),
        ...(signedIp ? { signedClientIp: signedIp } : {}),
      },
    ),
  );
}
