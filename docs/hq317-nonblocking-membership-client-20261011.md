# HQ #317 — Nonblocking membership website candidate

Henric-owned youth/legacy-membership follow-up. Isolated branch
`codex/nonblocking-membership-site-20261011`, base canonical `72eaa60`.
Root owns backend-first promotion and normal website publication. This worktree
has not pushed main, deployed, called a real provider or mutated personal data.

## Customer behavior

Account → Membership preserves the backend's confirmed annual membership and
licence facts. A confirmed current-year membership or paid annual purchase does
not display a contradictory legacy-account review banner. Otherwise, unresolved
legacy diagnostics may show optional neutral missing-history guidance without
claiming a human review, requiring support or prohibiting all purchases.

Only the defined `birthdate_required` prerequisite hides the complete product
list. An old `purchaseEligibility: {available: false, reason: null}` legacy hold
does not hide individually returned annual options. Existing per-option
availability, owned-year exclusions, actual pending/paid annual purchases,
Swish-number validation and server 409 purchase guards remain authoritative.
Current membership never suppresses the next year's available membership.

No source payment is invented from membership evidence, no course payment is
converted into membership, and missing licence evidence does not render an
active licence card. BFF bearer/HttpOnly session/private-cache/same-origin
contracts, family switches, account drafts and licence input flows are unchanged.
The coordinated Book/App v4 read/claim contract must be verified before root
publishes this candidate.

## Verification

- Focused membership/licence tests: 19 pass.
- Full `npm run test:unit`: 209 pass, one known unchanged baseline failure:
  Node 22 cannot resolve `src/lib/app-events.ts` importing extensionless
  `./kalender` in `tests/appEvents.test.ts`. Neither source nor test is changed.
- `npm run build -- --webpack`: pass, TypeScript pass, 88 generated pages.
  Webpack is the documented existing build backend for worktrees sharing the
  canonical node_modules cache; default Turbopack's external-symlink limitation
  is not worked around by any source/configuration change.
- `node scripts/verify-membership-review-browser.mjs`: 12 actual-built
  AccountPortal journeys pass at 320/390/1280px, zero page errors, horizontal
  overflow or production API writes. Cases: confirmed Profixio membership;
  manual legacy review with available current/future purchases; pending
  matching with an available purchase; paid legacy youth membership plus an
  available future year and no licence facts. All use the obsolete false/null
  global gate deliberately. Six fully intercepted synthetic purchase clicks
  reach a mocked server 409 once each, displaying the duplicate-payment error.

Screenshots: `/tmp/hq317-site-membership-{0,1,2,3}-{320,390,1280}.png`, fictional
identity only. Browser checks prove rendered candidate behavior, not production
publication or a real payment/provider integration. Existing phone inputs are
unchanged; no physical-device keyboard proof is claimed.

BeachTravels has no first-party club-membership consumer for this Booking
surface; its camp/group membership and shared identity code are unaffected.
