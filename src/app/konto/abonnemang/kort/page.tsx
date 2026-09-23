import type { Metadata } from "next";
import SubscriptionCardReturnPanel from "@/components/account/SubscriptionCardReturnPanel";

export const metadata: Metadata = { title: "Kortbetalning — banabonnemang", robots: { index: false, follow: false } };

export default function SubscriptionCardReturnPage() {
  return <SubscriptionCardReturnPanel />;
}
