import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";
import { isBirthdateValid, normalizeBirthdate } from "@/lib/birthdate";
import { normalizePersonName, validNameComponent } from "@/lib/personIdentity";
import { isProfileGender } from "@/lib/profileGender.core";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = await accountToken();
  if (!token) return unauthorized();
  return proxyAppJson(await appApi("/matchmaking/identity/onboarding", undefined, { token }));
}

export async function PUT(request: Request) {
  if (!sameOrigin(request)) return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const token = await accountToken();
  if (!token) return unauthorized();
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  if (body.gender !== undefined && !isProfileGender(body.gender)) {
    return Response.json({ detail: "Välj kön: man, kvinna eller icke-binär" }, { status: 422 });
  }
  const firstName = normalizePersonName(typeof body.first_name === "string" ? body.first_name : "");
  const lastName = normalizePersonName(typeof body.last_name === "string" ? body.last_name : "");
  const birthdate = normalizeBirthdate(typeof body.birthdate === "string" ? body.birthdate : "");
  if (!validNameComponent(firstName) || !validNameComponent(lastName) || !birthdate || !isBirthdateValid(birthdate)) {
    return Response.json(
      { detail: "Giltigt förnamn, efternamn och födelsedatum krävs" },
      { status: 422 },
    );
  }
  return proxyAppJson(await appApi(
    "/matchmaking/identity/onboarding/profile",
    {
      method: "PUT",
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        birthdate,
        ...(body.gender !== undefined ? { gender: body.gender } : {}),
      }),
    },
    { token },
  ));
}
