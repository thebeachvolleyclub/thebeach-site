# Current Work State

## Parent/child profiles — fresh Henric specification, 2026-09-11 (candidate only)

- Branch `codex/family-accounts-site-20260911`, isolated worktree
  `/home/henric/worktrees/family-accounts-site-20260911`, based on canonical
  `origin/main` `dc25379`. No code or design copied from paused HQ274 work.
- `/konto` profile includes child creation with canonical child BeachID,
  explicit displayed-parent-contact confirmation, profile switching without
  email OTP, and verified own-email takeover with explicit parent-contact and
  access retirement. Parent-email aliases are labelled and cannot be removed
  through the ordinary email controls; that UI points to the takeover flow.
- BFF uses the existing HttpOnly bearer/device cookies and the new App API
  `/matchmaking/family/{profiles,children,switch,personal-email/request,
  personal-email/confirm}` contract. No database/schema/deployment changes in
  this repo. Backend must be deployed and its replicated migration verified
  before this candidate is promoted.
- Central browser context boundary covers account, booking, signup, courses
  and payment-return clients. It hides UI during auth, unmounts and reloads
  on identity changes, aborts/guards delayed responses and body decodes,
  broadcasts across tabs, handles restored documents and clears unscoped
  course-payment storage. Person-scoped payment idempotency survives.
- Session GET and TV handoff no longer write/clear bearer cookies: a delayed
  old response cannot restore an old login or erase the new one. Proxy and
  account-token reader check a session fingerprint on new browser requests;
  older no-fingerprint clients remain compatible.
- New profile switching uses Web Locks and a sessionStorage journal containing
  only source fingerprint, target and idempotency key (no bearer or OTP).
  Lost-response replay is automatic on next load. Ordinary login has a
  no-Web-Locks fallback. Own-email confirmation retries in memory and does not
  persist its OTP; see `docs/family-accounts.md` for recovery limitations.
- Verification so far: all 173 unit tests pass; `npm run build` passes with
  established NFT/Profixio fallback warnings. Actual loopback BFF + Chromium
  synthetic-fixture tests pass for child creation, 2-tab switching, stale
  requests/cookie response isolation, storage cleanup and own-email takeover.
  No real user, database, external email, payment or notification was used.
- Exact reusable smoke harness: `scripts/verify-family-browser.mjs`. Set
  `FAMILY_PLAYWRIGHT_MODULE` to an existing Playwright installation; it starts
  only short-lived loopback Node listeners and stops them on completion.
- Next action: root independent screenshot/code review, coordinated
  backend/local integration and explicit promotion (never an automatic main or
  production push). Real replicated DB integration, iOS/Safari and
  actual inbox delivery remain unverified by this website-only work.

## HQ #281 Fenix receipts in authenticated website account (candidate, 2026-09-11)

- Branch `codex/hq281-receipt-site-20260911` starts from current
  `origin/main` `9dcdb84`. It preserves the existing invoice/payment UI.
- Authenticated BFF routes now proxy the existing owner-scoped App API receipt
  request and signed-link endpoints. Invoice cards show request, pending, or
  generated state and download the existing PDF; bearer credentials stay on
  the server and invoice IDs are UUID-validated.
- `npm run test:unit`: 152 passed. `npm run build`: passed with the established
  NFT warning and expected external Profixio/BeachTV build fallbacks. No schema,
  mobile or OTA change. Root deploys only after the paired App API route is live.
- A temporary local production build plus in-memory App API verified the actual
  HTTP BFF boundary: an authenticated synthetic cookie forwarded its bearer and
  returned the generated receipt state and signed link; the same link request
  without the cookie returned 401. No customer data or external service was
  touched, and both temporary listeners were stopped afterward.

## Objective

Preserve the original server-side course-payment deadline when App API safely
recovers an unexpired enrolment after the browser loses session storage (HQ
mention 591 / message 83).

## Current Status

Implementation is complete on `codex/hq591-course-hold-retry-site`, based on
canonical `origin/main` `59c552c913a6e4f7e07a8e738944c365cebcc8c1`.

`coursePaymentStartedAt` derives a bounded client timer from the App API's
`createdAt` and `holdExpiresAt` fields. `CourseEnrolButton` persists that
original deadline instead of resetting it to `Date.now()` after a recovered
enrolment, and it will not start a payment whose server-derived window has
already elapsed.

## Verification

- `node --test --experimental-strip-types tests/coursePayment.test.ts`: 22 passed.
- `npm run test:unit`: 150 passed.
- `npx eslint src/lib/coursePayment.core.ts src/components/trana/CourseEnrolButton.tsx tests/coursePayment.test.ts`: passed.
- `npm run build`: passed. The existing Turbopack NFT warning and expected
  Profixio static-render fallbacks were emitted; neither failed the build.

## Related API Candidate

The App API candidate is on `codex/hq591-course-hold-retry`; it owns exact
customer/fingerprint hold recovery and fail-closed Swish transaction replay.
Neither repository has been deployed.

## Next Action

Commit and push this Site branch, then hand both exact revisions to independent
review before guarded production promotion.
