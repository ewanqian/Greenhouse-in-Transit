#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
READINESS_REPORT="$ROOT/04-production/MG-17/09-public-boundary/mg17_pages_release_readiness_latest.md"
STAGED_SET_SCRIPT="$ROOT/scripts/check_mg17_pages_staged_set.sh"
MODE="${1:---dry-run}"
MESSAGE="${2:-Ship MG-17 public Pages release pipeline}"

if [[ "$MODE" != "--dry-run" && "$MODE" != "--apply" ]]; then
  echo "Usage: $0 [--dry-run|--apply] [commit message]" >&2
  exit 1
fi

if [[ ! -f "$READINESS_REPORT" ]]; then
  echo "Missing readiness report: $READINESS_REPORT" >&2
  exit 1
fi

if ! grep -q '状态：`Ready to push`' "$READINESS_REPORT"; then
  echo "Readiness report is not in Ready to push state." >&2
  exit 1
fi

bash "$STAGED_SET_SCRIPT"

echo "Commit message:"
echo "- $MESSAGE"
echo
echo "Staged files:"
git -C "$ROOT" diff --cached --name-only

if [[ "$MODE" == "--dry-run" ]]; then
  echo
  echo "Dry run only. No commit created."
  exit 0
fi

git -C "$ROOT" commit -m "$MESSAGE"

echo
echo "Committed MG-17 Pages release set."
