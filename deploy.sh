#!/usr/bin/env bash
# deploy.sh <staging|prod> [git-ref]
#
# Deploys thebeach-site as a Docker container on beachinfo-azure, per the
# prod-container architecture (supervisor/platform/prod-container-architecture.md).
#
#   deploy.sh staging main       # deploy staging from origin/main
#   deploy.sh prod main          # deploy prod from origin/main
#   deploy.sh prod 380e7cc       # rollback/pin prod to a specific commit
#
# Run from the env's own clone:
#   prod:    /home/beachinfo/thebeach-site
#   staging: /home/beachinfo/thebeach-site-staging
#
# Port map (host loopback -> container 3000):
#   prod    127.0.0.1:3000  container prod-thebeach-site     vhost thebeach.one (+www)
#   staging 127.0.0.1:3001  container staging-thebeach-site  vhost staging.thebeach.one
#
# Images are tagged thebeach-site:<git-short-sha> (release ledger; old tags are
# kept) and retagged thebeach-site:<env>. Rollback = rerun with the old sha.
set -euo pipefail

ENV_NAME="${1:?usage: deploy.sh <staging|prod> [git-ref]}"
REF="${2:-main}"

APP=thebeach-site
case "$ENV_NAME" in
  prod)    HOST_PORT=3000 ;;
  staging) HOST_PORT=3001 ;;
  *) echo "error: env must be 'staging' or 'prod'" >&2; exit 1 ;;
esac
CONTAINER="${ENV_NAME}-${APP}"

cd "$(dirname "$(readlink -f "$0")")"

echo "==> Fetching and checking out ${REF}"
git fetch origin --tags --prune
# Prefer the remote branch tip; fall back to a raw sha/tag.
git checkout --detach "origin/${REF}" 2>/dev/null || git checkout --detach "${REF}"
SHA="$(git rev-parse --short HEAD)"

echo "==> Building ${APP}:${SHA} (env=${ENV_NAME}, ref=${REF})"
docker build -t "${APP}:${SHA}" .
docker tag "${APP}:${SHA}" "${APP}:${ENV_NAME}"

# Optional env file (gitignored; mode 600). The site is static-friendly and
# currently needs none.
ENV_FILE_ARGS=()
if [[ -f .env ]]; then
  ENV_FILE_ARGS=(--env-file "$PWD/.env")
fi

echo "==> Replacing container ${CONTAINER} (publish 127.0.0.1:${HOST_PORT} -> 3000)"
docker rm -f "${CONTAINER}" 2>/dev/null || true
docker run -d --name "${CONTAINER}" \
  --restart unless-stopped \
  --add-host=host.docker.internal:host-gateway \
  --memory=512m --memory-swap=1g --cpus=1 \
  --log-opt max-size=10m --log-opt max-file=3 \
  -p "127.0.0.1:${HOST_PORT}:3000" \
  "${ENV_FILE_ARGS[@]}" \
  "${APP}:${ENV_NAME}"

echo "==> Waiting for HTTP 200 on 127.0.0.1:${HOST_PORT}"
for _ in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:${HOST_PORT}/"; then
    echo "==> OK: ${CONTAINER} is ${APP}:${SHA}, healthy on 127.0.0.1:${HOST_PORT}"
    exit 0
  fi
  sleep 1
done

echo "!! ${CONTAINER} did not become healthy within 30s. Last logs:" >&2
docker logs --tail 50 "${CONTAINER}" >&2 || true
exit 1
