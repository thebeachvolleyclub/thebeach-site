import { NextResponse } from "next/server";
import {
  accountDeviceId, accountToken, clearFamilySwitchRecovery, clearIdentityChoice,
  sameOrigin, setAccountSession,
} from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { createFamilyInboxVerifyPost } from "@/lib/accountFamily.core";

export const dynamic = "force-dynamic";
export const POST = createFamilyInboxVerifyPost({
  accountDeviceId, accountToken, sameOrigin, appApi,
  install: (token) => {
    const response = NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
    setAccountSession(response, token);
    clearFamilySwitchRecovery(response);
    clearIdentityChoice(response);
    return response;
  },
});
