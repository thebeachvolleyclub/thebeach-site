import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  clearFamilyChoice,
  familyChoiceCookie,
  sameOrigin,
  setAccountSession,
} from "@/lib/accountSession";

export const dynamic = "force-dynamic";

const USER_ID = /^[A-Za-z0-9_-]{10,64}$/;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ detail: "Ogiltig förfrågan" }, { status: 403 });
  const body = await request.json().catch(() => ({})) as { userId?: string; candidateIds?: string[] };
  const userId = body.userId ?? "";
  if (!USER_ID.test(userId)) return NextResponse.json({ detail: "Ogiltig användare" }, { status: 422 });
  const token = (await cookies()).get(familyChoiceCookie(userId))?.value;
  if (!token) return NextResponse.json({ detail: "Valet har gått ut. Logga in igen." }, { status: 401 });
  const response = NextResponse.json({ authenticated: true });
  setAccountSession(response, token);
  for (const candidateId of body.candidateIds ?? []) {
    if (USER_ID.test(candidateId)) clearFamilyChoice(response, candidateId);
  }
  return response;
}
