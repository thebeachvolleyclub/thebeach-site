import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { courseInvoiceStatus, validInvoiceId } from "@/lib/coursePayment.core";
import { createCourseSwishPost } from "@/lib/coursePaymentRoute.core";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

async function swishQrCode(paymentRequestToken: string): Promise<string | null> {
  try {
    // Swish Q-commerce QR: the m-commerce token prefixed with "D".
    return await QRCode.toDataURL(`D${paymentRequestToken}`, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 300,
      color: { dark: "#000000", light: "#FFFFFF" },
    });
  } catch (cause) {
    console.error("Could not create course Swish QR code", cause);
    return null;
  }
}

// Only the validated Swish handoff reaches the browser; API credentials and
// the rest of the upstream payment response stay server side.
export const POST = createCourseSwishPost({
  accountToken,
  appApi,
  courseInvoiceStatus,
  sameOrigin,
  swishQrCode,
  unauthorized,
  validInvoiceId,
});
