import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { courseInvoiceStatus, validInvoiceId } from "@/lib/coursePayment.core";
import { createCourseSwishPost } from "@/lib/coursePaymentRoute.core";

export const dynamic = "force-dynamic";

// Only the validated Swish handoff reaches the browser; API credentials and
// the rest of the upstream payment response stay server side.
export const POST = createCourseSwishPost({
  accountToken,
  appApi,
  courseInvoiceStatus,
  sameOrigin,
  unauthorized,
  validInvoiceId,
});
