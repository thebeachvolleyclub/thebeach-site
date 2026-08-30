# Current Work State

## BeachTV one-time account handoff (implementation complete; review pending)

- Objective: use the existing `thebeach.one` account session to bootstrap
  BeachTV without a second login and without a parent-domain bearer cookie.
- Exact-origin `POST /api/account/tv-handoff` is served only by the canonical
  host to `https://tv.thebeach.one`, reads the existing host-only account
  cookie, and asks the App API for a 60-second single-use code. Redeem and
  training BFF routes accept only the code or the separate narrow TV bearer;
  the App API key and broad account bearer remain server-side.
- No cookie domain or sibling-session write was added. Credentialed CORS is
  exact-origin, responses are private/no-store, and stale broad sessions are
  cleared when handoff issuance receives a 401.
- All 139 unit tests pass, the production build passes, targeted ESLint and
  whitespace checks pass. Production deploy has not run.

### Exact next action

Push this branch and review it with the App API migration/contract and BeachTV
consumer. Promote after App API migration 173 and code are live.

