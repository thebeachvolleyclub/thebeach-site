import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";
const TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !TYPES.has(file.type) || file.size > 8 * 1024 * 1024) {
    return Response.json({ detail: "Välj en JPEG-, PNG- eller WebP-bild på högst 8 MB" }, { status: 422 });
  }
  const outgoing = new FormData();
  outgoing.set("file", file);
  return proxyAppJson(await appApi(
    "/matchmaking/users/me/avatar",
    { method: "POST", body: outgoing },
    { token },
  ));
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  return proxyAppJson(await appApi("/matchmaking/users/me/avatar", { method: "DELETE" }, { token }));
}
