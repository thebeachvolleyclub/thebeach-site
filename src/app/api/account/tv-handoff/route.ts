import { NextResponse } from "next/server";

import { accountToken, clearAccountSession } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { isTvBrowserRequest, tvCorsHeaders } from "@/lib/tvSessionHandoff.core";

export const dynamic = "force-dynamic";

function browserResponse(body: BodyInit | null, status: number): NextResponse {
  const headers = new Headers(tvCorsHeaders());
  if (body !== null) headers.set("Content-Type", "application/json");
  return new NextResponse(body, { status, headers });
}

export async function OPTIONS(request: Request) {
  if (!isTvBrowserRequest(request)) {
    return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  return browserResponse(null, 204);
}

export async function POST(request: Request) {
  if (!isTvBrowserRequest(request)) {
    return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  }
  const token = await accountToken();
  if (!token) {
    return browserResponse(JSON.stringify({ authenticated: false }), 401);
  }

  const upstream = await appApi("/tv/session-handoffs", { method: "POST", body: "{}" }, { token });
  const payload = await upstream.text();
  const response = browserResponse(payload || "{}", upstream.status);
  if (upstream.status === 401) clearAccountSession(response);
  return response;
}
