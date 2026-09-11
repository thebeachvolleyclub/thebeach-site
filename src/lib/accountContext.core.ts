export const ACCOUNT_CONTEXT_HEADER = "X-Account-Context";
export const ACCOUNT_CONTEXT_EVENT = "tb-account-context-change";
export const ACCOUNT_CONTEXT_STORAGE = "tb-account-context-event";

/** A fingerprint identifies a browser context; it is never an authentication credential. */
export async function accountContextFingerprint(token: string | null): Promise<string> {
  if (!token) return "anonymous";
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function accountContextMatches(expected: string | null, actual: string): boolean {
  // Existing clients remain supported; updated clients bind every private request.
  if (expected === null) return true;
  let difference = expected.length ^ actual.length;
  for (let index = 0; index < actual.length; index += 1) difference |= (expected.charCodeAt(index) || 0) ^ actual.charCodeAt(index);
  return difference === 0;
}

/** Unscoped course/payment state must not survive a change of person. */
export function clearUnscopedAccountStorage(storage: Pick<Storage, "length" | "key" | "removeItem">) {
  const keys: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith("tb_course_")) keys.push(key);
  }
  for (const key of keys) storage.removeItem(key);
  // Membership/licence idempotency keys are account-UUID scoped: preserve them
  // so returning to a parent profile cannot accidentally start a duplicate payment.
}
