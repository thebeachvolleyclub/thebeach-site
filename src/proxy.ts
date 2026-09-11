import { NextResponse, type NextRequest } from "next/server";
import { ACCOUNT_CONTEXT_HEADER, accountContextFingerprint, accountContextMatches } from "./lib/accountContext.core";

/** A stale tab must never act as the person now stored in the shared cookie. */
export async function proxy(request: NextRequest) {
  const expected = request.headers.get(ACCOUNT_CONTEXT_HEADER);
  if (expected !== null) {
    const actual = await accountContextFingerprint(request.cookies.get("tb_account_session")?.value ?? null);
    if (!accountContextMatches(expected, actual)) {
      return NextResponse.json({ detail: "Profilen har ändrats. Sidan laddas om." }, {
        status: 409,
        headers: { "Cache-Control": "no-store", "X-Account-Context-Changed": "1" },
      });
    }
  }
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/api/account/:path*", "/api/booking/:path*", "/api/courses/:path*", "/api/signup/:path*"],
};
