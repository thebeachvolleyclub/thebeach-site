import { NextResponse } from "next/server";
import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { bookingPublicEnabled } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  if (!bookingPublicEnabled) {
    return NextResponse.json({ detail: "Bokningspiloten är inte öppen ännu" }, { status: 503 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 20_000) {
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
  // The browser never chooses contact identity, payer, price or duration.
  const allowed = {
    venueId: body.venueId,
    courtId: body.courtId,
    date: body.date,
    startTime: body.startTime,
    streamRequested: body.streamRequested === true,
    clientReference: body.clientReference,
    channel: "WEB",
  };
  const upstream = await appApi("/booking/checkout", {
    method: "POST",
    body: JSON.stringify(allowed),
  }, { token });
  const text = await upstream.text();
  let payload: Record<string, unknown> = {};
  try { payload = JSON.parse(text) as Record<string, unknown>; } catch { /* upstream error */ }
  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status });
  }
  if (!payload.bookingId) return NextResponse.json({ detail: "Bokningssvaret var ofullständigt" }, { status: 502 });
  delete payload.managementToken;
  return NextResponse.json(payload, { status: upstream.status });
}
