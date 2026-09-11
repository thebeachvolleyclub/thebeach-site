import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { validInvoiceId } from "@/lib/coursePayment.core";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ invoiceId: string }> },
) {
  const token = await accountToken();
  if (!token) return unauthorized();
  const { invoiceId } = await context.params;
  if (!validInvoiceId(invoiceId)) {
    return Response.json({ detail: "Ogiltigt faktura-id" }, { status: 400 });
  }
  return proxyAppJson(await appApi(
    `/training/invoices/${encodeURIComponent(invoiceId)}/request-friskvard`,
    { method: "POST", body: JSON.stringify({}) },
    { token },
  ));
}
