# Current Work State

## Objective

Prevent concurrent website calendar renders from stampeding BeachTV tournament
lookups and exhausting BeachTV's database connection pool (HQ incident #227).

## Current Status

Implementation is complete on `codex/hq227-beachtv-calendar-singleflight`, based
on `origin/main` commit `3230ed2`. It has not been deployed or merged to `main`.

`src/lib/beachtv-tournaments.ts` now shares in-flight lookups across concurrent
calendar renders, caches positive and 404 results for the existing six-hour
freshness period, and limits all lookups in the process to four simultaneous
BeachTV requests. Transient failures remain uncached so a later render can
recover immediately. The existing BeachTV URLs, four-second timeout and
calendar fallback remain unchanged.

`tests/beachtvTournamentLinks.test.ts` covers cross-render single-flight,
process-wide bounded concurrency, negative-result caching and transient-error
recovery.

## Verification

- `npm run test:unit`: pass, 147/147.
- `npx eslint src/lib/beachtv-tournaments.ts tests/beachtvTournamentLinks.test.ts`:
  pass.
- `npm run build`: pass. The existing Profixio static-render fallback messages
  and NFT tracing warning were emitted but did not fail the build.
- Full `npm run lint`: still fails on eight pre-existing errors outside the
  changed files (CookieConsent, DesktopStickies, RichText, AccountPortal,
  EventPhotoMarquee and EventRequestFormClient).

## Next Action

Review the bounded change, promote it through the normal Site release flow if
accepted, and verify concurrent `/kalender` renders plus BeachTV pool/502
telemetry in production before resolving HQ incident #227.
