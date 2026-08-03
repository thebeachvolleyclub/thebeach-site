import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { courseInvoiceStatus, validInvoiceId } from "@/lib/coursePayment.core";
import { createCourseSwishPost } from "@/lib/coursePaymentRoute.core";

export const dynamic = "force-dynamic";

// Payment identifiers and upstream implementation details stay server side.
export const POST = createCourseSwishPost({
  accountToken,
  appApi,
  courseInvoiceStatus,
  sameOrigin,
  unauthorized,
  validInvoiceId,
});
