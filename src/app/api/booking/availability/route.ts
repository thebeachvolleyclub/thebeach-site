import { accountToken } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
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
  const token = await accountToken();

  // The account cookie is HttpOnly. Logged-in visitors therefore resolve
  // identity and pricing through App API, exactly like checkout and the app.
  // Signed-out visitors keep using Booking's public availability contract and
  // only see the ordinary price. The browser never supplies pricing scopes.
  const upstream = token
    ? await appApi(`/booking/availability?${query.toString()}`, undefined, { token })
    : await bookingApi(`/availability?${query.toString()}`);
  return proxyJson(upstream);
}
