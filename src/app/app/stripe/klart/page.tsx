import type { Metadata } from "next";
import StripeReturnPanel from "@/components/payments/StripeReturnPanel";

export const metadata: Metadata = { title: "Betalning mottagen", robots: { index: false, follow: false } };

export default function MobileStripePaymentCompletePage() {
  return <StripeReturnPanel mobile />;
}
