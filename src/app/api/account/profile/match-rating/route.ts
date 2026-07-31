import { accountToken, sameOrigin, unauthorized } from "@/lib/accountSession";
import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

type LookupResult = {
  status?: string;
  rating?: number | null;
  name?: string | null;
  birth_date?: string | null;
  player_id?: number | null;
  badges?: string[] | null;
  gender?: string | null;
  rating_method?: string | null;
};

/**
 * Complete the same trusted rating enrichment used by native onboarding,
 * without exposing the app bearer token to the browser. Profile data must be
 * saved first so the upstream lookup can use Master identity + birthdate.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const token = await accountToken();
  if (!token) return unauthorized();

  const lookupResponse = await appApi(
    "/matchmaking/users/me/lookup-rating",
    undefined,
    { token },
  );
  if (!lookupResponse.ok) return proxyAppJson(lookupResponse);

  const lookup = await lookupResponse.json().catch(() => ({})) as LookupResult;
  if (lookup.status !== "found" || lookup.rating == null) {
    return Response.json({ status: lookup.status ?? "not_found" });
  }

  const applyBody: Record<string, unknown> = { rating: lookup.rating };
  if (lookup.name) applyBody.name = lookup.name;
  if (lookup.birth_date) applyBody.birth_date = lookup.birth_date;
  if (lookup.player_id != null) applyBody.player_id = lookup.player_id;
  if (lookup.badges) applyBody.badges = lookup.badges;
  if (lookup.gender) applyBody.gender = lookup.gender;

  const appliedResponse = await appApi(
    "/matchmaking/users/me/apply-lookup",
    { method: "POST", body: JSON.stringify(applyBody) },
    { token },
  );
  if (!appliedResponse.ok) return proxyAppJson(appliedResponse);

  return Response.json({
    status: "found",
    rating_method: lookup.rating_method ?? null,
    profile: await appliedResponse.json(),
  });
}
