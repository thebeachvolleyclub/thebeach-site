import { accountDeviceId, accountToken, sameOrigin } from "@/lib/accountSession";
import { appApi } from "@/lib/appApi";
import { createFamilyChildPost } from "@/lib/accountFamily.core";

export const dynamic = "force-dynamic";
export const POST = createFamilyChildPost({ accountDeviceId, accountToken, sameOrigin, appApi });
