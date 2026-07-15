import { bookingApi, bookingPublicEnabled, proxyJson } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!bookingPublicEnabled) {
    return Response.json({ detail: "Bokningspiloten är inte öppen ännu" }, { status: 503 });
  }
  const url = new URL(request.url);
  const venueId = url.searchParams.get("venueId") ?? "";
  const date = url.searchParams.get("date") ?? "";
  if (!/^[A-Za-z0-9_-]{2,36}$/.test(venueId) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ detail: "Ogiltigt datum eller anläggning" }, { status: 400 });
  }
  const query = new URLSearchParams({ venueId, date });
  return proxyJson(await bookingApi(`/availability?${query.toString()}`));
}
