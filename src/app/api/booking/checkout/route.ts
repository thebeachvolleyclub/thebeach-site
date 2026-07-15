import { NextResponse } from "next/server";
import { bookingApi, bookingPublicEnabled } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!bookingPublicEnabled) {
    return NextResponse.json({ detail: "Bokningspiloten är inte öppen ännu" }, { status: 503 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 20_000) {
    return NextResponse.json({ detail: "För stor förfrågan" }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ detail: "Ogiltiga uppgifter" }, { status: 400 });
  }
  // The browser is never allowed to choose channel, price or duration.
  body.channel = "WEB";
  const upstream = await bookingApi("/checkout", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const text = await upstream.text();
  let payload: Record<string, unknown> = {};
  try { payload = JSON.parse(text) as Record<string, unknown>; } catch { /* upstream error */ }
  if (!upstream.ok) {
    return NextResponse.json(payload, { status: upstream.status });
  }
  const bookingId = String(payload.bookingId ?? "");
  const managementToken = String(payload.managementToken ?? "");
  if (!bookingId || !managementToken) {
    return NextResponse.json({ detail: "Bokningssvaret var ofullständigt" }, { status: 502 });
  }
  delete payload.managementToken;
  const response = NextResponse.json(payload, { status: upstream.status });
  response.cookies.set(`tb_booking_${bookingId}`, managementToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: `/api/booking/${bookingId}`,
    maxAge: 60 * 60 * 24 * 60,
  });
  return response;
}
