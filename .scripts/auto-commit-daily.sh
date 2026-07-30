#!/bin/bash
# AIOS root repo -- daily end-of-day auto-commit. Local cron job, not a cloud agent.
# Scope: /home/user/workspaces/AIOS only. Nested project repos (ad-manager/,
# website-build/) are independently git-managed and are NOT touched by this --
# they're committed manually/explicitly during working sessions.
#
# Never pushes to any remote. Local commit only.
set -euo pipefail

REPO=/home/user/workspaces/AIOS
LOG="$REPO/.auto-commit.log"

cd "$REPO"

log() {
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) -- $1" >> "$LOG"
}

if [ -z "$(git status --porcelain)" ]; then
  log "no changes, skipping"
  exit 0
fi

git add -A

# Secret-pattern scan on everything staged before committing. Abort and unstage
# on any hit rather than risk auto-committing a credential unattended.
secret_hits=""
while IFS= read -r f; do
  if [ -f "$f" ] && [ "$f" != ".scripts/auto-commit-daily.sh" ]; then
    hit=$(grep -lIniE "api[_-]?key|secret[_-]?key|access[_-]?token|bearer [a-z0-9]|password[[:space:]]*=|private[_-]?key|-----BEGIN" "$f" 2>/dev/null | grep -v "secret_ref\|secret-ref" || true)
    if [ -n "$hit" ]; then
      secret_hits="$secret_hits $f"
    fi
  fi
done <<< "$(git diff --cached --name-only)"

if [ -n "$secret_hits" ]; then
  git restore --staged .
  log "ABORTED: possible secret-shaped content in:$secret_hits"
  exit 1
fi

changed_dirs=$(git diff --cached --name-only | sed 's#/.*##' | sort -u | tr '\n' ',' | sed 's/,$//')
file_count=$(git diff --cached --name-only | wc -l | tr -d ' ')

git commit -q -m "Auto-commit ($(date +%Y-%m-%d)): ${file_count} file(s) changed in ${changed_dirs}

Automated end-of-day commit, local cron job. No push performed."

log "committed ${file_count} file(s) touching: ${changed_dirs}"
