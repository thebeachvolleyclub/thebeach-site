import { NextResponse } from "next/server";
import { bookingPublicEnabled } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { enabled: bookingPublicEnabled, pricingMode: "SERVER_AUTHORITATIVE" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
