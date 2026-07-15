import { NextResponse } from "next/server";
import { bookingPublicEnabled } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { enabled: bookingPublicEnabled, priceSek: 400, slotLengthMinutes: 90 },
    { headers: { "Cache-Control": "no-store" } },
  );
}
