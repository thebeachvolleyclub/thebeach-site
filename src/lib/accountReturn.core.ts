export type AccountReturnProfile = {
  name: string | null | undefined;
  swish_phone: string | null | undefined;
};

const SAFE_ACCOUNT_NEXT = /^\/[a-zA-Z0-9\-_/]*$/;

export function safeAccountNext(raw: string | null) {
  if (!raw || raw.startsWith("//") || !SAFE_ACCOUNT_NEXT.test(raw)) return null;
  return raw;
}

export function accountReturnNeedsSwish(nextPath: string | null) {
  return nextPath === "/boka" || nextPath === "/en/book";
}

export function canReturnFromAccount(
  nextPath: string | null,
  profile: AccountReturnProfile | null,
) {
  if (!nextPath || !profile?.name?.trim()) return false;
  return !accountReturnNeedsSwish(nextPath) || Boolean(profile.swish_phone?.trim());
}
