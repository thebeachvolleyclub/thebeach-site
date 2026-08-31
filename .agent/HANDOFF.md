# Current Work State

## BeachTV one-time account handoff (production-verified 2026-08-31; HQ #103)

- Objective: use the existing `thebeach.one` account session to bootstrap
  BeachTV without a second login and without a parent-domain bearer cookie.
- Exact-origin `POST /api/account/tv-handoff` is served only by the canonical
  host to `https://tv.thebeach.one`, reads the existing host-only account
  cookie, and asks the App API for a 60-second single-use code. Redeem and
  training BFF routes accept only the code or the separate narrow TV bearer;
  the App API key and broad account bearer remain server-side.
- No cookie domain or sibling-session write was added. Credentialed CORS is
  exact-origin, the browser-visible Host header cannot be overridden by an
  untrusted forwarding header, responses are private/no-store, and stale broad
  sessions are cleared when handoff issuance receives a 401.
- All 139 unit tests pass, the production build passes, targeted ESLint and
  whitespace checks pass. Production commit `4ff3a75` is live and healthy.
- Production verification passed exact CORS, canonical Host enforcement,
  attacker-supplied forwarding-header rejection, one-time redemption and
  replay rejection. The narrow token cannot access the broad App profile API
  and becomes invalid as soon as the source website session is logged out.

### Exact next action

None.
