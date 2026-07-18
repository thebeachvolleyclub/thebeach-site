import "server-only";

const APP_API_URL = (process.env.APP_API_URL ?? "https://api.beachtv.se").replace(/\/$/, "");
const APP_API_KEY = process.env.APP_API_KEY ?? "thebeach-matchmaking-2026";

export async function appApi(
  path: string,
  init?: RequestInit,
  options?: {
    token?: string;
    userId?: string;
    deviceId?: string;
    // Proxy-authenticated visitor identity (opaque id + HMAC signature), so the
    // API can throttle per visitor instead of per site-container peer.
    visitor?: { id: string; sig: string };
  },
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("X-API-Key", APP_API_KEY);
  if (options?.token) headers.set("Authorization", `Bearer ${options.token}`);
  if (options?.userId) headers.set("X-User-Id", options.userId);
  if (options?.deviceId) headers.set("X-Device-Id", options.deviceId);
  if (options?.visitor) {
    headers.set("X-Visitor-Id", options.visitor.id);
    headers.set("X-Visitor-Sig", options.visitor.sig);
  }
  if (typeof init?.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  try {
    return await fetch(`${APP_API_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    return Response.json(
      { detail: "Kontotjänsten svarar inte just nu" },
      { status: 503 },
    );
  }
}

export async function proxyAppJson(response: Response): Promise<Response> {
  const text = await response.text();
  return new Response(text || "{}", {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export async function appJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof payload?.detail === "string" ? payload.detail : "Något gick fel";
    throw new Error(detail);
  }
  return payload as T;
}