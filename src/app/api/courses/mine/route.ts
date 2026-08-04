import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { createMyCourseEnrolmentsGet } from "@/lib/coursePaymentRoute.core";

export const dynamic = "force-dynamic";

// Return a small, customer-safe view used both to reconcile a Swish return and
// to render Mina kurser. Identity and internal pricing/audit data stay in App API.
export const GET = createMyCourseEnrolmentsGet({
  accountToken,
  appApi,
  unauthorized,
});
