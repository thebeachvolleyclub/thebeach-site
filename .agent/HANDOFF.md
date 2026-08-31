# Current Work State

## Account training recordings and full court ranges

- Branch: `codex/account-training-recordings-20260831`, current with website
  production `main` through the account information-architecture release.
- The authenticated `Mina träningsgrupper` account section now puts a compact
  recording strip directly inside each corresponding training-group card.
  Every group independently shows at most four recordings from its own newest
  recorded calendar week, so a newer recording in another group cannot replace
  it. The 96 px thumbnails open the individual YouTube recordings.
- Mobile and desktop keep each group strip to one horizontally scrollable row.
  A single `Hela videoarkivet` link appears after the complete group list and
  opens the existing authenticated `https://tv.thebeach.one/mina-traningar`
  archive. The profile never renders the semester archive itself.
- Every thumbnail includes a high-contrast court overlay such as `Bana 9` or
  `Bana 10`, allowing players to choose the correct recording without opening
  each video. The overlay does not increase the 96 px thumbnail footprint.
- The private/no-store BFF `GET /api/account/training-recordings` forwards only
  the existing host-only account bearer to the App API training-session
  endpoint. It reduces the response to per-group validated YouTube IDs, four
  latest-week previews per group, and court metadata; no browser-supplied
  identity is accepted.
- The group summary now derives the complete court set from the existing
  session contract and compacts consecutive courts: Borealis `9, 10` renders
  `Banor 9–10`; Sirocco `6, 7, 8, 9, 10` renders `Banor 6–10`.

## Account navigation and overview

- Courses are no longer folded into `Träningsgrupper`. The authenticated
  account navigation now includes a distinct `Kurser` tab between
  `Träningsgrupper` and `Bokningar`, and both `#kurser` and `#courses` deep
  links open it.
- Purchased/current course content and its invoice hand-off moved intact to
  the new Courses tab. The Training Groups tab now contains only signup,
  current-group, recording, and training-related content.
- Overview stats now follow the applicable navigation order:
  `Träningsgrupper`, `Banor bokade`, `Kommande bantider`, then
  `Fakturor att hantera`.

## Verification

- `npm run test:unit`: 144/144 pass.
- `npm run build`: pass; existing Profixio static-generation fallback warnings
  remain non-fatal.
- Targeted ESLint for new route/core/config/test: pass. `AccountPortal.tsx`
  still reports the repository's three pre-existing React effect lint errors.
- Mobile browser verification at 390 px with three mocked authenticated groups
  confirms 3/3 group-specific strips, 96 px thumbnails, independent newest-week
  dates, visible per-video court labels, full court ranges, direct video links,
  and exactly one archive action below the groups.
- A second 390 px authenticated browser check confirms the complete tab order,
  the overview stat order, the isolated course panel with a purchased course,
  and the absence of training-group content from that panel.

## Deployment

- Functional commit `e875afc` was pushed to `main` and deployed to production
  as `thebeach-site:e875afc` on 2026-08-31. The deploy health check and live
  `/konto` and `/konto#kurser` both returned 200. Anonymous access to the
  private course endpoint returned 401, as required.
