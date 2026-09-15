type Dependencies = {
  sameOrigin: (request: Request) => boolean;
  accountToken: () => Promise<string | null>;
  unauthorized: () => Response;
  validInvoiceId: (id: unknown) => id is string;
  appApi: (path: string, init?: RequestInit, options?: { token?: string }) => Promise<Response>;
  proxyAppJson: (response: Response) => Promise<Response>;
};

export function createInvoiceEmailRequestPost(dependencies: Dependencies) {
  return async function POST(request: Request, context: { params: Promise<{ invoiceId: string }> }) {
    if (!dependencies.sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
    const token = await dependencies.accountToken();
    if (!token) return dependencies.unauthorized();
    const { invoiceId } = await context.params;
    if (!dependencies.validInvoiceId(invoiceId)) return Response.json({ detail: "Ogiltigt faktura-id" }, { status: 400 });
    // Identity and fee are determined by the App API from the signed-in
    // account and invoice. No browser-supplied fields are forwarded.
    return dependencies.proxyAppJson(await dependencies.appApi(
      `/training/invoices/${encodeURIComponent(invoiceId)}/request-traditional`,
      { method: "POST" },
      { token },
    ));
  };
}
