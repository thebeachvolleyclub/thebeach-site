import { NextResponse } from "next/server";
import { accountToken, sameOrigin } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { evaluate } from "@/lib/clientRateLimit";
import { VISITOR_COOKIE, mintVisitorId, signVisitorId } from "@/lib/visitorIdentity";

export const dynamic = "force-dynamic";

// Anonymous website signups are throttled two ways:
//  1) A durable, per-VISITOR limit at the API, keyed on a proxy-authenticated
//     signed visitor id this route mints/forwards (so distinct browsers do NOT
//     collapse into the shared site-container bucket).
//  2) A signed per-browser cookie sliding window here as edge defence in depth
//     (no IP trust; stateless; tamper-evident).
const ANON_MAX_PER_HOUR = 15;
const HOUR_MS = 60 * 60 * 1000;
const RL_COOKIE = "tb_su_rl";
const YEAR_S = 60 * 60 * 24 * 365;

function readCookie(request: Request, name: string): string | undefined {
  return request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const body = await request.text();
  const token = await accountToken();

  // Stable per-browser visitor id (mint once) — forwarded signed to the API.
  let visitorId = readCookie(request, VISITOR_COOKIE);
  let setVisitor = false;
  if (!visitorId) {
    visitorId = mintVisitorId();
    setVisitor = true;
  }
  const signed = signVisitorId(visitorId);

  // Edge cookie window (signed-out only; signed-in are gated upstream).
  let setRlCookie: string | null = null;
  if (!token) {
    const { ok, cookie } = evaluate(readCookie(request, RL_COOKIE), ANON_MAX_PER_HOUR, HOUR_MS);
    if (!ok) {
      const res = NextResponse.json(
        { detail: "För många anmälningar från den här enheten — försök igen om en stund." },
        { status: 429 },
      );
      res.cookies.set(RL_COOKIE, cookie, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 3600 });
      if (setVisitor) res.cookies.set(VISITOR_COOKIE, visitorId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: YEAR_S });
      return res;
    }
    setRlCookie = cookie;
  }

  const upstream = await appApi(
    "/season-signup/submit",
    { method: "POST", body },
    {
      ...(token ? { token } : {}),
      ...(signed ? { visitor: signed } : {}),
    },
  );
  const text = await upstream.text();
  const res = new NextResponse(text || "{}", {
    status: upstream.status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
  if (setRlCookie) res.cookies.set(RL_COOKIE, setRlCookie, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 3600 });
  if (setVisitor) res.cookies.set(VISITOR_COOKIE, visitorId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: YEAR_S });
  return res;
}
