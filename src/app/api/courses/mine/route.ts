import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { createMyCourseEnrolmentsGet } from "@/lib/coursePaymentRoute.core";

export const dynamic = "force-dynamic";

// Return only the fields needed to reconcile a Swish browser return.
export const GET = createMyCourseEnrolmentsGet({
  accountToken,
  appApi,
  unauthorized,
});
