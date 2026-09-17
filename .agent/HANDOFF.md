# Current Work State

## HQ #289 court-subscription customer payment — website candidate 17 September 2026

- Branch `codex/hq289-subscription-payment-20260917` starts from current main
  `32fd67e`. The authenticated account now has a dedicated Banabonnemang view
  showing the fixed slot, occurrence count, frozen total and explicit due date.
- A customer must explicitly accept the personal-use/member/noncommercial terms
  before entering a Swish number. Same-origin BFF routes keep the broad bearer
  server-side, derive ownership in App API and forward neither customer identity
  nor amount. Active requests are visibly polled; expiry, terminal provider
  errors and reconciliation holds remain visible.
- All 168 unit tests pass. A Next 16 production build passes with webpack; the
  expected external Profixio/BeachTV fallback warnings remain. The default
  Turbopack build cannot follow the temporary cross-worktree `node_modules`
  symlink, so webpack was used only for isolated validation. No website deploy,
  App OTA, native build, payment or production mutation was performed.
- Release only after App API/Booking migration 044 and paired source are live.
  Then perform an approved isolated provider/customer demo and root-controlled
  website promotion.

## Training/course invoice parity — 2026-09-15

- Candidate branch `codex/invoice-parity-20260915`, based on current Site main
  `eb2b111`. Henric directly requested due date, email invoice request and
  payment/receipt parity with the mobile app. Supervisor owns promotion.
- Invoice cards consume API `payment_due_on` (HT26: 2026-09-28),
  `amount_due_sek`, `admin_discount_sek`, `traditional_requested` and
  `traditional_fee_sek`. They display line discounts, invoice-level discount,
  payable total, base training/course VAT, payment date and provider failures.
- The email invoice action clearly discloses the server fee (150 SEK for
  HT26) and resulting total before confirmation. The authenticated BFF calls
  `/training/invoices/{id}/request-traditional`; this records the staff/Fortnox
  handling queue, not an immediate email. Once requested, online payment
  buttons disappear to prevent double payment. Zero, paid and refunded
  invoices cannot create a new fee request.
- Swish and Stripe retain their shared App API owner-scoped charge endpoints.
  Swish callbacks from the account now open the invoice tab; the invoice feed
  refreshes on return/focus and for up to two minutes during a visible QR
  handoff. Stripe uses `{channel: "WEB"}` and the existing allowlisted Checkout
  handoff.
- The website now offers the same optional personnummer field when requesting
  a friskvård receipt. Only this field is forwarded, and it is never persisted
  in browser storage. Sent/paid invoices may request receipts; existing
  generated receipt downloads remain available in history.
- Verification: 163 unit tests pass, including BFF session/origin/ID rejection,
  deliberate client identity/fee spoofing, exact fee/total consent and Swish
  account return routing. Production build passes with the existing NFT and
  Profixio static-render warnings. Synthetic-backend browser checks exercise
  the real Next BFF, mobile/desktop presentation, request/receipt handling,
  Stripe handoff and Swish polling; no real payments or messages are sent.
- Remaining action: root verifies exact paired API release is live, promotes
  this candidate to pushed main and publishes through the existing Site Deploy
  panel or documented production `deploy.sh`. This worktree does not deploy.

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
