# Website family profile parity

Henric requested website parity after App/API HQ #307 was completed. This is
separate work on the website account page, not another hosted Expo export.

## Behavior

`/konto#familj` lists server-authorized BeachIDs and allows switching between a
parent's own profile and existing shared-inbox/explicit child profiles. The
active person's name and BeachID remain visible. The normal profile, membership,
training, course, booking and invoice views then use that person's session.

An older session can prove its inbox once inside this section. Verification
preserves the exact currently selected BeachID, even when it is not the first
login option. A wrong code does not replace or revoke the current session.

An eligible parent can create a private child profile using the existing API.
The form explicitly confirms parental responsibility and the current contact
address. Creation leaves the parent logged in; the child then appears as a
switch option. Name/DOB/contact conflicts remain server decisions. Retrying a
lost create response uses the same key and does not allocate another BeachID.
The already released API queues retained MATCHi reconciliation automatically;
the website does not infer paid membership from an email or name.

## Boundaries and implementation

- `AccountFamily.tsx` supplies the Swedish family UI. Existing account panels
  are reused rather than duplicating child-specific payment/profile logic.
- `/api/account/family/{profiles,children,switch,verify-inbox}` is a same-origin
  BFF over existing `/matchmaking/family/*` and verified-login endpoints.
  Opaque bearer tokens and login challenges never enter browser-readable JSON,
  localStorage or sessionStorage.
- Switching uses a short-lived HttpOnly receipt so the original result can be
  recovered if Set-Cookie succeeds but its response body is lost. Recovery is
  only for the exact original source session, BeachID and request key; the API
  rejects revoked targets and all unrelated/stale authority.
- Successful switches/proof/logout explicitly reload the document. Replacing
  the same account hash by itself is insufficient because it is only fragment
  navigation. All old forms, feeds, media and polling closures are discarded.
- Legacy unscoped course/license retry drafts are archived under their account
  and restored only when that person returns. Already owner-scoped payment keys
  and unrelated consent/preferences are preserved. Unknown legacy drafts are
  retained unassigned rather than attributed to a new child.
- `AccountSessionBoundary.tsx` refreshes other open tabs and restored back-cache
  documents after a session boundary. It creates no new service or auth model.
- Shared inbox login is not inferred guardianship. No camp, Junior Event,
  cancellation, payment ownership, admin/MCP privilege or backend policy is
  broadened. No schema, runtime flag, API deployment, migration or OTA is needed.

## Verification

Focused family BFF/authorization/replay/draft tests: 14 passed. Focused lint
passes, with the normal unoptimized-avatar image warning. Next 16 production
build passes with the established external Profixio static-render fallbacks.
Standalone `tsc` and account-portal lint retain their existing baseline test
configuration/effect-rule diagnostics; new source has no diagnostic.

The full native Node unit suite has one pre-existing extensionless import
failure in `appEvents.test.ts`, reproduced on untouched canonical main
`4a3d5fa`. Baseline is 182 passing/one failing test-file. Family changes do not
change calendar source or that test. The candidate has 196 passing tests and
that same one failing test-file.

The actual built website and real Next BFF journey passes at 375px and 1280px:
current-BeachID legacy inbox proof (including a wrong code), implicit child
switch/back, own-only membership/course/training/booking/profile feeds, retry
draft isolation and return, another open tab following the switch, private
child creation with a completed-but-lost response and exact retry, child
profile save, HttpOnly switch replay, unrelated-person and cross-origin
denials, and logout in both tabs. Desktop also verifies the normal email login
chooser selects the parent exactly. There is no horizontal overflow. Reviewed
screenshots: `/tmp/site-family-parity-card-375.png` and
`/tmp/site-family-parity-card-1280.png` (synthetic identities only).

Run the actual built Next BFF/browser journey against its loopback synthetic
App API (temporary listeners are owned and stopped by the script):

```bash
npm run build -- --webpack
PUPPETEER_MODULE=/home/henric/thebeach-app-v2/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js \
CHROME_PATH=/usr/bin/google-chrome node scripts/verify-family-account-browser.mjs
```

The webpack argument is the established isolated-worktree workaround for the
shared dependency symlink; it does not alter the production Docker build.
Live production verification was completed after root-controlled promotion;
the separate website release is recorded below. Private
browser tests do not establish production MATCHi reconciliation or change any
financial data. No real account, email, MATCHi row or provider is used by this
private browser check.

## Release and rollback

Root owns separate website production promotion/verification. Follow `DEPLOY.md`
and publish only the explicit tested revision pushed to `origin/main`, using the
existing Site Deploy publisher or documented production `deploy.sh`. Preserve
staging workshop edits and the primary development checkout. Record the exact
previous production image/revision before publishing; rollback is the same
documented deployer with that revision. There is no new persistent listener or
restart procedure beyond the existing website container/runbook.

## Production release — website HQ #308

Released 8 October 2026 after Henric's direct production follow-up. Root
selectively promoted the exact reviewed candidate tree `e0782a83` onto fresh
canonical `4a3d5fa` as `19334b2a08599f96f991eba96bdcc358434dba25`, with an
explicit production-promotion trailer. Independent root focused tests: 14 pass;
local Next webpack production build and the real Docker/Node 20 production
build both pass. Source was pushed to `origin/main` before publishing.

Normal `DEPLOY.md` `deploy.sh prod <exact-sha>` completed successfully. Running
image is `sha256:57c3def1ec8137c808df86cb811a16e99b6319751cfadaaa27b084e1226cc7ab`,
started at 12:23:44 UTC, healthy on loopback-only port 3000 with unchanged
512MiB/1CPU limits. `/`, `/konto`, `/events`, `/kalender`, `/om-oss`, `/trana`
all return 200 through public TLS; the public account page contains the new
family copy. Source is clean and matches pushed main. Publishing was not frozen.
Previous revision `4a3d5faf2e99d5bce6a6583233851beb986e2790` and image
`sha256:a89e33679a117ab7ca9680d412d42675fded086efdca29110c64d46a70d856fa`
are retained for documented rollback. Staging workshop `cb719c6`, volumes,
primary local checkout and unrelated App API work were not changed.

Real public-site/Next-BFF/App-API browser checks used uniquely marked reserved
fictional fixtures only. The verified inbox chooser selects exact parent 5334;
existing implicit child 5335 appears as `shared_email` without a guardian link.
375px UI switching parent → implicit child → parent passes exact BeachID,
Secure/HttpOnly session and isolated membership/course/training/booking feeds.
Exactly one private child 5337 is created through the live UI, leaving the
parent active; switching to the new child and returning passes. 1280px repeats
existing-family switching without creating another child. Unrelated 5336 is
denied with 403 and is never materialized as an app principal.

The first live verifier passed those flows but reported a generic failure at
logout; it did not preserve the cause. A focused repeat explicitly awaits the
full-document navigation before testing the anonymous page. It passes logout
200, anonymous family 401, anonymous session with no profile, signed-out UI,
no synthetic name/contact/email draft, cleared session/recovery/challenge
cookies, retained device, zero browser errors and bounded mutation counts.
No application change was needed. The independent private built-site rerun
passed 375px and reached all 1280px assertions, but Chrome context disposal
timed out during teardown; that rerun is not described as fully green. The
earlier candidate browser checks and final real production checks are distinct.

Exact-marker post-flow inspection confirms both children private/no privileged
roles, no inferred guardian link for the implicit child, one explicit link for
the created child, one stable claim outbox per child before custom avatar, and
normal v2 NO_MATCH delivery with zero customer/membership projection. Own
fixtures 5334–5337 were retired/private, their explicit link retired and all
credentials/challenges/contexts/devices/codes/switch receipts removed; cleanup
assertions pass and audit/claim receipts remain. No real customer, imported
membership, provider, payment, booking or competitive-licence write occurred.
No email was sent. No backend/schema/configuration or OTA release was needed.

Private verifiers/evidence remain under owner-only
`~/.local/share/beach-recovery/site-family-release-20261008/`. Hashes:

- Fixture control: `edfadc92ae8ad9c0dac624c4a561b77968eb21e0076aa41c0b22228e832a84ed`.
- Live family browser: `14c05af062a272fdcaa7f4ff0e7f5aeb8f9339318ffcfc9f80374bfd11cf5f99`.
- Focused logout: `1f4356a9a8daaf9768a4df9a15dc9af72d0db248480eb9d98a4a1580f2797bfc`.

The source/runtime proof is website HQ #308, not a reopening of completed
App HQ #307/private release #44. These final documentation-only notes are
pushed on the isolated evidence branch, preserving the published source.
