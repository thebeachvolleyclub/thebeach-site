# Current Work State

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
