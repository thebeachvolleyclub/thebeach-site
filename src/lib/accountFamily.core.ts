export type FamilyProfile = {
  player_id: number;
  name: string;
  first_name: string;
  last_name: string;
  birthdate: string | null;
  gender: string | null;
  relationship: "self" | "child" | "shared_email";
  is_current: boolean;
  emoji_icon: string | null;
  avatar_thumb_url: string | null;
  is_public: boolean;
};

export type FamilyProfiles = {
  actor_player_id: number;
  current_player_id: number;
  can_create_child: boolean;
  requires_email_verification: boolean;
  shared_profiles_require_email_verification?: boolean;
  contact_email: string;
  profiles: FamilyProfile[];
};

export type FamilySwitchRecovery = {
  sourceToken: string;
  resultToken: string;
  requestKey: string;
  playerId: number;
};

type Payload = Record<string, unknown>;
type Dependencies = {
  accountToken: () => Promise<string | null>;
  accountDeviceId: () => Promise<string | null>;
  sameOrigin: (request: Request) => boolean;
  appApi: (path: string, init?: RequestInit, options?: { token?: string; deviceId?: string }) => Promise<Response>;
};

export function validFamilyPlayerId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

export function validFamilyRequestKey(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9._:-]{12,128}$/.test(value);
}

export function familyErrorMessage(payload: Payload): string {
  const detail = payload.detail;
  if (typeof detail === "string") return detail;
  if (detail && typeof detail === "object" && "message" in detail && typeof detail.message === "string") return detail.message;
  if (Array.isArray(detail)) return detail.map((item) => item?.msg).filter((item) => typeof item === "string").join(". ") || "Kontrollera uppgifterna.";
  return "Kunde inte slutföra. Försök igen.";
}

export function familyFailure(payload: Payload, status: number): Response {
  const detail = payload.detail;
  const code = detail && typeof detail === "object" && "code" in detail ? detail.code : payload.code;
  return Response.json({ detail: familyErrorMessage(payload), ...(typeof code === "string" ? { code } : {}) }, {
    status, headers: { "Cache-Control": "no-store" },
  });
}

async function readPayload(response: Pick<Response, "json">): Promise<Payload> {
  const value: unknown = await response.json().catch(() => ({}));
  return value && typeof value === "object" && !Array.isArray(value) ? value as Payload : {};
}

async function guarded(deps: Dependencies, request: Request): Promise<string | Response> {
  if (!deps.sameOrigin(request)) return familyFailure({ detail: "Ogiltig förfrågan" }, 403);
  return await deps.accountToken() ?? familyFailure({ detail: "Logga in för att fortsätta" }, 401);
}

function validSession(payload: Payload, playerId: number): payload is Payload & { auth_token: string } {
  const user = payload.user as Payload | undefined;
  return payload.success === true && typeof payload.auth_token === "string" && /^[a-f0-9]{64}$/i.test(payload.auth_token)
    && Boolean(user?.id) && Number(user?.canonical_player_id) === playerId;
}

/** Keeps all bearer credentials and replay receipts inside HttpOnly cookies. */
export function createFamilySwitchPost(deps: Dependencies & {
  recovery: () => Promise<FamilySwitchRecovery | null>;
  install: (token: string, recovery: FamilySwitchRecovery) => Response;
}) {
  return async (request: Request): Promise<Response> => {
    const token = await guarded(deps, request);
    if (token instanceof Response) return token;
    const body = await readPayload(request);
    if (!validFamilyPlayerId(body.playerId) || !validFamilyRequestKey(body.idempotencyKey)) {
      return familyFailure({ detail: "Ogiltigt profilval" }, 422);
    }
    const prior = await deps.recovery();
    const sourceToken = prior?.resultToken === token && prior.requestKey === body.idempotencyKey && prior.playerId === body.playerId
      ? prior.sourceToken : token;
    const upstream = await deps.appApi("/matchmaking/family/switch", {
      method: "POST", headers: { "Idempotency-Key": body.idempotencyKey },
      body: JSON.stringify({ player_id: body.playerId }),
    }, { token: sourceToken, deviceId: await deps.accountDeviceId() ?? undefined });
    const payload = await readPayload(upstream);
    if (!upstream.ok) return familyFailure(payload, upstream.status);
    if (!validSession(payload, body.playerId)) return familyFailure({ detail: "Profilbytet saknade en giltig session. Ladda om kontot." }, 502);
    return deps.install(payload.auth_token, { sourceToken, resultToken: payload.auth_token, requestKey: body.idempotencyKey, playerId: body.playerId });
  };
}

export function createFamilyChildPost(deps: Dependencies) {
  return async (request: Request): Promise<Response> => {
    const token = await guarded(deps, request);
    if (token instanceof Response) return token;
    const body = await readPayload(request);
    if (!validFamilyRequestKey(body.idempotencyKey)) return familyFailure({ detail: "Ogiltig begärandenyckel" }, 422);
    const child: Payload = {};
    for (const key of ["first_name", "last_name", "birthdate", "gender", "parental_responsibility_confirmed", "expected_contact_email"]) {
      if (body[key] !== undefined) child[key] = body[key];
    }
    const upstream = await deps.appApi("/matchmaking/family/children", {
      method: "POST", headers: { "Idempotency-Key": body.idempotencyKey }, body: JSON.stringify(child),
    }, { token });
    const payload = await readPayload(upstream);
    if (!upstream.ok) return familyFailure(payload, upstream.status);
    const created = payload.child as Payload | undefined;
    if (!validFamilyPlayerId(created?.player_id)) return familyFailure({ detail: "Svaret saknade barnets profil. Försök igen med samma uppgifter." }, 502);
    return Response.json({ child: created, idempotent_replay: payload.idempotent_replay === true }, {
      status: upstream.status, headers: { "Cache-Control": "no-store" },
    });
  };
}

/** The verified code proves the inbox, never selects a different person. */
export function createFamilyInboxVerifyPost(deps: Dependencies & { install: (token: string) => Response }) {
  return async (request: Request): Promise<Response> => {
    const token = await guarded(deps, request);
    if (token instanceof Response) return token;
    const body = await readPayload(request);
    if (typeof body.code !== "string" || !/^\d{6}$/.test(body.code)) return familyFailure({ detail: "Ange en sexsiffrig kod." }, 422);
    const familyResponse = await deps.appApi("/matchmaking/family/profiles", undefined, { token });
    const family = await readPayload(familyResponse);
    if (!familyResponse.ok) return familyFailure(family, familyResponse.status);
    const playerId = family.current_player_id;
    if (!validFamilyPlayerId(playerId) || typeof family.contact_email !== "string" || !family.contact_email) {
      return familyFailure({ detail: "Profilen saknar verifierbar kontaktadress." }, 403);
    }
    const options = { deviceId: await deps.accountDeviceId() ?? undefined };
    let upstream = await deps.appApi("/matchmaking/auth/verify-code", {
      method: "POST", headers: { "X-Identity-Flow": "beachid-v2" },
      body: JSON.stringify({ email: family.contact_email.trim().toLowerCase(), code: body.code }),
    }, options);
    let payload = await readPayload(upstream);
    if (!upstream.ok) return familyFailure(payload, upstream.status);
    if (Array.isArray(payload.family_users) && payload.family_users.length > 1) {
      if (typeof payload.identity_challenge !== "string" || !payload.identity_challenge
        || !payload.family_users.some((entry: Payload) => Number(entry.player_id) === playerId)) {
        return familyFailure({ detail: "Den aktiva profilen är inte tillgänglig för adressen." }, 403);
      }
      upstream = await deps.appApi("/matchmaking/auth/select-identity", {
        method: "POST", headers: { "X-Identity-Flow": "beachid-v2" },
        body: JSON.stringify({ challenge: payload.identity_challenge, player_id: playerId }),
      }, options);
      payload = await readPayload(upstream);
      if (!upstream.ok) return familyFailure(payload, upstream.status);
    }
    if (!validSession(payload, playerId)) return familyFailure({ detail: "Kunde inte verifiera den aktiva profilen." }, 403);
    await deps.appApi("/matchmaking/auth/revoke-token", { method: "POST", body: "{}" }, { token });
    return deps.install(payload.auth_token);
  };
}

type DraftStorage = Pick<Storage, "length" | "key" | "getItem" | "setItem" | "removeItem">;
const DRAFT_OWNER = "tb-account-draft-owner";
const unscopedDraft = (key: string) => key.startsWith("tb_course_attempt_") || key.startsWith("tb_course_invoice_") || key.startsWith("tb-competition-licence:");

/** Archive pending retries for their person instead of showing them to another account. */
export function leaveAccountDrafts(storage: DraftStorage): void {
  const owner = storage.getItem(DRAFT_OWNER) || "legacy-unassigned";
  const remove: string[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key && unscopedDraft(key)) remove.push(key);
  }
  for (const key of remove) {
    storage.setItem(`tb-account-draft:${encodeURIComponent(owner)}:${key}`, storage.getItem(key) ?? "");
    storage.removeItem(key);
  }
  storage.removeItem(DRAFT_OWNER);
}

export function bindAccountDrafts(storage: DraftStorage, owner: string): void {
  if (!owner || storage.getItem(DRAFT_OWNER) === owner) return;
  leaveAccountDrafts(storage);
  const prefix = `tb-account-draft:${encodeURIComponent(owner)}:`;
  const restore: string[] = [];
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (key?.startsWith(prefix) && unscopedDraft(key.slice(prefix.length))) restore.push(key);
  }
  for (const key of restore) {
    storage.setItem(key.slice(prefix.length), storage.getItem(key) ?? "");
    storage.removeItem(key);
  }
  storage.setItem(DRAFT_OWNER, owner);
}

/** Replacing the same /konto hash alone is only a fragment navigation. */
export function reloadAccountDocument(family = false): void {
  window.history.replaceState(null, "", family ? "/konto#familj" : "/konto");
  window.location.reload();
}
