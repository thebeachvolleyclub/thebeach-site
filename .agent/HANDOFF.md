# Current Work State

## HQ #339 production verification — 2026-10-29

- Accepted candidate `7bd707a` was selectively promoted onto already published
  `6a441db` as `2c2497a1f2156803b4f7fabff810fe9cb9ab078a`, preserving David's
  intervening changes. The existing `deploy.sh prod <exact-sha>` published it;
  production image is `sha256:e6561e7dae33b8613ef57ce78ce463d75e54e7c07755d004b84f1d74e3db8041`.
- Exact promoted build and 13 focused tests pass. All 21 intercepted browser
  journeys passed against both the promoted loopback build and the actual
  public `https://thebeach.one` deployment. Fourteen public JS/CSS assets match
  the live container byte-for-byte, including the new recovery marker.
  `/boka`, `/en/book` and booking config return 200; anonymous mine returns 401.
- The public test initially exposed a harness-only latency race: reading the
  intercepted checkout before it was sent. The harness now explicitly awaits
  that request; the complete rerun passes. This follow-up changes testing and
  documentation only, not the published product source above.
- API/OTA delivery and retained rollback evidence are recorded in App
  `docs/releases/2026-10-29-swish-callback-first-recovery.md`. No customer charge,
  refund or notification was sent for testing. Physical native pickup and a
  real uncertain bank result remain unobserved; Henric owns that follow-up.
- Root's temporary preview on port 3991 is stopped. No Site publication window
  remains active. The original checkout and David's workshop were preserved.

## HQ #339 callback-first court payment recovery — website candidate 2026-10-29

- Isolated feature branch `codex/hq339-site-swish-recovery-20261029` starts from
  production Site `89bb6df`. The original checkout is preserved. Root owns paired
  API release, deliberate production promotion and guarded Site Deploy publish;
  this candidate does not deploy or push `main`.
- Lost checkout responses automatically replay only the exact owner-bound
  original submission, with five bounded retries and no provider launch. Generic
  409/429, malformed success and network errors retain that attempt; only proven
  preallocation conflicts clear it. Known booking IDs persist and resume status
  reads only, including after reload. Status refresh remains optional.
- Financial review and paid-but-expired/cancelled bookings never become a new
  unpaid checkout. Either authoritative paid field is honored; completed refunds
  win over old paid/review flags. Normal Swish requests explicitly tell users to
  approve the existing request; verification/review does not ask them to pay again.
  The recovery panel explicitly sets dark text on its white background.
- Focused recovery/credit tests: 13 pass. Full Node suite: 207 pass, three baseline
  failures independently reproduced on unchanged `89bb6df` (two `next/navigation`
  Node imports and existing course youth-price copy). Focused lint has zero errors
  and one unchanged image warning. No dependencies or build configuration changed.
- The final Next production build passes (94 pages). All 21 intercepted browser
  journeys pass against that fresh build, including actual Swish callback
  completion, known-ID status-only recovery, bounded malformed/409/429 retries,
  refund/review truth, dark-text contrast and neutral paid-late amount wording.
  All account/payment data is synthetic; no customer/provider writes occur.
  See `DEPLOY.md` and `scripts/verify-subscription-credit-browser.mjs`.

## HQ #310 licence personnummer — 2026-10-08

- Website candidate `codex/hq310-licence-personnummer-site-20261008`, isolated at
  `/home/henric/worktrees/hq310-licence-personnummer-site-20261008`, begins from
  deployed/pushed `19334b2`. Primary checkout and production source are untouched.
- Current-year licence action now opens an accessible, purpose-explained full
  personnummer form. Shared client/BFF normalization requires 12 ASCII digits,
  a real nonfuture date and final-ten Luhn; no profile-DOB match or inferred
  personnummer. Existing year, membership and active-licence gates are preserved.
- Number stays in component/request memory only and clears on close/submit/
  unmount/account/logout. Only the opaque existing retry key can persist.
  Single-flight, abort/current-account and guarded refresh protect retries and
  stale-account outcomes. BFF sends only normalized number+key under server-only
  HttpOnly authority and strips private fields/input-echoing error data.
- 14 focused tests pass; private built-site browser passes 320/390/1280px form,
  normalized same-key retry, no storage, clearing, annual gating and delayed
  old-parent result isolation. Production webpack build passes. Full suite is
  204 pass/one unchanged calendar-import baseline failure; portal lint's prior
  3 errors/5 warnings are not repaired. Empty-field screenshots only.
- Paired backend/migration is separately owned; root must release it before
  exact website promotion and guarded publish/live verification. No production
  account write, deployment, main push, schema/config or family-notice edit here.
  Details: `docs/licence-personnummer-20261008.md`.

## Website family profile parity — 2026-10-08

- Henric directly requested a sub-agent to ensure the actual website supports
  managing own/child profiles, quick switching and new child creation. App/API
  HQ #307 is completed and is not reopened by this website follow-up.
- Candidate branch `codex/web-family-parity-20261008` starts from fresh canonical
  `origin/main` `4a3d5fa`, isolated at
  `/home/henric/worktrees/web-family-parity-20261008`. Primary checkout is untouched.
- Added `/konto#familj` and authenticated, same-origin BFF routes over the
  already deployed family/login APIs. Proof selects the exact current BeachID;
  shared email never implies guardian/admin roles. Tokens/challenges/replay
  receipts stay HttpOnly. Child create retains its retry key and private default.
- Full-document account boundaries discard old views, restore only owner-bound
  retry drafts, refresh other tabs and prevent stale browser-back cached accounts.
- 14 focused tests and focused lint pass; production webpack build passes.
  Full suite is 196 pass/one pre-existing appEvents import failure, reproduced
  on untouched main. Native tsc/account lint baseline issues are not repaired.
  Real built-site/BFF browser journeys pass at 375px and 1280px: implicit switch
  and return, current-BeachID inbox proof, isolated feeds/drafts/other tabs,
  private child create/lost-response replay/profile save, HttpOnly switch replay,
  unrelated/cross-origin denial, logout and normal desktop login selection.
  Screenshots reviewed; no horizontal overflow. All fixtures are loopback-only,
  in-memory; no production/provider write or real financial claim was used.
- Root controls production promotion and verification after exact candidate
  commit/push. No website/backend/schema/OTA production mutation performed here.
  Details/run commands: `docs/family-profile-parity-20261008.md`.

## My Practices training-group disclosure — 2026-10-01

- Objective: when an account has multiple active training groups, keep each
  group collapsed by default so the group names form a compact overview; an
  account with exactly one group remains expanded by default.
- Implementation on current `main` replaces each group card in
  `AccountPortal.tsx` with an accessible native `details`/`summary`. The
  collapsed row shows the group name and expand indicator. Schedule, courts,
  and that group's latest video thumbnails remain inside the expanded panel.
- Contract coverage in `tests/accountTrainingRecordings.test.ts` verifies the
  conditional default-open rule and disclosure markup. Full unit suite: 183
  passed. `npm run build` passed with only the established NFT/Profixio fallback
  warnings. Desktop and 375px mobile browser checks confirm all multi-group
  panels start closed, an opened group reveals schedule/videos, the indicator
  rotates, and there is no horizontal page overflow.
- Repository-wide `npm run lint` remains red on the existing baseline (13
  unrelated errors in legacy effect/script code); no diagnostic points at the
  changed lines.
- Released to production from pushed commit
  `f76e4d730a1b09356aab97a1804f4b0d21b56802` (implementation in `4d1a5b9`).
  The prod container reports healthy on loopback-only port 3000; `/`, `/konto`,
  `/trana`, `/events`, `/kalender`, and `/om-oss` all returned HTTP 200 through
  the public Apache/TLS endpoint. No follow-up work remains for this objective.

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
