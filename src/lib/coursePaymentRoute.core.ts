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

    return Response.json(
      { started: true },
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
