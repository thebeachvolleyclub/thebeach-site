import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  environmentMatchesHostname,
  parseAppEnvironment,
  type AppEnvironment,
} from "./lib/runtimeEnvironment.core";

const ENVIRONMENT_HEADER = "X-The-Beach-Environment";

function requestHostname(request: NextRequest): string {
  // Host is the browser-visible authority preserved by our edge proxy.
  // X-Forwarded-Host is deliberately ignored because an untrusted client can
  // supply it unless every upstream hop implements a strip-and-set boundary.
  const raw = request.headers.get("host") || request.nextUrl.host;
  try {
    return new URL(`http://${raw}`).hostname;
  } catch {
    return "";
  }
}

function mismatchResponse(request: NextRequest): NextResponse {
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": request.nextUrl.pathname.startsWith("/api/")
      ? "application/json; charset=utf-8"
      : "text/html; charset=utf-8",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
  };
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return new NextResponse(
      JSON.stringify({ detail: "Webbmiljön är felkonfigurerad och har stoppats säkert" }),
      { status: 503, headers },
    );
  }
  return new NextResponse(
    "<!doctype html><html lang=\"sv\"><meta charset=\"utf-8\"><title>Miljön är stoppad</title><body><main><h1>Miljön är tillfälligt stoppad</h1><p>Värdnamn och servermiljö stämmer inte överens. Ingen data har lästs eller skrivits.</p></main></body></html>",
    { status: 503, headers },
  );
}

export function proxy(request: NextRequest): NextResponse {
  let environment: AppEnvironment;
  try {
    environment = parseAppEnvironment(process.env.APP_ENV);
  } catch {
    return mismatchResponse(request);
  }

  if (!environmentMatchesHostname(environment, requestHostname(request))) {
    return mismatchResponse(request);
  }

  const response = NextResponse.next();
  response.headers.set(ENVIRONMENT_HEADER, environment);
  if (environment === "demo") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|media/).*)",
  ],
};
