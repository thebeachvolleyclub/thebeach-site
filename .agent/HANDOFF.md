# Current Work State

## HQ #283 annual memberships — website compatibility evidence (2026-09-14)

- Commit `c4e409ea538b94757ef2b93a875e901071436db9` on
  `codex/hq283-membership-lifecycle-site-20260914` adds regression evidence for
  the existing authenticated account view: an empty future year stays hidden
  until the API publishes an open purchase option. No website runtime source,
  route, BFF, schema or configuration changed.
- All 156 unit tests pass. A Next production build passed with webpack; it emitted
  only the established NFT warning and expected Profixio static-render fallbacks.
  The initial Turbopack attempt could not follow the temporary external
  `node_modules` symlink in this isolated worktree; this was an environment
  limitation, not a source failure, and no build process or generated directory
  remains.
- No Site deployment is needed. After the App API release, verify a signed-in
  2026-eligible synthetic account sees the 2026 purchase card and no closed 2027
  card. Do not start a payment for smoke testing. Existing mobile consumers use
  the same additive response and require no App/OTA change.

## HQ #281 court-booking receipts — website candidate (2026-09-13)

- The authenticated invoice area now includes paid native court bookings and
  creates/downloads their ordinary PDF receipts. Cards show the legal seller and
  org.nr, booking, amount and included VAT; they do not collect personnummer.
- The same-origin authenticated BFF keeps the account bearer server-side and
  proxies only `POST /booking/bookings/{id}/receipt` to the App API.
- Existing training/course invoice and friskvård behavior is unchanged.
- All 155 unit tests and the Next production build pass. The build emitted the
  established NFT warning and expected Profixio static-render fallbacks. Release
  only after the paired App API migration/routes are live.

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
