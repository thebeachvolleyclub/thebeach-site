# Website account gender parity — 29 October 2026

## Contract and boundaries

The App API remains authoritative. Its user profile and identity-onboarding
state return `gender` (`herr`, `dam`, `ickebinar`, or null) and the optional
server-owned `gender_required` flag. Only an explicit `true` flag makes the
website require a choice. An absent flag is compatible with older servers;
completed historical accounts with missing gender remain usable.

Both the account portal and the inline account-creation form on course pages
show the three explicit choices. Neither guesses a gender nor preselects one.
New-profile completion cannot save or hand back to a signup page while a
required choice is missing. Profile/identity responses repopulate the choice
from canonical data. Logout, account switching and new login attempts clear
person-specific drafts. Existing duplicate-review and name/date-of-birth
guards are retained. Resumed duplicate-review or merge-pending drafts that
predate this requirement have a gender-only completion card; it preserves
the identity revision and previous answers rather than restarting review.

The same-origin identity and profile BFFs forward only a validated, explicit
gender value. Omission is allowed by the transport for historical profiles;
the App API decides whether it is required. Provided null, empty or unknown
values are rejected with 422. Browser-supplied `gender_required` is never
forwarded or trusted.

Child creation still requires an explicit choice. Its existing canonical
payload accepts `M`, `W`, and now `X`, preserving the App API's exact
`X` ↔ `ickebinar` mapping. No family relationship or ownership is inferred.
The backend must support this enum before website production promotion.

No schema, login/session model, booking, course enrolment, price or payment
implementation is changed by this website candidate.

## Verification

- Matching locked dependencies installed in the isolated feature worktree.
- Focused profile, family, identity, course payment and promotion tests: 61/61.
- Full candidate unit suite: 214 passed, three pre-existing failures.
- Unchanged `ec62b00` base, isolated checkout and same dependencies: 207 passed,
  the identical three failures. The seven extra tests all pass.
- Existing failures: Node native test imports cannot resolve extensionless
  `src/lib/kalender` (`appEvents`) and `next/navigation`
  (`beachtvTournamentLinks`); the fallback course-copy test already contains
  the youth-price text `395 kr`. These are not changed here.
- Scoped gender helper/BFF ESLint check passes.
- Final production webpack build and Next TypeScript verification pass.
- Product-source-only TypeScript check passes. Plain whole-project `tsc`
  includes baseline Node-test `.ts` import/configuration errors; no repository
  compiler settings were loosened to hide them.

The browser verifiers start and stop their own loopback Next instance and a
synthetic App API. They never use real accounts, production data, payments,
emails or notifications:

```sh
NODE_OPTIONS=--max-old-space-size=1536 npm run build -- --webpack
PUPPETEER_MODULE=/path/to/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js \
CHROME_PATH=/usr/bin/google-chrome node scripts/verify-profile-gender-browser.mjs
PUPPETEER_MODULE=/path/to/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js \
CHROME_PATH=/usr/bin/google-chrome node scripts/verify-family-account-browser.mjs
```

The profile verifier covers 390px/1280px account and inline-course completion,
all three gender choices, blank-required blocking, canonical reload,
historical null/absent-capability compatibility, invalid-value 422s,
anonymous 401s, cross-origin 403s and exact child M/W/X forwarding. The family
verifier covers current-person proof, permission denial, switching and stale
tabs, draft isolation, child creation replay and logout; desktop child
creation explicitly exercises `X`.
Resumed duplicate and merge drafts are exercised on both completion surfaces
and both viewport sizes, retaining identity status, revision, names, date of
birth and candidate decisions after the gender-only save.
All 24 profile/inline/draft journeys and BFF tables passed, with zero browser
errors. The full existing family verifier passed at 375px and 1280px, including
the desktop `X` choice. Phone/desktop screenshots were visually inspected.
All temporary listeners and owned Chrome instances were stopped afterward.

Production promotion/deployment and live verification belong to the root
Supervisor release owner, not to this feature branch or its browser scripts.
