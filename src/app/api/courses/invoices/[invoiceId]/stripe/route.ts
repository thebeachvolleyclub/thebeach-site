import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { courseInvoiceStatus, validInvoiceId } from "@/lib/coursePayment.core";
import { createCourseStripePost } from "@/lib/coursePaymentRoute.core";

export const dynamic = "force-dynamic";

export const POST = createCourseStripePost({
  accountToken,
  appApi,
  courseInvoiceStatus,
  sameOrigin,
  unauthorized,
  validInvoiceId,
});
