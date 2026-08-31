# Current Work State

## Account training recordings and full court ranges

- Branch: `codex/account-training-recordings-20260831`, based on website
  production head `4ff3a75`.
- The authenticated `Mina träningsgrupper` account section now puts a compact
  recording strip directly inside each corresponding training-group card.
  Every group independently shows at most four recordings from its own newest
  recorded calendar week, so a newer recording in another group cannot replace
  it. The 96 px thumbnails open the individual YouTube recordings.
- Mobile and desktop keep each group strip to one horizontally scrollable row.
  A single `Hela videoarkivet` link appears after the complete group list and
  opens the existing authenticated `https://tv.thebeach.one/mina-traningar`
  archive. The profile never renders the semester archive itself.
- The private/no-store BFF `GET /api/account/training-recordings` forwards only
  the existing host-only account bearer to the App API training-session
  endpoint. It reduces the response to per-group validated YouTube IDs, four
  latest-week previews per group, and court metadata; no browser-supplied
  identity is accepted.
- The group summary now derives the complete court set from the existing
  session contract and compacts consecutive courts: Borealis `9, 10` renders
  `Banor 9–10`; Sirocco `6, 7, 8, 9, 10` renders `Banor 6–10`.

## Verification

- `npm run test:unit`: 143/143 pass.
- `npm run build`: pass; existing Profixio static-generation fallback warnings
  remain non-fatal.
- Targeted ESLint for new route/core/config/test: pass. `AccountPortal.tsx`
  still reports the repository's three pre-existing React effect lint errors.
- Mobile browser verification at 390 px with three mocked authenticated groups
  confirms 3/3 group-specific strips, 96 px thumbnails, independent newest-week
  dates, full court ranges, direct video links, and exactly one archive action
  below the groups.

## Deployment

- Functional commit `58cdc1e` was pushed to `main` and deployed to production
  as `thebeach-site:58cdc1e` on 2026-08-31. The deploy health check and live
  `/konto` and BeachTV root both returned 200. Anonymous access to the private
  recordings BFF returned 401 with `Cache-Control: private, no-store`, as
  required.
