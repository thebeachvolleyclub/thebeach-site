import { cookies } from "next/headers";
import { accountToken, sameOrigin } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { bookingApi, bookingPublicEnabled, proxyJson, validBookingId } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  if (!bookingPublicEnabled) {
    return Response.json({ detail: "Bokningspiloten är inte öppen ännu" }, { status: 503 });
  }
  const { bookingId } = await params;
  if (!validBookingId(bookingId)) {
    return Response.json({ detail: "Ogiltigt bokningsnummer" }, { status: 400 });
  }
  const account = await accountToken();
  if (account) {
    return proxyAppJson(await appApi(`/booking/${bookingId}/cancel`, { method: "POST" }, { token: account }));
  }
  const token = (await cookies()).get(`tb_booking_${bookingId}`)?.value;
  if (!token) return Response.json({ detail: "Bokningen finns inte i den här webbläsaren" }, { status: 403 });
  return proxyJson(await bookingApi(`/bookings/${bookingId}/cancel`, {
    method: "POST",
    headers: { "X-Booking-Token": token },
  }));
}
