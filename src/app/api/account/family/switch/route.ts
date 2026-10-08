import { NextResponse } from "next/server";
import {
  accountDeviceId, accountToken, clearIdentityChoice, familySwitchRecovery, sameOrigin,
  setAccountSession, setFamilySwitchRecovery,
} from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { createFamilySwitchPost } from "@/lib/accountFamily.core";

export const dynamic = "force-dynamic";
export const POST = createFamilySwitchPost({
  accountDeviceId, accountToken, sameOrigin, appApi, recovery: familySwitchRecovery,
  install: (token, recovery) => {
    const response = NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
    setAccountSession(response, token);
    setFamilySwitchRecovery(response, recovery);
    clearIdentityChoice(response);
    return response;
  },
});
