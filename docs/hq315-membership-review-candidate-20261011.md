# HQ #315 — Membership evidence and review candidate

Henric-owned reconciliation; candidate branch
`codex/membership-reconciliation-site-20261011` from current `origin/main`.
No production deployment, provider call or personal-data mutation from this
worktree. Root owns coordinated backend-first promotion and website publication.

Account → Membership keeps confirmed memberships visible during legacy matching
review. Optional Profixio evidence labels membership as confirmed, explains no
second membership fee is needed, and does not show a fabricated payment amount,
purchase date, payment provider or receipt. The existing NATIVE/MATCHI wire
contract is preserved with additive evidence metadata.

Optional `membershipReview.blockedYears` makes review copy year-specific. A
completed review without a credible paid candidate allows ordinary available
membership-year options; possible previously paid years stay protected by
backend eligibility. Initial matching remains fail-closed for payment. No
auth/session, family switch or account-cleanup flow is changed.

## Verification

- Focused membership tests: 10 pass.
- Full `npm run test:unit`: 206 pass; the sole unrelated baseline failure is
  Node 22's missing extension in `src/lib/app-events.ts` importing `./kalender`.
  That source and test are unchanged from origin/main.
- `npm run build -- --webpack`: pass (88 generated pages, TypeScript pass).
  Default Turbopack rejects the reused node_modules symlink outside this isolated
  worktree; webpack is the existing Next build backend, not a new architecture.
- `node scripts/verify-membership-review-browser.mjs`: actual built AccountPortal
  passes nine intercepted cases at 320/390/1280px, zero page errors/overflow/API
  mutations. Cases cover confirmed licence membership plus old review,
  purchase available without credible prior payment, and protected current-year
  payment with next-year availability. No fake financial details are displayed.

Screenshots `/tmp/hq315-site-membership-{0,1,2}-{320,390,1280}.png` contain
fictional test identity only. These checks do not prove production publication
or a real payment. Root retains guarded deployment and live smoke verification.
