type AccountOptions = { token?: string };
type AppApi = (path: string, init?: RequestInit, options?: AccountOptions) => Promise<Response>;

type AccountDependencies = {
  accountToken: () => Promise<string | null>;
  appApi: AppApi;
  unauthorized: () => Response;
};

type CommonDependencies = AccountDependencies & {
  courseInvoiceStatus: (payload: unknown) => string;
  validInvoiceId: (value: unknown) => value is string;
};

type ChargeDependencies = CommonDependencies & {
  sameOrigin: (request: Request) => boolean;
  swishQrCode: (paymentRequestToken: string) => Promise<string | null>;
};

type RouteContext = { params: Promise<{ invoiceId: string }> };

function upstreamDetail(payload: Record<string, unknown>, fallback: string) {
  return typeof payload.detail === "string" ? payload.detail : fallback;
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

/**
 * Sidor Swish får returnera till. Enbart våra egna kurssökvägar — en fri
 * returadress vore en öppen omdirigering.
 */
const RETURN_PATHS = /^\/(?:trana|kurser\/[a-z0-9-]{1,80}|en\/(?:training|courses\/[a-z0-9-]{1,80}))$/;

export function safeCourseReturnPath(raw: string | null): string | null {
  if (!raw) return null;
  const path = raw.split("#")[0].split("?")[0];
  return RETURN_PATHS.test(path) ? path : null;
}

function courseSwishReturnUrl(request: Request, invoiceId: string): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const params = new URL(request.url).searchParams;
  const locale = params.get("locale");
  const fallback = locale === "en" ? "/en/training" : "/trana";
  const target = new URL(safeCourseReturnPath(params.get("returnPath")) ?? fallback, origin);
  target.searchParams.set("swish-return", "course");
  target.searchParams.set("invoice", invoiceId);
  target.hash = "kursbetalning";
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
    const returnUrl = courseSwishReturnUrl(request, invoiceId);
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

    const paymentRequestToken = new URL(deepLinkUrl).searchParams.get("token");
    const qrCodeDataUrl = paymentRequestToken
      ? await dependencies.swishQrCode(paymentRequestToken)
      : null;

    return Response.json(
      { deepLinkUrl, ...(qrCodeDataUrl ? { qrCodeDataUrl } : {}) },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  };
}

export function createMyCourseEnrolmentsGet(dependencies: AccountDependencies) {
  return async function GET() {
    const token = await dependencies.accountToken();
    if (!token) return dependencies.unauthorized();

    const upstream = await dependencies.appApi(
      "/training/courses/mine",
      undefined,
      { token },
    );
    const payload = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
    if (!upstream.ok) {
      return Response.json(
        { detail: upstreamDetail(payload, "Kunde inte läsa kursanmälan") },
        { status: upstream.status },
      );
    }

    const enrolments = Array.isArray(payload.enrolments) ? payload.enrolments : [];
    return Response.json(
      {
        enrolments: enrolments.flatMap((value) => {
          const item = record(value);
          if (!item || typeof item.courseId !== "number") return [];
          return [{
            courseId: item.courseId,
            courseName: typeof item.courseName === "string" ? item.courseName : null,
            invoiceId: typeof item.invoiceId === "string" ? item.invoiceId : null,
            status: typeof item.status === "string" ? item.status : "",
            paymentStatus: typeof item.paymentStatus === "string" ? item.paymentStatus : "",
            paymentMethod: typeof item.paymentMethod === "string" ? item.paymentMethod : null,
            grossAmountSek: typeof item.grossAmountSek === "number" ? item.grossAmountSek : null,
            discountAmountSek: typeof item.discountAmountSek === "number" ? item.discountAmountSek : null,
            netAmountSek: typeof item.netAmountSek === "number" ? item.netAmountSek : null,
            waitlistPosition: typeof item.waitlistPosition === "number" ? item.waitlistPosition : null,
            confirmedAt: typeof item.confirmedAt === "string" ? item.confirmedAt : null,
            cancelledAt: typeof item.cancelledAt === "string" ? item.cancelledAt : null,
            createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
          }];
        }),
      },
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
