export type AccountReturnProfile = {
  name: string | null | undefined;
  swish_phone: string | null | undefined;
};

// Samma origin, ingen query — och ett valfritt ankare, eftersom kurskorten
// skickar hit /trana#kurser för att kunna lämna tillbaka besökaren till exakt
// det kort hen klickade på. Utan fragmentet underkändes hela adressen och
// återhoppet kördes aldrig.
const SAFE_ACCOUNT_NEXT = /^\/[a-zA-Z0-9\-_/]*(?:#[a-zA-Z0-9\-_]+)?$/;

export function safeAccountNext(raw: string | null) {
  if (!raw || raw.startsWith("//") || !SAFE_ACCOUNT_NEXT.test(raw)) return null;
  return raw;
}

export function accountReturnNeedsSwish(nextPath: string | null) {
  // Booking now offers Stripe as a fallback, so a valid name is sufficient to
  // return. Swish remains the primary button and asks for a number when chosen.
  void nextPath;
  return false;
}

export function canReturnFromAccount(
  nextPath: string | null,
  profile: AccountReturnProfile | null,
) {
  if (!nextPath || !profile?.name?.trim()) return false;
  return !accountReturnNeedsSwish(nextPath) || Boolean(profile.swish_phone?.trim());
}
