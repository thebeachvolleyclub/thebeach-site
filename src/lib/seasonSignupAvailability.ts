export type SeasonSignupAvailability =
  | { state: "open"; opensAt: null }
  | { state: "waitlist"; opensAt: null }
  | { state: "before_open"; opensAt: string }
  | { state: "closed"; opensAt: null };

type SeasonSignupConfigShape = {
  config_version?: unknown;
  is_open?: unknown;
  waitlist_open?: unknown;
  before_open?: unknown;
  opens_at?: unknown;
};

/**
 * Resolve the public season-signup state from the versioned API contract.
 *
 * v3 remains the minimum trusted contract for ordinary registration. Waiting
 * list access is accepted only from v4+, where `waitlist_open` is an explicit,
 * server-authoritative effective flag. Missing or malformed fields therefore
 * always degrade to closed rather than exposing a stale registration CTA.
 */
export function seasonSignupAvailability(
  value: SeasonSignupConfigShape | null | undefined,
): SeasonSignupAvailability {
  const version = Number(value?.config_version ?? 0);
  if (!Number.isFinite(version) || version < 3 || typeof value?.is_open !== "boolean") {
    return { state: "closed", opensAt: null };
  }

  if (value.is_open) return { state: "open", opensAt: null };

  if (version >= 4 && value.waitlist_open === true) {
    return { state: "waitlist", opensAt: null };
  }

  if (value.before_open === true && typeof value.opens_at === "string" && value.opens_at.trim()) {
    const opensAt = value.opens_at.trim();
    if (!Number.isNaN(Date.parse(opensAt))) {
      return { state: "before_open", opensAt };
    }
  }

  return { state: "closed", opensAt: null };
}
