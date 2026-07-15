import { cookies } from "next/headers";
import { bookingApi, bookingPublicEnabled, proxyJson, validBookingId } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  if (!bookingPublicEnabled) {
    return Response.json({ detail: "Bokningspiloten är inte öppen ännu" }, { status: 503 });
  }
  const { bookingId } = await params;
  if (!validBookingId(bookingId)) {
    return Response.json({ detail: "Ogiltigt bokningsnummer" }, { status: 400 });
  }
  const token = (await cookies()).get(`tb_booking_${bookingId}`)?.value;
  if (!token) return Response.json({ detail: "Bokningen finns inte i den här webbläsaren" }, { status: 403 });
  return proxyJson(await bookingApi(`/bookings/${bookingId}/cancel`, {
    method: "POST",
    headers: { "X-Booking-Token": token },
  }));
}
