export type FamilyProfile = {
  player_id: number;
  first_name: string;
  last_name: string;
  name: string;
  birthdate: string;
  gender: "M" | "W";
  relationship: "self" | "child";
  is_current: boolean;
  emoji_icon?: string | null;
  avatar_thumb_url?: string | null;
  is_public: boolean;
  email_type: "personal" | "parent";
};

export type FamilyProfilesFeed = {
  actor_player_id: number;
  current_player_id: number;
  can_create_child: boolean;
  contact_email: string;
  contact_provenance: "otp" | "otp_receipt" | "account_contact";
  requires_email_verification: boolean;
  current_has_parent_contact: boolean;
  current_parent_contacts: string[];
  profiles: FamilyProfile[];
};

export function familyPlayerId(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : null;
}

export function familyChildRequest(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  // Only child identity fields cross the BFF. A submitted email, actor ID,
  // relationship or public flag can never become authority for this operation.
  if (typeof body.first_name !== "string" || typeof body.last_name !== "string"
    || typeof body.birthdate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.birthdate)
    || body.first_name.trim().length < 2 || body.first_name.length > 60
    || body.last_name.trim().length < 2 || body.last_name.length > 60
    || !["M", "W"].includes(String(body.gender))
    || body.parental_responsibility_confirmed !== true
    || typeof body.expected_contact_email !== "string" || body.expected_contact_email.length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.expected_contact_email)) return null;
  return {
    first_name: body.first_name.trim(),
    last_name: body.last_name.trim(),
    birthdate: body.birthdate,
    gender: body.gender as "M" | "W",
    parental_responsibility_confirmed: true,
    expected_contact_email: body.expected_contact_email,
  };
}

export function familyIdempotencyKey(value: string | null): value is string {
  return value !== null && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function familyFailure(payload: unknown, fallback: string): { detail: string; code?: string } {
  if (!payload || typeof payload !== "object") return { detail: fallback };
  const detail = (payload as { detail?: unknown }).detail;
  if (typeof detail === "string") return { detail };
  if (!detail || typeof detail !== "object") return { detail: fallback };
  const error = detail as { message?: unknown; code?: unknown };
  return {
    detail: typeof error.message === "string" ? error.message : fallback,
    ...(typeof error.code === "string" && /^[A-Z_]{1,80}$/.test(error.code) ? { code: error.code } : {}),
  };
}
