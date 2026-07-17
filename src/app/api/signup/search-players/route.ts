import { appApi, proxyAppJson } from "@/lib/appApi";

export const dynamic = "force-dynamic";

// Public: inline master-registry name search for wish/requirement targets.
// Returns names (+ age for duplicate disambiguation) only — no contact info.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return Response.json({ results: [] });
  return proxyAppJson(
    await appApi(`/season-signup/search-players?q=${encodeURIComponent(q)}`),
  );
}
