#!/usr/bin/env bash
# Creates labels, milestones and issues from docs/issues/*.md on a GitHub repo.
# Usage: scripts/create-github-issues.sh owner/repo [--dry-run]
# Run on a fresh repo so GitHub issue numbers match the local #NN numbers.
set -euo pipefail

REPO="${1:?usage: $0 owner/repo [--dry-run]}"
DRY="${2:-}"
DIR="$(cd "$(dirname "$0")/.." && pwd)/docs/issues"

run() { if [[ "$DRY" == "--dry-run" ]]; then echo "+ $*"; else "$@"; fi; }

field() { sed -n "s/^$1: \"\(.*\)\"$/\1/p" "$2" | head -1; }
body()  { awk 'BEGIN{n=0} /^---$/{n++; next} n>=2' "$1"; }

# Labels
for l in area:storefront area:admin area:backend area:design area:payments area:infra \
         type:feature type:spike type:chore priority:p0 priority:p1 priority:p2 blocked:client; do
  run gh label create "$l" --repo "$REPO" --force >/dev/null
done

# Milestones
for f in "$DIR"/*.md; do field milestone "$f"; done | sort -u | while read -r m; do
  if ! gh api "repos/$REPO/milestones?state=all&per_page=100" --jq '.[].title' | grep -qxF "$m"; then
    run gh api "repos/$REPO/milestones" -f title="$m" >/dev/null
  fi
done

# Issues, in numeric order
for f in $(ls "$DIR"/*.md | sort); do
  title="$(field title "$f")"
  tmp="$(mktemp)"; body "$f" > "$tmp"
  run gh issue create --repo "$REPO" --title "$title" --milestone "$(field milestone "$f")" \
    --label "$(field labels "$f")" --body-file "$tmp"
  rm -f "$tmp"
done
