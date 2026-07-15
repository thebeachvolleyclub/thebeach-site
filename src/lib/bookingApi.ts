const BOOKING_API_URL = (process.env.BOOKING_API_URL ?? "").replace(/\/$/, "");

export const bookingPublicEnabled =
  process.env.BOOKING_PUBLIC_ENABLED === "true" && Boolean(BOOKING_API_URL);

export async function bookingApi(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  if (!BOOKING_API_URL) {
    return Response.json(
      { detail: "Bokningspiloten är inte konfigurerad ännu" },
      { status: 503 },
    );
  }
  try {
    return await fetch(`${BOOKING_API_URL}${path}`, {
      ...init,
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    return Response.json(
      { detail: "Bokningssystemet svarar inte just nu" },
      { status: 503 },
    );
  }
}

export async function proxyJson(response: Response): Promise<Response> {
  const text = await response.text();
  return new Response(text || "{}", {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export function validBookingId(value: string): boolean {
  return /^[A-Za-z0-9_-]{10,36}$/.test(value);
}
