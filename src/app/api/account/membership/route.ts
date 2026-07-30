import { accountToken, unauthorized } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await accountToken();
  if (!token) {
    const response = unauthorized();
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  const upstream = await appApi("/booking/memberships/mine", undefined, { token });
  const body = await upstream.text();
  return new Response(body || "{}", {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-store",
    },
  });
}
