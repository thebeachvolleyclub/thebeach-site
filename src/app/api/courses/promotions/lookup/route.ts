import { accountToken, sameOrigin } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { signClientIp, trustedClientIp } from "@/lib/trustedClientIp";

export const dynamic = "force-dynamic";

/**
 * Same-origin BFF for exact promotion-code validation. The browser never gets
 * the App API credential, and the BFF forwards only a proxy-authenticated,
 * HMAC-signed network identity for the platform's durable rate limiter.
 * There is deliberately no promotion list/search endpoint.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 1024) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 413 });
  }

  let payload: { courseId?: unknown; code?: unknown };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 400 });
  }

  const courseId = payload.courseId;
  const code = typeof payload.code === "string" ? payload.code.trim().toUpperCase() : "";
  if (
    typeof courseId !== "number"
    || !Number.isSafeInteger(courseId)
    || courseId <= 0
    || !/^[A-Z0-9][A-Z0-9_-]{2,31}$/.test(code)
  ) {
    return Response.json({ valid: false, lookupVersion: 1 }, { status: 200 });
  }

  const token = await accountToken();
  const signedIp = signClientIp(trustedClientIp(request));
  return proxyAppJson(
    await appApi(
      "/training/promotions/lookup",
      {
        method: "POST",
        body: JSON.stringify({ courseId, code }),
      },
      {
        ...(token ? { token } : {}),
        ...(signedIp ? { signedClientIp: signedIp } : {}),
      },
    ),
  );
}
