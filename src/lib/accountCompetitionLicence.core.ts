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

export type CompetitionLicence = {
  provider: string;
  year: number;
  type: string;
  label: string;
  status: string;
  activated_on?: string | null;
};

export type LicenceState = {
  request: LicenceRequest | null;
  eligibility: LicenceEligibility;
  has_active_competition_licence?: boolean;
  competition_licences?: CompetitionLicence[];
};

export type CompetitionLicenceYearContent = "request" | "status" | "licensed" | null;

export function activeCompetitionLicencesForYear(
  state: LicenceState | null,
  year: number,
): CompetitionLicence[] {
  return state?.competition_licences?.filter(
    (licence) => licence.year === year && licence.status === "valid",
  ) ?? [];
}

export function competitionLicenceDisplayYear(
  state: LicenceState | null,
  now = new Date(),
): number {
  if (state?.request && Number.isFinite(state.request.membership_year)) {
    return state.request.membership_year;
  }
  const licenceYears = state?.competition_licences
    ?.filter((licence) => licence.status === "valid" && Number.isFinite(licence.year))
    .map((licence) => licence.year) ?? [];
  if (licenceYears.length > 0) return Math.max(...licenceYears);
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
  const activeLicences = activeCompetitionLicencesForYear(state, sectionYear);
  if (activeLicences.length > 0) return "licensed";
  if (!state || competitionLicenceDisplayYear(state) !== sectionYear) return null;
  if (state.has_active_competition_licence) return "licensed";
  if (state.request) return "status";
  if (sectionYear !== currentMembershipYear) return null;
  return state.eligibility.eligible ? "request" : null;
}
