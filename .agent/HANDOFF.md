# Current Work State

## Existing website session shared with tv.thebeach.one (implementation complete; release pending)

- Objective: let `tv.thebeach.one` show a logged-in-only `Mina träningar`
  destination using the existing password-based website profile session. No
  second BeachTV login and no new customer-service credential are introduced.
- Branch `codex/site-beachtv-shared-session-20260830` keeps the existing
  host-only `tb_account_session` cookie as the website's primary session and,
  in production only, mirrors the same opaque token into the separate
  HttpOnly, Secure, SameSite=Lax `tb_account_tv_session` cookie scoped to
  `.thebeach.one`. Login, profile selection, session refresh, and logout all
  set or clear the handoff together with the primary session.
- The Next.js proxy backfills the handoff on canonical `thebeach.one` requests
  for members who signed in before this release. It does not run on staging or
  other hosts, so environments retain their existing isolation.
- `GET /api/account/tv-training` authenticates only through the TV handoff,
  uses the website's existing server-side App API boundary to read `/auth/me`
  and the authorized training calendar with recordings, and returns only the
  member display name plus session/group/court/video fields required by TV.
  The response is dynamic and `private, no-store`.
- Platform request 103 records this cross-project auth-access change. No
  schema migration or new secret is required.
- Verification: all 137 unit tests pass; targeted ESLint on every changed file
  passes; the Next.js production build passes and lists the new dynamic route
  and proxy. Repository-wide ESLint remains blocked by eight pre-existing
  React rule errors in unrelated components.

### Exact next action

After platform review and an explicit production promotion, deploy this
website branch before the paired BeachTV branch. Verify that a normal password
login on `thebeach.one` sets both cookies, existing signed-in users receive the
handoff on their next canonical-site request, logout clears both cookies, the
TV BFF rejects missing/expired sessions, and no private response is cached.
Do not deploy as a side effect of implementation work.
