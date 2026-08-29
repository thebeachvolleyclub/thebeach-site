export type LicenceRequest = {
  id: number;
  membership_type: string;
  membership_year: number;
  status: "pending" | "in_progress" | "completed" | "rejected" | "cancelled";
  status_note?: string | null;
  created_at: string;
};

export type LicenceEligibility = {
  available?: boolean;
  eligible: boolean;
  reason?: string | null;
  message?: string | null;
  membershipYear?: number | null;
  membershipType?: string | null;
  membership?: { membershipType?: string; membershipYear?: number } | null;
};

export type LicenceState = {
  request: LicenceRequest | null;
  eligibility: LicenceEligibility;
};

export type CompetitionLicenceYearContent = "request" | "status" | null;

export function competitionLicenceDisplayYear(
  state: LicenceState | null,
  now = new Date(),
): number {
  if (state?.request && Number.isFinite(state.request.membership_year)) {
    return state.request.membership_year;
  }
  const eligibilityYear = state?.eligibility.membershipYear
    ?? state?.eligibility.membership?.membershipYear;
  if (eligibilityYear != null && Number.isFinite(eligibilityYear)) {
    return eligibilityYear;
  }
  const value = Number(new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
  }).format(now));
  return Number.isFinite(value) ? value : now.getFullYear();
}

/**
 * Existing cases stay attached to their recorded membership year. A new
 * action is shown only for the API-owned current year, even when a future
 * membership has already been paid.
 */
export function competitionLicenceContentForYear(
  state: LicenceState | null,
  sectionYear: number,
  currentMembershipYear: number,
): CompetitionLicenceYearContent {
  if (!state || competitionLicenceDisplayYear(state) !== sectionYear) return null;
  if (state.request) return "status";
  if (sectionYear !== currentMembershipYear) return null;
  return state.eligibility.eligible ? "request" : null;
}
