import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { validInvoiceId } from "@/lib/coursePayment.core";
import { createInvoiceEmailRequestPost } from "@/lib/accountInvoiceRoute.core";

export const dynamic = "force-dynamic";

export const POST = createInvoiceEmailRequestPost({ accountToken, sameOrigin, unauthorized, validInvoiceId, appApi, proxyAppJson });
