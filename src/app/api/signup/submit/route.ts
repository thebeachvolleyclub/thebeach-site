import { NextResponse } from "next/server";
import { accountToken, sameOrigin } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { evaluate } from "@/lib/clientRateLimit";

export const dynamic = "force-dynamic";

// Anonymous website signups are throttled PER BROWSER at this trusted edge via
// a signed cookie (no spoofable IP header is trusted; stateless so it stays
// coherent across restart/scaling). Generous enough for the real flow (a
// visitor registers once, maybe edits), strict enough to blunt casual abuse.
const ANON_MAX_PER_HOUR = 15;
const HOUR_MS = 60 * 60 * 1000;
const RL_COOKIE = "tb_su_rl";

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const body = await request.text();
  const token = await accountToken();

  // Signed-in submitters are identified and gated upstream by their account;
  // only throttle signed-out ones here.
  let setCookie: string | null = null;
  if (!token) {
    const current = request.headers
      .get("cookie")
      ?.split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${RL_COOKIE}=`))
      ?.slice(RL_COOKIE.length + 1);
    const { ok, cookie } = evaluate(current, ANON_MAX_PER_HOUR, HOUR_MS);
    if (!ok) {
      const res = NextResponse.json(
        { detail: "För många anmälningar från den här enheten — försök igen om en stund." },
        { status: 429 },
      );
      res.cookies.set(RL_COOKIE, cookie, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 3600 });
      return res;
    }
    setCookie = cookie;
  }

  const upstream = await appApi("/season-signup/submit", { method: "POST", body }, token ? { token } : undefined);
  const text = await upstream.text();
  const res = new NextResponse(text || "{}", {
    status: upstream.status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
  if (setCookie) {
    res.cookies.set(RL_COOKIE, setCookie, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 3600 });
  }
  return res;
}
