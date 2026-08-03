import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { courseInvoiceStatus, validInvoiceId } from "@/lib/coursePayment.core";
import { createCourseInvoiceStatusGet } from "@/lib/coursePaymentRoute.core";

export const dynamic = "force-dynamic";

// The browser receives only normalized status, never signed links or invoice data.
export const GET = createCourseInvoiceStatusGet({
  accountToken,
  appApi,
  courseInvoiceStatus,
  unauthorized,
  validInvoiceId,
});
