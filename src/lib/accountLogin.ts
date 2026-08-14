import "server-only";

import { NextResponse } from "next/server";
import { setAccountSession, setIdentityChoice } from "@/lib/accountSession";

export type FamilyUser = {
  id: string;
  player_id?: number;
  name?: string | null;
  emoji_icon?: string | null;
  avatar_thumb_url?: string | null;
};

export type VerifiedLoginPayload = {
  user?: { id?: string };
  family_users?: FamilyUser[];
  auth_token?: string | null;
  identity_challenge?: string | null;
  detail?: string;
};

export function completedAccountLoginResponse(payload: VerifiedLoginPayload): NextResponse {
  const family = Array.isArray(payload.family_users)
    ? payload.family_users.filter((item) => item?.id)
    : [];
  if (family.length > 1) {
    if (!payload.identity_challenge) {
      return NextResponse.json(
        { detail: "Inloggningssvaret saknade identitetsval" },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }
    const response = NextResponse.json(
      { requiresSelection: true, familyUsers: family },
      { headers: { "Cache-Control": "no-store" } },
    );
    setIdentityChoice(response, payload.identity_challenge);
    return response;
  }

  if (!payload.user?.id) {
    return NextResponse.json(
      { detail: "Inloggningssvaret saknade användare" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
  if (!payload.auth_token) {
    return NextResponse.json(
      { detail: "Inloggningssvaret saknade session" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = NextResponse.json(
    { authenticated: true },
    { headers: { "Cache-Control": "no-store" } },
  );
  setAccountSession(response, payload.auth_token);
  return response;
}
