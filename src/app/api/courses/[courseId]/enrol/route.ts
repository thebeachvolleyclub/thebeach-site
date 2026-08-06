import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

/**
 * Kampanj- och värvningskoder normaliseras redan här: trimmade, versaliserade
 * och begränsade till A–Z, 0–9 och bindestreck. Plattformen versaliserar också,
 * men vi vill inte skicka vidare fritext som råkat hamna i fältet. Tomt fält
 * utelämnas helt — det är inte samma sak som en ogiltig kod.
 */
function normalizeCode(value: unknown): string | null | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase();
  if (!code) return undefined;
  return /^[A-Z0-9-]{1,32}$/.test(code) ? code : null;
}

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

  let payload: {
    termsVersion?: unknown;
    idempotencyKey?: unknown;
    promotionCode?: unknown;
    referralCode?: unknown;
  };
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

  const promotionCode = normalizeCode(payload.promotionCode);
  if (promotionCode === null) {
    return Response.json({ detail: "Kampanjkoden har ett ogiltigt format" }, { status: 400 });
  }
  const referralCode = normalizeCode(payload.referralCode);
  if (referralCode === null) {
    return Response.json({ detail: "Värvningskoden har ett ogiltigt format" }, { status: 400 });
  }

  return proxyAppJson(
    await appApi(
      `/training/courses/${courseId}/enrolments`,
      {
        method: "POST",
        body: JSON.stringify({
          termsVersion,
          source: "web",
          ...(promotionCode ? { promotionCode } : {}),
          ...(referralCode ? { referralCode } : {}),
        }),
        headers: { "Idempotency-Key": `web-${courseId}-${clientKey}` },
      },
      { token },
    ),
  );
}
