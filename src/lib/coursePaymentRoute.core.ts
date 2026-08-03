type AccountOptions = { token?: string };
type AppApi = (path: string, init?: RequestInit, options?: AccountOptions) => Promise<Response>;

type CommonDependencies = {
  accountToken: () => Promise<string | null>;
  appApi: AppApi;
  courseInvoiceStatus: (payload: unknown) => string;
  unauthorized: () => Response;
  validInvoiceId: (value: unknown) => value is string;
};

type ChargeDependencies = CommonDependencies & {
  sameOrigin: (request: Request) => boolean;
};

type RouteContext = { params: Promise<{ invoiceId: string }> };

function upstreamDetail(payload: Record<string, unknown>, fallback: string) {
  return typeof payload.detail === "string" ? payload.detail : fallback;
}

function courseSwishReturnUrl(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const locale = new URL(request.url).searchParams.get("locale");
  const target = new URL(locale === "en" ? "/en/training" : "/trana", origin);
  target.searchParams.set("swish-return", "course");
  target.hash = "kurser";
  return target.toString();
}

export function courseSwishDeepLink(payload: Record<string, unknown>, returnUrl: string) {
  const raw = typeof payload.deep_link_url === "string" ? payload.deep_link_url : "";
  try {
    const target = new URL(raw);
    if (target.protocol !== "swish:" || target.hostname !== "paymentrequest") return null;
    if (!target.searchParams.get("token")) return null;
    target.searchParams.set("callbackurl", returnUrl);
    return target.toString();
  } catch {
    return null;
  }
}

export function createCourseSwishPost(dependencies: ChargeDependencies) {
  return async function POST(request: Request, context: RouteContext) {
    if (!dependencies.sameOrigin(request)) {
      return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
    }

    const token = await dependencies.accountToken();
    if (!token) return dependencies.unauthorized();

    const { invoiceId } = await context.params;
    if (!dependencies.validInvoiceId(invoiceId)) {
      return Response.json({ detail: "Okänd faktura" }, { status: 400 });
    }
    const returnUrl = courseSwishReturnUrl(request);
    if (!returnUrl) {
      return Response.json({ detail: "Ogiltig returadress" }, { status: 400 });
    }

    const upstream = await dependencies.appApi(
      `/training/invoices/${encodeURIComponent(invoiceId)}/swish/charge`,
      { method: "POST" },
      { token },
    );
    const payload = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
    if (!upstream.ok) {
      return Response.json(
        { detail: upstreamDetail(payload, "Kunde inte starta Swish") },
        { status: upstream.status },
      );
    }
    const deepLinkUrl = courseSwishDeepLink(payload, returnUrl);
    if (!deepLinkUrl) {
      return Response.json(
        { detail: "Swish kunde inte öppnas" },
        { status: 502 },
      );
    }

    return Response.json(
      { deepLinkUrl },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  };
}

export function createCourseInvoiceStatusGet(dependencies: CommonDependencies) {
  return async function GET(_request: Request, context: RouteContext) {
    const token = await dependencies.accountToken();
    if (!token) return dependencies.unauthorized();

    const { invoiceId } = await context.params;
    if (!dependencies.validInvoiceId(invoiceId)) {
      return Response.json({ detail: "Okänd faktura" }, { status: 400 });
    }

    const upstream = await dependencies.appApi(
      `/training/invoices/${encodeURIComponent(invoiceId)}`,
      undefined,
      { token },
    );
    const payload = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
    if (!upstream.ok) {
      return Response.json(
        { detail: upstreamDetail(payload, "Kunde inte läsa betalningen") },
        { status: upstream.status },
      );
    }

    return Response.json(
      { status: dependencies.courseInvoiceStatus(payload) },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  };
}
