import { NextResponse } from "next/server";
import { appApi } from "@/lib/appApi";
import { bookingPublicEnabled } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const upstream = await appApi("/booking/config");
  const payload = (await upstream.json().catch(() => ({}))) as Record<string, unknown>;
  if (!upstream.ok) {
    return NextResponse.json(
      { enabled: false, pricingMode: "SERVER_AUTHORITATIVE", stripeEnabled: false },
      { status: upstream.status, headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(
    {
      enabled: bookingPublicEnabled && payload.enabled === true,
      pricingMode: "SERVER_AUTHORITATIVE",
      stripeEnabled: payload.stripe_enabled === true,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
