#!/usr/bin/env bash
# Entrypoint for the thebeach-site staging workshop container.
# - Ensures the repo checkout exists in the /work volume (clones on first boot,
#   via the deploy key mounted read-only at /keys).
# - Ensures git identity + the fleet git-sync Claude Code hooks (pull on
#   session start, push on stop) exist in the /home/dev volume.
# - Runs `next dev` (hot reload) on 0.0.0.0:3000.
set -e

REPO="${WORKSHOP_REPO:-/work/thebeach-site}"
REMOTE="${WORKSHOP_REMOTE:-git@github.com:thebeachvolleyclub/thebeach-site.git}"
export GIT_SSH_COMMAND="${GIT_SSH_COMMAND:-ssh -i /keys/id_ed25519 -o StrictHostKeyChecking=accept-new -o IdentitiesOnly=yes}"

# --- git identity (neutral default; users may override with their own) -------
git config --global user.name  >/dev/null 2>&1 || git config --global user.name  "The Beach Staging"
git config --global user.email >/dev/null 2>&1 || git config --global user.email "github@thebeach.one"
git config --global pull.rebase true
git config --global core.sshCommand "$GIT_SSH_COMMAND"

# --- first boot: clone into the named volume ---------------------------------
HTTPS_REMOTE="https://github.com/thebeachvolleyclub/thebeach-site.git"
if [ ! -d "$REPO/.git" ]; then
  echo "==> First boot: cloning $HTTPS_REMOTE -> $REPO"
  git clone "$HTTPS_REMOTE" "$REPO"
fi
# Fetch over https (public repo, no key needed); push over ssh (deploy key).
git -C "$REPO" remote set-url origin "$HTTPS_REMOTE"
git -C "$REPO" remote set-url --push origin "$REMOTE"

# --- fleet git-sync hooks for Claude Code (pull before work, push after) -----
mkdir -p "$HOME/.claude"
if [ ! -f "$HOME/.claude/settings.json" ]; then
  cat > "$HOME/.claude/settings.json" <<'EOF'
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "git rev-parse --abbrev-ref @{u} >/dev/null 2>&1 && git pull --rebase --autostash 2>&1 | tail -4 || true",
            "timeout": 30,
            "statusMessage": "git pull (sync policy)"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "git rev-parse --abbrev-ref @{u} >/dev/null 2>&1 && [ -n \"$(git log --oneline @{u}..HEAD 2>/dev/null)\" ] && git push 2>&1 | tail -3 || true",
            "async": true,
            "statusMessage": "git push (sync policy)"
          }
        ]
      }
    ]
  }
}
EOF
fi

export PATH="$HOME/.local/bin:$PATH"

# --- dependencies + dev server ------------------------------------------------
cd "$REPO"
if [ ! -d node_modules ]; then
  echo "==> Installing dependencies"
  npm install --no-audit --no-fund
fi

echo "==> Starting next dev on 0.0.0.0:3000 (host 127.0.0.1:3001)"
exec npm run dev -- -H 0.0.0.0 -p 3000
