# Parent and child website profiles

This is a candidate implementation of Henric's 2026-09-11 specification,
independent of the paused earlier family work. It must not be deployed before
the shared App API contract and its Master-identity migration are available.
This website owns no identity tables, replication jobs, new auth service or
database topology.

## Identity and contact ownership

- A signed-in person's profile exposes child creation when the backend reports
  `can_create_child`; the website does not impose an adult-age requirement.
- The child receives a separate canonical BeachID. The backend derives the
  parent actor and contact from the authenticated session and verified active
  contact mapping, never from browser-supplied identity or arbitrary email.
- Creation displays `contact_email` and requires explicit responsibility and
  contact confirmation. `expected_contact_email` is a concurrency assertion,
  not authorization. Changed contacts require refreshed confirmation.
- Child profiles default to private in the backend. The create BFF forwards
  only structured child name/date/gender, confirmation and expected contact;
  it cannot forward a public flag, parent ID, child ID or an alternate email.
- Profile lists come from authoritative relationships, not everyone who shares
  an email. Legacy verified-email login/profile selection remains separate.
- The retired merged-identity fields are never used for family relationships
  or canonical identity resolution.

## Shared App API contract

| Website BFF | App API |
| --- | --- |
| `GET /api/account/family` | `GET /matchmaking/family/profiles` |
| `POST /api/account/family/children` | `POST /matchmaking/family/children` |
| `POST /api/account/family/switch` | `POST /matchmaking/family/switch` |
| `POST /api/account/family/personal-email/request` | `POST /matchmaking/family/personal-email/request` |
| `POST /api/account/family/personal-email/confirm` | `POST /matchmaking/family/personal-email/confirm` |

Creation and switching carry a UUID `Idempotency-Key`. Switch authorization and
source-token revocation/replay are transactional backend responsibilities.
Successful switch/takeover responses install the returned bearer in the
existing HttpOnly cookie and clear the older login-selection challenge; bearer
credentials never enter browser JSON. Mutations retain same-origin checks.

Parent contacts use `email_type: parent` in the existing email feed. An active
child with `current_has_parent_contact` can verify its own email, then explicitly
confirm `retire_parent_contact: true`. The backend preserves the child's BeachID
and history, removes the parent alias/relationship, revokes old child sessions,
and returns an independent child session. The UI does not claim this has
happened merely because a second alias was added.

## Context-change isolation

The website still uses the established server-side bearer, not a browser auth
model. The browser receives a SHA-256 session fingerprint as a context marker.
Every updated private client request supplies it; the BFF proxy rejects a stale
marker before optional-auth routes can fall back to anonymous writes. This is
additional stale-tab protection, not an authentication credential. Backend
authorization remains mandatory, and legacy clients without the marker remain
compatible.

The shared browser boundary:

1. Hides previous content during login/OTP selection and retires the whole
   document when the authenticated context changes.
2. Aborts pending requests and guards late JSON/text/blob/form-data/array-buffer
   body decoding, including clones.
3. Unmounts all private page components and their timers, then uses a full
   navigation to clear React state and the Next Router cache.
4. Coordinates tabs via BroadcastChannel plus storage events; checks the
   current context on focus/visibility, and rejects restored back/forward-cache
   documents.
5. Clears unscoped `tb_course_*` state in each tab. Membership and licence retry
   keys are account-UUID scoped and are preserved to avoid duplicate financial
   operations when returning to the parent profile. Existing server-side holds
   or payments are not cancelled by switching profile.

Read routes must not refresh or clear bearer cookies: a slow pre-switch
`/api/account/session` or TV-handoff response could otherwise overwrite the
new cookie. Token changes occur only in serialized auth/switch/takeover/logout
operations. Backend source-token revocation also invalidates its derived TV
grants; website code cannot erase another origin's browser storage.

## Interrupted requests and browser support

- New seamless switching requires Web Locks to serialize cookie writers across
  tabs. Older browsers retain ordinary login/logout; the new control explains
  when the browser must be updated. AbortSignal composition has a fallback.
- A switch records only source fingerprint, target and idempotency key in
  sessionStorage. On an interrupted response, a fresh document retries the
  same operation using the HttpOnly source bearer and backend replay receipt.
  It never reconstructs/restores the old token and never requests a new email
  OTP merely to switch profiles.
- Own-email confirmation has a backend code-receipt replay and is retried in
  memory. OTPs are never persisted in browser storage. If both responses are
  lost and no new cookie was received, recovery may require signing in with
  the newly verified child email. The transition never restores parent access.
- A fully offline, expired-session or unavailable-backend condition cannot be
  resolved by the website alone; it must not fabricate successful identity
  changes. Read and write errors remain visible after a clean session load.

## Verification and release boundary

Run `npm run test:unit`, `npm run build`, then optionally:

```sh
FAMILY_PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.js node scripts/verify-family-browser.mjs
```

The harness uses a synthetic in-memory App API on loopback and the actual built
Next BFF plus Chromium, blocks browser requests to external hosts, verifies two
tabs and screenshots mobile/desktop family controls, and closes its listeners.
It does not assert that a replicated Master database, deployed App API, actual
email inbox or Safari has been tested. Those checks belong to the coordinated
local integration/release. Pushing this feature branch must not auto-promote it
to main/staging/production.
