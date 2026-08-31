# Current Work State

## Account training recordings and full court ranges

- Branch: `codex/account-training-recordings-20260831`, based on website
  production head `4ff3a75`.
- The authenticated `Mina träningsgrupper` account section now shows a compact
  shelf with at most four recordings from the newest recorded calendar week.
  Thumbnails open the individual YouTube recording; `Hela videoarkivet` opens
  the existing authenticated `https://tv.thebeach.one/mina-traningar` archive.
- Mobile keeps the shelf to one horizontally scrollable row; wider screens use
  a two/four-column grid. The profile never renders the semester archive.
- New private/no-store BFF `GET /api/account/training-recordings` forwards only
  the existing host-only account bearer to the App API training-session
  endpoint. It reduces the response to validated YouTube IDs, four latest-week
  previews, and court metadata; no browser-supplied identity is accepted.
- The group summary now derives the complete court set from the existing
  session contract and compacts consecutive courts: Borealis `9, 10` renders
  `Banor 9–10`; Sirocco `6, 7, 8, 9, 10` renders `Banor 6–10`.

## Verification

- `npm run test:unit`: 143/143 pass.
- `npm run build`: pass; existing Profixio static-generation fallback warnings
  remain non-fatal.
- Targeted ESLint for new route/core/config/test: pass. `AccountPortal.tsx`
  still reports the repository's three pre-existing React effect lint errors.
- Mobile browser verification at 390 px with mocked authenticated data confirms
  the compact shelf, partial next-card scroll affordance, full court ranges,
  direct video links, and archive action.

## Deployment

- Functional commit `598e7ff` was pushed to `main` and deployed to production
  as `thebeach-site:598e7ff` on 2026-08-31. The deploy health check and live
  `/konto` both returned 200. Anonymous access to the new recordings BFF
  returned 401 with `Cache-Control: private, no-store`, as required.
