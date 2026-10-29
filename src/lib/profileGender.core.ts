/** Explicit choices only: never infer gender from names, groups or other people. */
export type ProfileGender = "herr" | "dam" | "ickebinar";

export function isProfileGender(value: unknown): value is ProfileGender {
  return value === "herr" || value === "dam" || value === "ickebinar";
}

export function profileGenderFromWire(value: unknown): ProfileGender | "" {
  return isProfileGender(value) ? value : "";
}

/** Missing capability flags from older servers do not lock historical accounts. */
export function requiresProfileGender(profile: { gender_required?: boolean } | null | undefined): boolean {
  return profile?.gender_required === true;
}
