import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();
  return proxyAppJson(await appApi("/matchmaking/auth/me", undefined, { token }));
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const profile: Record<string, unknown> = {};
  // check_duplicates/confirm_new_identity: the profile-setup duplicate guard
  // (name/birthdate match against the master registry → duplicate_match on
  // the response instead of silently creating a second identity).
  for (const key of ["name", "description", "emoji_icon", "is_public", "birthdate", "check_duplicates", "confirm_new_identity"] as const) {
    if (body[key] !== undefined) profile[key] = body[key];
  }
  if (typeof profile.name === "string" && (profile.name.trim().length < 2 || profile.name.trim().length > 50)) {
    return Response.json({ detail: "Namnet måste vara 2–50 tecken" }, { status: 422 });
  }
  if (typeof profile.description === "string" && profile.description.length > 255) {
    return Response.json({ detail: "Presentation får vara högst 255 tecken" }, { status: 422 });
  }
  if (profile.birthdate !== undefined && profile.birthdate !== null) {
    const b = typeof profile.birthdate === "string" ? profile.birthdate.trim() : "";
    if (!b) {
      delete profile.birthdate; // empty input = leave unchanged
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(b)) {
      return Response.json({ detail: "Födelsedatum anges som ÅÅÅÅ-MM-DD" }, { status: 422 });
    } else {
      profile.birthdate = b;
    }
  }
  let updatedProfile: Response | null = null;
  if (Object.keys(profile).length) {
    updatedProfile = await appApi(
      "/matchmaking/users/me",
      { method: "PUT", body: JSON.stringify(profile) },
      { token },
    );
    if (!updatedProfile.ok) return proxyAppJson(updatedProfile);
    // A duplicate_match means BeachID creation was deferred pending the
    // user's choice — surface the PUT response directly so the client sees it.
    const peek = await updatedProfile.clone().json().catch(() => ({})) as { duplicate_match?: unknown };
    if (peek?.duplicate_match) return proxyAppJson(updatedProfile);
  }
  if (body.swish_phone !== undefined) {
    const swish = typeof body.swish_phone === "string" ? body.swish_phone.trim() : "";
    if (swish && !/^[+\d][\d ()-]{7,19}$/.test(swish)) {
      return Response.json({ detail: "Ange ett giltigt Swish-nummer" }, { status: 422 });
    }
    const updated = await appApi(
      "/matchmaking/users/me/swish-phone",
      { method: "PUT", body: JSON.stringify({ swish_phone: swish || null }) },
      { token },
    );
    if (!updated.ok) return proxyAppJson(updated);
  }
  return proxyAppJson(await appApi("/matchmaking/auth/me", undefined, { token }));
}
