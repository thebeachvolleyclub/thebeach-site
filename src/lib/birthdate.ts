/**
 * Birthdate input helpers.
 *
 * Why this exists: the profile and signup forms ask for ÅÅÅÅ-MM-DD in an
 * input with inputMode="numeric". On iOS that keypad has no hyphen key, so a
 * phone user physically cannot type the required format — the save button
 * stayed disabled with no explanation and the account could never be
 * completed. The mask below supplies the hyphens as the user types digits,
 * and normalize() accepts the other formats people actually paste.
 */

/** Digits typed so far → ÅÅÅÅ-MM-DD, hyphens inserted automatically. */
export function maskBirthdate(raw: string): string {
  const d = (raw ?? "").replace(/\D/g, "").slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
}

/**
 * Tolerant parse for pasted / loosely typed values.
 * Accepts 19900512, 900512 (Swedish short form), 1990/05/12, 1990.05.12,
 * 12/5-1990 and 12 maj-style day-first input. Returns ÅÅÅÅ-MM-DD or "".
 */
export function normalizeBirthdate(raw: string): string {
  const s = (raw ?? "").trim();
  if (!s) return "";

  const parts = s.split(/[^0-9]+/).filter(Boolean);
  const digits = s.replace(/\D/g, "");
  let y = "", m = "", d = "";

  if (parts.length === 3) {
    // Explicitly separated: 1990/05/12, 1990-5-2, 12/5-1990
    if (parts[0].length === 4) [y, m, d] = parts;
    else if (parts[2].length === 4) [d, m, y] = parts;
    else return "";
  } else if (parts.length === 1 && digits.length === 8 && /^(19|20)/.test(digits)) {
    // 19900512
    y = digits.slice(0, 4); m = digits.slice(4, 6); d = digits.slice(6, 8);
  } else if (parts.length === 1 && digits.length === 6) {
    // 900512 — Swedish short form. Two-digit years read as 1900s unless that
    // would put the birthdate in the future.
    const yy = Number(digits.slice(0, 2));
    const currentYY = new Date().getFullYear() % 100;
    y = String(yy > currentYY ? 1900 + yy : 2000 + yy);
    m = digits.slice(2, 4); d = digits.slice(4, 6);
  } else {
    return "";
  }

  const out = `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  return isBirthdateValid(out) ? out : "";
}

/** True only for a real calendar date, not in the future, year >= 1900. */
export function isBirthdateValid(value: string): boolean {
  const v = (value ?? "").trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!match) return false;
  const [, ys, ms, ds] = match;
  const y = Number(ys), m = Number(ms), d = Number(ds);
  if (y < 1900 || m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return false;
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() < today;
}

/** Customer-facing reason the value is not acceptable yet, or "" when it is. */
export function birthdateHint(value: string): string {
  const v = (value ?? "").trim();
  if (!v) return "Fyll i ditt födelsedatum, till exempel 1990-05-12.";
  if (isBirthdateValid(v)) return "";
  const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (parsed) {
    const asDate = new Date(Date.UTC(Number(parsed[1]), Number(parsed[2]) - 1, Number(parsed[3])));
    if (asDate.getTime() > Date.now()) return "Födelsedatumet kan inte ligga i framtiden.";
    return "Datumet finns inte. Kontrollera år, månad och dag.";
  }
  return "Skriv födelsedatum som ÅÅÅÅ-MM-DD, till exempel 1990-05-12.";
}
