<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# thebeach.one — agent instructions

Canonical, vendor-neutral instructions for any agent (Claude Code, Codex, other)
working in this repository. Claude Code imports this file from `CLAUDE.md`.

The public website for The Beach (thebeach.one): Next.js 16 App Router,
React 19, TypeScript, Tailwind 4. It serves real customers — signups, course
registration, booking and payment flows — so treat it as production.

## Layout

| Path | Contents |
|---|---|
| `src/app/` | App Router routes (Swedish route names, `en/` for English) and `src/app/api/` route handlers |
| `src/components/` | React components |
| `src/lib/` | Domain logic and API clients (`appApi.ts`, `bookingApi.ts`, pricing, identity, payment return handling); `*.core.ts` files hold the unit-tested logic |
| `src/data/` | Static content data (JSON/TS) |
| `tests/` | `node --test` unit tests (`*.test.ts`) |
| `public/` | Static assets |
| `deploy/`, `deploy.sh`, `Dockerfile`, `Dockerfile.staging`, `workshop-entrypoint.sh`, `run-workshop.sh` | Container build and publish tooling |
| `scripts/` | One-off maintenance scripts (e.g. `coachkampanj-sync.mjs`) |

`README.md` is unmodified `create-next-app` boilerplate and mentions Vercel; it
does not describe this project. `DEPLOY.md` is the authoritative deployment
document.

## Commands (from `package.json`)

```bash
npm run dev         # next dev
npm run build       # next build — always run before pushing
npm run test:unit   # node --test tests/*.test.ts
npm run start       # next start
npm run lint        # eslint
```

There is no separate typecheck script; `npm run build` type-checks the project.

# Deployment — self-hosted (NOT Vercel)

The site is hosted on The Beach's own infrastructure: a Node container
(Node 20, `next start` on :3000) behind Apache. **Vercel is not used** — ignore
any old Vercel / `klyv/the-beach` references.

Flow (Henric owns the infra):
- **dev** — `beach.dev.thebeach.one`, this container = the workbench.
- Push to **`main`** → auto-deploys to **`staging.thebeach.one`** (prod-identical) for review.
- Promote **staging → prod** via the control panel in The Beach Admin UI
  (publish, restore staging, roll back, view diff/history).
- **No agent pushes straight to prod.** Always `npm run build` before pushing.

Repo: `git@github.com:thebeachvolleyclub/thebeach-site.git`.

Container/port map, the prod-only `deploy.sh`, the workshop provisioning script
and rollback via image tags are documented in [DEPLOY.md](DEPLOY.md) — read it
before touching anything deployment-related. Never hand-publish a container
port on anything except `127.0.0.1`.

# Git-regler (obligatoriska — flera bidragsgivare)

Det här repot är navet för thebeach.one. **GitHub `main` är hubben**: staging-
workshoppen (beachinfo-azure) är EN bidragsgivare bland flera — Henric och
Mattias pushar också från sina egna miljöer (t.ex. signupformulär, bansystem).
Förvänta dig uppströmsändringar när som helst.

- **Pull FÖRE allt nytt arbete**: `git pull` (rebase är förkonfigurerat).
- **Committa + pusha när ett moment är klart.** Lämna aldrig ocommittat arbete
  — det blockerar andras pull och kan gå förlorat.
- **Aldrig force-push. Aldrig `reset --hard`/`checkout --` över arbete du inte
  själv gjort** — committa eller stash:a det i stället.
- **Prod publiceras BARA från pushade commits på main** — publish-verktyget/
  panelen vägrar vid smutsigt eller opushat träd.
- Workshoppens standard-identitet är "The Beach Staging <github@thebeach.one>";
  sätt gärna din egen: `git config --global user.name/user.email`.

## Appägarskap och plattformsgräns

Webbägaren och dennes agent får självständigt ändra och publicera layout,
innehåll, intern implementation, affärslogik och buggrättningar inom sajtens
befintliga API- och dataåtkomst. Henric eller Supervisor behöver inte godkänna
vanlig sajtutveckling.

Om arbetet kräver en delad tabell/kolumn/migrering, ny åtkomst till en annan
tjänsts data, ändrat publikt API/MCP-kontrakt, identitet eller behörighet:
skapa ett plattformsärende i Klubbhuset med Business MCP-verktyget
`hq_create_platform_request` och `requesting_project="site"`. Fortsätt med det
arbete som inte korsar gränsen medan Supervisor granskar ärendet.

## Miljöer

- **Workshop/staging (valfri)**: /work/thebeach-site i staging-containern,
  `next dev` med hot reload på https://staging.thebeach.one
  (Google-SSO-gated). Permanent staging är inte ett publiceringskrav och kan
  avvecklas separat.
- **Prod**: https://thebeach.one — publiceras via Site Deploy-panelen
  (https://admin.thebeach.one/deploy) eller MCP-verktyget `publish_to_prod`.
- Detaljer: [DEPLOY.md](DEPLOY.md).

## Säkerhet och känsliga flöden

- Sajten hanterar riktiga kunder, betalningar (Stripe/Swish) och identitet.
  Kör aldrig något med externa sidoeffekter — publicering, betalningar,
  utskick — som en bieffekt av vanligt utvecklingsarbete.
- Committa aldrig hemligheter. Nycklar och tokens (t.ex. `APP_API_KEY`,
  `CLIENT_IP_SECRET`) läses från miljöns `.env` i respektive klon på servern
  (mode 600, gitignorerad) via `--env-file` — aldrig från repot. Se DEPLOY.md.
- Ändringar i betalnings-, konto- eller anmälningsflöden ska köra både
  `npm run test:unit` och `npm run build` innan de pushas.

## Agent Session and Handoff Protocol

This repository is worked on by agents from multiple providers (Claude Code,
Codex, and others). Provider session transcripts are archival material, not
startup context.

### Starting a session

1. Read this `AGENTS.md`.
2. Read `.agent/HANDOFF.md`.
3. Inspect real state: `git status`, `git diff`, `git log -5 --oneline`, and
   note which branch you are on — `main` is the hub and other people push to it.
4. Treat the repository as authoritative for what exists; treat the handoff as
   authoritative for the current objective, decisions and next action unless
   the repository contradicts it.
5. Read further documentation only as the task requires or the handoff points
   to (`DEPLOY.md` before any deployment work; the Next.js guides in
   `node_modules/next/dist/docs/` before writing framework code).
6. Do not read previous Claude/Codex transcripts merely to get up to speed;
   consult them only for a specific unresolved question.
7. If handoff and repository agree, continue from the documented next action
   instead of re-summarizing the project.

### During substantial work

Keep `.agent/HANDOFF.md` current at meaningful checkpoints: an implementation
decision, a completed stage, a non-obvious constraint, a debugging finding that
changes understanding, an important test failure, before a large or risky
change (payments, accounts, signup flows, deployment), and before switching
provider or ending a long session. Not after every trivial edit.

### Before ending or handing off

Update `.agent/HANDOFF.md` so another capable agent can continue without the
current transcript: objective, implementation state, decisions made, work
completed, relevant files, verification performed (whether `npm run test:unit`
and `npm run build` were run and their result), known failures and unverified
assumptions, open questions, and the exact next action. Write an operational
checkpoint, not a chronological narrative.

### Durable knowledge

Knowledge that outlives the current task belongs in this `AGENTS.md` or in
`DEPLOY.md` — not in the handoff. Move it there before clearing superseded task
state.
