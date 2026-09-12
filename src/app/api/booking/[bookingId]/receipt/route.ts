import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { validBookingId } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const token = await accountToken();
  if (!token) return unauthorized();
  const { bookingId } = await params;
  if (!validBookingId(bookingId)) {
    return Response.json({ detail: "Ogiltigt bokningsnummer" }, { status: 400 });
  }
  return proxyAppJson(await appApi(
    `/booking/bookings/${encodeURIComponent(bookingId)}/receipt`,
    { method: "POST" },
    { token },
  ));
}
