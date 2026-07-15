import { bookingApi, bookingPublicEnabled, proxyJson } from "@/lib/bookingApi";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!bookingPublicEnabled) {
    return Response.json({ detail: "Bokningspiloten är inte öppen ännu" }, { status: 503 });
  }
  return proxyJson(await bookingApi("/venues"));
}
