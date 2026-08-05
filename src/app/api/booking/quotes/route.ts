import { NextResponse } from "next/server";
import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { bookingPublicEnabled, proxyJson } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  if (!bookingPublicEnabled) {
    return NextResponse.json({ detail: "Bokningspiloten är inte öppen ännu" }, { status: 503 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 10_000) {
    return NextResponse.json({ detail: "För stor förfrågan" }, { status: 413 });
  }
  const token = await accountToken();
  if (!token) return unauthorized();
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ detail: "Ogiltiga uppgifter" }, { status: 400 });
  }
  // Only slot identity crosses the browser boundary. Entitlements, price and
  // account identity are resolved from the signed-in App API session.
  const allowed = {
    venueId: body.venueId,
    courtId: body.courtId,
    date: body.date,
    startTime: body.startTime,
    productId: body.productId,
  };
  return proxyJson(await appApi("/booking/quotes", {
    method: "POST",
    body: JSON.stringify(allowed),
  }, { token }));
}
