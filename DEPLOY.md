# Deploying thebeach-site (thebeach.one)

This site runs as **Docker containers on beachinfo-azure**, behind the Apache
reverse proxy — the pilot of the prod-container architecture
(`supervisor/platform/prod-container-architecture.md`). TLS terminates at
Apache; the containers speak plain HTTP on host loopback only.

## Port / host map

| Env | Clone on box | Container | Host port (loopback) | Public vhost |
|---|---|---|---|---|
| prod | `/home/beachinfo/thebeach-site` | `prod-thebeach-site` | `127.0.0.1:3000` | `thebeach.one`, `www.thebeach.one` |
| staging | `/home/beachinfo/thebeach-site-staging` | `staging-thebeach-site` | `127.0.0.1:3001` | `staging.thebeach.one` |

Apache vhosts: `/etc/apache2/sites-available/thebeach.one{,-le-ssl}.conf` and
`staging.thebeach.one{,-le-ssl}.conf` (ProxyPass to the loopback port). Certs
are Let's Encrypt via certbot, auto-renewed by `certbot.timer`.

## Deploy

From the env's clone on beachinfo-azure, as user `beachinfo`:

```bash
# staging from main
cd /home/beachinfo/thebeach-site-staging && ./deploy.sh staging main

# prod from main (manual publish only)
cd /home/beachinfo/thebeach-site && ./deploy.sh prod main
```

`deploy.sh` does: `git fetch` + detached checkout of the ref → `docker build
-t thebeach-site:<git-short-sha> .` → retag `thebeach-site:<env>` → replace the
`<env>-thebeach-site` container (`--restart unless-stopped`, loopback publish,
`--memory=512m --memory-swap=1g --cpus=1`, json-file logs max-size=10m
max-file=3) → wait for HTTP 200 on the loopback port.

**Never** hand-publish a container port on anything except `127.0.0.1` — only
80/443 are public (Azure NSG), via Apache.

## Rollback

Image tags are the release ledger (`docker images thebeach-site`). Rerun the
deploy script with the old ref/sha:

```bash
cd /home/beachinfo/thebeach-site && ./deploy.sh prod <old-sha>
```

## Restart / status

Thin systemd wrappers exist for ops parity (`/etc/systemd/system/`):

```bash
sudo systemctl restart thebeach-site-prod      # or thebeach-site-staging
systemctl status thebeach-site-prod
# equivalent: docker restart prod-thebeach-site
```

The containers also auto-restart on crash and reboot (`--restart unless-stopped`).

## Logs

```bash
docker logs -f prod-thebeach-site       # app logs (rotated: 10m x 3 files)
tail -f /var/log/apache2/thebeach.one-access.log        # proxy access
tail -f /var/log/apache2/staging.thebeach.one-error.log # staging proxy errors
```

## Verify after a deploy

```bash
curl -I http://127.0.0.1:3000/   # prod container direct (on the box)
curl -I https://thebeach.one/    # through Apache, valid TLS
docker ps --format '{{.Names}}  {{.Ports}}  {{.Status}}'  # loopback publish only
```

Spot-check pages: `/`, `/events`, `/kalender`, `/om-oss`, `/trana` → 200.

## Notes

- The site has server-side API routes under `src/app/api/*` (account/session,
  booking, newsletter, and the season-signup proxy `src/app/api/signup/*`).
  These call the app backend server-side via `src/lib/appApi.ts`, keeping the
  API key and the account bearer token off the browser. They need env config
  (`APP_API_URL`, `APP_API_KEY`) — put it in the env's clone dir as `.env`
  (mode 600, gitignored) so deploy.sh picks it up via `--env-file`. Defaults
  target `https://api.beachtv.se`, so an empty `.env` still works in prod.
  Season-signup identity is the HttpOnly `tb_account_session` cookie (a
  verified bearer token); the routes forward that token and never trust a
  browser-supplied user id.
- **Anonymous season-signup throttle** (`/api/signup/submit`): the route keys
  abuse control on the client's TRUSTED NETWORK IP (as seen by Apache), NOT a
  cookie — a visitor cannot reset their bucket by clearing cookies. It reads
  the proxy-set address (`X-Real-IP` / right-most `X-Forwarded-For` hop),
  HMAC-signs it, and forwards `X-Client-IP`/`X-Client-IP-Sig` to the API.
  **Required prod env (fail-closed, NO default):** set `CLIENT_IP_SECRET` in
  the env's `.env` to the SAME value as the API (`CLIENT_IP_SECRET` on
  `thebeach-api`). Unset ⇒ no signed IP is forwarded and the API degrades to a
  coarse per-container bucket + a global cap (safe, but not per-client).
  **Apache must set the client address authoritatively** (mod_remoteip /
  `RemoteIPHeader`) so `X-Real-IP` / the last XFF hop reflect the real peer and
  cannot be spoofed by a client-supplied header.
- The pre-container placeholder site is archived at
  `/home/beachinfo/site-backups/thebeach.one-placeholder-20260710.tar.gz`
  (offbox copy on beachapps-dev: `~/site-promote/offbox-backups/`).
- Pre-cutover Apache vhost backups: `*.bak-20260710` in
  `/etc/apache2/sites-available/`.
- The Vercel instructions in AGENTS.md refer to David's old preview flow, not
  this production deployment.

---

# Staging workshop + Site Deploy panel (added 2026-07-10)

Staging is no longer a `next start` runtime copy — **staging IS the workshop**:
a dev container where David/Simon (and Claude agents) edit the live checkout,
served by `next dev` (hot reload) at https://staging.thebeach.one.
**GitHub `main` is the hub**: the workshop is one contributor among several;
Henric/Mattias also push from their own environments.

## Components (beachinfo-azure)

| Piece | What/where |
|---|---|
| Workshop container | `staging-thebeach-site` (image `thebeach-site-workshop`, `Dockerfile.staging`), `next dev -H 0.0.0.0 -p 3000` → `127.0.0.1:3001`, caps 2g/1.5cpu |
| Repo checkout | named volume `thebeach-site-staging_work` → `/work/thebeach-site` (survives rebuilds); home volume `thebeach-site-staging_home` → `/home/dev` (Claude Code auth) |
| Git remotes | fetch = https (public), push = ssh deploy key (`/home/beachinfo/thebeach-site-deploy/deploy-key`, repo-scoped, write) |
| Provisioner | `/home/beachinfo/thebeach-site-deploy/workshop/run-workshop.sh` (rebuild + replace; volumes persist) |
| Deploy controller | `thebeach-site-panel.service` → `panel.py` on `172.17.0.1:8853` (REST `/deploy/*`, MCP `/mcp/<key>`, staging SSO `/__sso/login`, forms sink `/forms/submit`) |
| Panel UI | https://admin.thebeach.one/deploy (admin-gateway proxies to the controller with `X-Internal-Auth` + `X-Admin-Email`; access = `site_deploy` app grant) |
| Ledger | `/home/beachinfo/thebeach-site-deploy/ledger.jsonl` (who/when/action/from→to) + Telegram notify on prod-affecting actions |
| MCP keys | `/home/beachinfo/thebeach-site-deploy/mcp_keys.json` (mode 600; per-user, like devstack) |

## The publish rules (enforced, not advisory)

- **Prod publishes ONLY a pushed GitHub commit.** Publish refuses if the
  workshop tree is dirty or ahead of `origin/main` — commit+push first.
- Destructive/prod actions need typed confirms: `PUBLISH`, `ROLLBACK`,
  `RESET-STAGING`, `RESTART-PROD` (same args in the MCP tools).
- **Freeze** blocks all publishes (state + reason shown in status).
- Optional **supervisor review** per publish (advisory verdict; you decide).
- Rollback: SHA-tagged images are kept (last ~12); `rollback_prod(sha)` or the
  history table in the panel. Panel and MCP share one controller — same guards.

## David/Simon: the full Claude-web cycle

1. Connect Claude web to `https://staging.thebeach.one/mcp/<your-key>`
   (key from Henric; call the `readme` tool first).
2. Edit via `run_command` (repo `/work/thebeach-site`), watch
   https://staging.thebeach.one hot-reload (sign in via admin.thebeach.one —
   staging is SSO-gated and noindexed; prod stays public).
3. `git pull` before new work; commit+push when done (rules in CLAUDE.md).
4. `publish_to_prod(confirm="PUBLISH")` → poll `job_status`. Done.

Claude Code inside the workshop: preinstalled; auth once via tmux
(`tmux_send_keys`/`tmux_capture`, OAuth paste-back) — persists in the home volume.

## External contributors (Henric/Mattias)

1. Clone/pull the repo wherever you work; push to `main`.
2. Panel → **"Uppdatera staging från GitHub"** (or MCP
   `update_staging_from_github`) — fast-forwards the workshop to `origin/main`
   (refuses if the workshop is dirty/diverged; runs `npm install` if the
   lockfile changed).
3. Review on staging → **Publish**.

## Forms (added with David's site)

`/api/forfragan` needs `FORMS_ENDPOINT` (+`FORMS_ENDPOINT_KEY`) — set in each
env's `.env` (prod: `/home/beachinfo/thebeach-site/.env`, staging:
`staging.env` via the workshop provisioner). Submissions POST to the
controller's `/forms/submit` (bearer-key) → MySQL `thebeach_site.site_form_submissions`
with an `env` column (staging rows are separable). v1 home — moves into the
future signup/booking backend. No `BREVO_API_KEY` exists yet: prod submissions
trigger a Telegram alert as a stopgap so nothing is silent.

## Staging SSO gate

The staging vhost requires a `staging_auth` cookie (set by `/__sso/login` after
Google sign-in at admin.thebeach.one — same mechanism as fivbprod). Exempt:
`/mcp/...` (bearer-key-in-URL), `/__sso/`, ACME. `X-Robots-Tag: noindex` always.
The HMR websocket (`/_next/webpack-hmr`) is proxied with an upgrade rule and
works for authenticated users. Prod is fully public and ungated.
