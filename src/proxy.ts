import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ACCOUNT_COOKIE,
  TV_ACCOUNT_COOKIE,
  TV_ACCOUNT_COOKIE_DOMAIN,
} from "@/lib/accountCookies";

const YEAR = 60 * 60 * 24 * 365;

/**
 * Backfill the TV handoff for accounts that were already signed in before the
 * shared cookie existed. Authorization still happens in the account BFF and
 * App API; this proxy only mirrors the opaque session to the parent domain.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (process.env.NODE_ENV !== "production" || host !== "thebeach.one") return response;

  const accountToken = request.cookies.get(ACCOUNT_COOKIE)?.value;
  const tvToken = request.cookies.get(TV_ACCOUNT_COOKIE)?.value;
  if (accountToken && accountToken !== tvToken) {
    response.cookies.set(TV_ACCOUNT_COOKIE, accountToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: TV_ACCOUNT_COOKIE_DOMAIN,
      path: "/",
      maxAge: YEAR,
    });
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Cookie");
  } else if (!accountToken && tvToken) {
    response.cookies.set(TV_ACCOUNT_COOKIE, "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: TV_ACCOUNT_COOKIE_DOMAIN,
      path: "/",
      maxAge: 0,
    });
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Cookie");
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
