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

- The site is fully static-friendly (no DB, no API routes, no `.env` needed).
  If a `.env` ever becomes necessary, put it in the env's clone dir (mode 600,
  gitignored) — deploy.sh picks it up automatically via `--env-file`.
- The pre-container placeholder site is archived at
  `/home/beachinfo/site-backups/thebeach.one-placeholder-20260710.tar.gz`
  (offbox copy on beachapps-dev: `~/site-promote/offbox-backups/`).
- Pre-cutover Apache vhost backups: `*.bak-20260710` in
  `/etc/apache2/sites-available/`.
- The Vercel instructions in AGENTS.md refer to David's old preview flow, not
  this production deployment.
