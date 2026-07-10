#!/usr/bin/env bash
# Provision/replace the thebeach-site STAGING WORKSHOP container.
# (The prod analogue of devstack's setup_devstack.sh — this script IS the
#  documented procedure; no hand-typed docker commands.)
#
#   ./run-workshop.sh            # (re)build image + (re)create container
#
# Persistent named volumes (survive rebuilds — the whole point):
#   thebeach-site-staging_work  -> /work      (the repo checkout)
#   thebeach-site-staging_home  -> /home/dev  (Claude Code auth, dotfiles)
# Deploy key (read-only): /home/beachinfo/thebeach-site-deploy/deploy-key
set -euo pipefail

cd "$(dirname "$(readlink -f "$0")")"

NAME=staging-thebeach-site
IMG=thebeach-site-workshop
ENV_FILE=/home/beachinfo/thebeach-site-deploy/staging.env
KEY_DIR=/home/beachinfo/thebeach-site-deploy/deploy-key

echo "==> Building $IMG"
docker build -f Dockerfile.staging -t "$IMG" .

docker volume create thebeach-site-staging_work >/dev/null
docker volume create thebeach-site-staging_home >/dev/null

echo "==> Replacing container $NAME (publish 127.0.0.1:3001 -> 3000)"
docker rm -f "$NAME" 2>/dev/null || true
docker run -d --name "$NAME" \
  --restart unless-stopped \
  --add-host=host.docker.internal:host-gateway \
  --memory=2g --memory-swap=3g --cpus=1.5 \
  --log-opt max-size=10m --log-opt max-file=3 \
  -p 127.0.0.1:3001:3000 \
  -v thebeach-site-staging_work:/work \
  -v thebeach-site-staging_home:/home/dev \
  -v "$KEY_DIR":/keys:ro \
  --env-file "$ENV_FILE" \
  "$IMG"

echo "==> Waiting for next dev on 127.0.0.1:3001 (first boot: clone + npm install, can take minutes)"
for _ in $(seq 1 120); do
  if curl -fsS -o /dev/null "http://127.0.0.1:3001/"; then
    echo "==> OK: $NAME healthy on 127.0.0.1:3001"
    exit 0
  fi
  sleep 5
done
echo "!! $NAME not healthy after 10 min. Logs:" >&2
docker logs --tail 60 "$NAME" >&2 || true
exit 1
