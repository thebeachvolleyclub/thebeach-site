import { cookies } from "next/headers";
import { accountToken } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { bookingApi, proxyJson, validBookingId } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const { bookingId } = await params;
  if (!validBookingId(bookingId)) {
    return Response.json({ detail: "Ogiltigt bokningsnummer" }, { status: 400 });
  }
  const account = await accountToken();
  if (account) {
    return proxyAppJson(await appApi(`/booking/${bookingId}`, undefined, { token: account }));
  }
  // Legacy pre-account website bookings remain manageable from their original
  // browser while the pilot transitions to account ownership.
  const token = (await cookies()).get(`tb_booking_${bookingId}`)?.value;
  if (!token) return Response.json({ detail: "Bokningen finns inte i den här webbläsaren" }, { status: 403 });
  return proxyJson(await bookingApi(`/bookings/${bookingId}`, {
    headers: { "X-Booking-Token": token },
  }));
}
