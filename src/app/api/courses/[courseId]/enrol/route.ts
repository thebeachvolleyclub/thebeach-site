import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

/**
 * Anmälan till kurs. Identiteten är HttpOnly-cookien tb_account_session —
 * webbläsaren kan aldrig skicka med ett eget spelar-id. Idempotency-Key sätts
 * här på servern så att ett dubbelklick inte blir två anmälningar och två
 * fakturor.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ courseId: string }> },
) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }

  const token = await accountToken();
  if (!token) return unauthorized();

  const { courseId } = await context.params;
  if (!/^\d+$/.test(courseId)) {
    return Response.json({ detail: "Okänd kurs" }, { status: 400 });
  }

  let payload: { termsVersion?: unknown; idempotencyKey?: unknown };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 400 });
  }

  const termsVersion = typeof payload.termsVersion === "string" ? payload.termsVersion : "";
  if (!termsVersion) {
    return Response.json({ detail: "Kursvillkoren måste godkännas" }, { status: 400 });
  }

  // Nyckeln kommer från klienten så att ett omförsök efter timeout återanvänder
  // samma anmälan i stället för att skapa en till.
  const clientKey =
    typeof payload.idempotencyKey === "string" && /^[\w-]{8,64}$/.test(payload.idempotencyKey)
      ? payload.idempotencyKey
      : crypto.randomUUID();

  return proxyAppJson(
    await appApi(
      `/training/courses/${courseId}/enrolments`,
      {
        method: "POST",
        body: JSON.stringify({ termsVersion, source: "web" }),
        headers: { "Idempotency-Key": `web-${courseId}-${clientKey}` },
      },
      { token },
    ),
  );
}
