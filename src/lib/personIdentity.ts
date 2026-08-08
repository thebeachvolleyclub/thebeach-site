export function normalizePersonName(value: string) {
  return value.normalize("NFC").trim().replace(/\s+/g, " ");
}

export function validNameComponent(value: string) {
  const normalized = normalizePersonName(value);
  const letters = Array.from(normalized).filter((char) => /\p{L}/u.test(char)).length;
  return letters >= 2
    && normalized.length <= 60
    && /^[\p{L}\p{M}]+(?:[ '\-’][\p{L}\p{M}]+)*$/u.test(normalized);
}

export function splitValidFullName(value: string) {
  const parts = normalizePersonName(value).split(" ").filter(Boolean);
  if (parts.length < 2) return null;
  const firstName = parts.slice(0, -1).join(" ");
  const lastName = parts.at(-1) ?? "";
  return validNameComponent(firstName) && validNameComponent(lastName)
    ? { firstName, lastName }
    : null;
}
