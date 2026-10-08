# HQ #310: private personnummer for website licence requests

## User flow

The current-year request button opens an accessible form beneath its membership
confirmation. A full Swedish personnummer is required: `YYYYMMDD-XXXX` or twelve
compact ASCII digits. Outer whitespace is accepted. Client and BFF validate a
real nonfuture calendar date and Luhn over the final ten digits. No comparison
with the profile's birthday is made: an assigned date can legitimately differ.
Nothing is inferred or prefilled from a profile birthday.

The form explains that the number is used only for licence registration and is
available only to authorized club staff, not other players. Input has a label,
purpose/error descriptions, focus management and keyboard/Escape handling.
Black/white actions retain the existing membership-year grouping. The annual
server eligibility, paid-membership requirement, future-year gate, existing
request state and verified active-licence content are unchanged.

## Privacy, retry and boundaries

- `CompetitionLicenceAction.tsx` holds the number in local component memory only.
  It is cleared on cancel, submit (including an uncertain result), tab/unmount,
  account change and logout. Retry requires entering it again. No number is put
  in browser storage, URLs, logs, public profile fields, email or analytics.
  The form opts out of common capture attributes and has no field name for
  generic form serialization.
- The original opaque retry key remains in parent memory/sessionStorage; an
  existing owner-bound legacy key is reused. A synchronous single-flight ref
  stops a second click before React's pending state has rendered.
- `AccountPortal.tsx` aborts pending licence operations at account/logout/unmount
  boundaries and checks the current account before applying outcomes. A closed
  or unmounted form cannot apply a stale local result. Lifecycle refresh uses
  the same current-account guard.
- The same-origin authenticated BFF keeps the HttpOnly bearer server-side and
  sends only `{idempotency_key, personnummer}` to the existing API. Normalization
  lives in `licencePersonnummer.core.ts`. It trusts neither a browser user ID,
  membership year nor DOB. Validation/API errors preserve HTTP status but use
  fixed messages without upstream input/context. The POST response is an
  allowlisted existing public request DTO, excluding private/unknown fields.
  Public text is also scrubbed of full-number patterns.
- Existing GET/status contract remains unchanged. The paired backend owns the
  restricted staff record/migration and must be released first. This website
  candidate creates no table, permission, runtime flag or new service.

## Verification

Fourteen focused tests pass, covering validation, leap dates, century/non-ASCII/
future/checksum rejection, origin/session denial, exact whitelisted forwarding,
same-key retries, sanitized errors and public response filtering, plus existing
annual eligibility/licence content. Next production webpack build passes.
The webpack option is the established isolated-worktree dependency-symlink
workaround, not a production configuration change.

The built-site browser journey passes at 320px, 390px and 1280px, using only
intercepted fictional BFF responses: focus and validation, no PN in storage,
cancel/tab/logout clearing, one normalized submit despite a double click,
uncertain failure followed by the original-key retry, current/future-year
gating, and an old parent's delayed response after switching to a child.
Screenshots contain only an empty field and fictional account data. The script
owns and stops its temporary preview and private Chrome process.

```bash
node --test tests/licencePersonnummer.test.ts tests/accountCompetitionLicence.test.ts
npm run build -- --webpack
node scripts/verify-licence-personnummer-browser.mjs
```

Full native unit suite: 204 pass, one unchanged `appEvents.test.ts` extensionless
`kalender` import failure (previous production baseline 196 pass/that same one
failure). AccountPortal lint retains its three pre-existing effect errors/five
warnings. No unrelated calendar, family notice or baseline lint repair is made.

## Release

Root owns exact website promotion/build/publication and production verification
after the paired backend migration/API is live. Follow the existing `DEPLOY.md`
and record the former deployed revision/image for rollback. This isolated
feature branch is not main and does not deploy or perform real account writes.
Any live test uses root-approved reversible synthetic records and cleanup.
