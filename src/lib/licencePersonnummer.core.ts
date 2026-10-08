import type { LicenceRequest } from "./accountCompetitionLicence.core";

export const LICENCE_PERSONNUMMER_ERROR = "Ange ett giltigt personnummer med 12 siffror, ÅÅÅÅMMDD-XXXX.";

/** Full century is mandatory; assigned dates are not compared with profile DOB. */
export function normalizeLicencePersonnummer(value: unknown, now = new Date()): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^(?:[0-9]{12}|[0-9]{8}-[0-9]{4})$/.test(trimmed)) return null;
  const digits = trimmed.replace("-", "");
  const year = Number(digits.slice(0, 4)), month = Number(digits.slice(4, 6)), day = Number(digits.slice(6, 8));
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (year < 1 || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit" }).format(now).replaceAll("-", "");
  if (digits.slice(0, 8) > today) return null;
  const sum = [...digits.slice(2)].reduce((total, digit, index) => {
    const weighted = Number(digit) * (index % 2 === 0 ? 2 : 1);
    return total + (weighted > 9 ? weighted - 9 : weighted);
  }, 0);
  return sum % 10 === 0 ? digits : null;
}

type Dependencies = {
  accountToken: () => Promise<string | null>;
  sameOrigin: (request: Request) => boolean;
  appApi: (path: string, init?: RequestInit, options?: { token?: string }) => Promise<Response>;
};

const privateJson = (data: unknown, status: number) => Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
const publicText = (value: unknown) => typeof value === "string" ? value.replace(/[0-9]{8}-?[0-9]{4}/g, "[uppgift utelämnad]") : null;

/** Do not proxy Pydantic input/context or any staff-only field back to the client. */
export function customerLicenceRequest(value: unknown): LicenceRequest | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const statuses = ["pending", "in_progress", "completed", "rejected", "cancelled"];
  if (!Number.isSafeInteger(row.id) || Number(row.id) <= 0 || !Number.isSafeInteger(row.membership_year)
    || typeof row.status !== "string" || !statuses.includes(row.status) || typeof row.created_at !== "string" || typeof row.membership_type !== "string") return null;
  return {
    id: Number(row.id), membership_year: Number(row.membership_year), status: row.status as LicenceRequest["status"],
    membership_type: publicText(row.membership_type) ?? "", created_at: publicText(row.created_at) ?? "",
    status_note: publicText(row.status_note),
  };
}

export function createLicenceRequestPost(deps: Dependencies) {
  return async (request: Request): Promise<Response> => {
    if (!deps.sameOrigin(request)) return privateJson({ detail: "Ogiltig förfrågan" }, 403);
    const token = await deps.accountToken();
    if (!token) return privateJson({ detail: "Logga in för att fortsätta" }, 401);
    const value: unknown = await request.json().catch(() => null);
    const body = value && typeof value === "object" ? value as Record<string, unknown> : {};
    if (typeof body.idempotencyKey !== "string" || !/^[A-Za-z0-9._:-]{12,128}$/.test(body.idempotencyKey)) {
      return privateJson({ detail: "Förfrågan saknar giltigt försök-ID" }, 422);
    }
    const personnummer = normalizeLicencePersonnummer(body.personnummer);
    if (!personnummer) return privateJson({ detail: LICENCE_PERSONNUMMER_ERROR }, 422);
    const upstream = await deps.appApi("/competition-licence/requests", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idempotency_key: body.idempotencyKey, personnummer }),
    }, { token });
    if (!upstream.ok) {
      // Validation input/context and arbitrary upstream errors may contain the
      // number. Keep status but return only a fixed customer-safe explanation.
      const detail = upstream.status === 422 ? LICENCE_PERSONNUMMER_ERROR
        : upstream.status === 401 ? "Logga in igen för att begära tävlingslicens."
          : upstream.status === 403 ? "Du kan inte begära tävlingslicens för detta konto just nu."
            : upstream.status === 409 ? "Begäran kunde inte bekräftas. Uppdatera licensstatus och försök igen med samma uppgifter."
              : "Kunde inte skicka licensbegäran. Försök igen.";
      return privateJson({ detail }, upstream.status);
    }
    const payload = await upstream.json().catch(() => null);
    const customer = customerLicenceRequest(payload?.request);
    if (!customer) return privateJson({ detail: "Kunde inte bekräfta licensbegäran. Uppdatera licensstatus innan du försöker igen." }, 502);
    return privateJson({ request: customer }, upstream.status);
  };
}
