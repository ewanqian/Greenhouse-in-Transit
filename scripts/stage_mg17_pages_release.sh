#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATHS_FILE="$ROOT/04-production/MG-17/09-public-boundary/mg17_public_release_git_paths_v1.txt"
MODE="${1:---dry-run}"

if [[ "$MODE" != "--dry-run" && "$MODE" != "--apply" ]]; then
  echo "Usage: $0 [--dry-run|--apply]" >&2
  exit 1
fi

RELEASE_PATHS=()
while IFS= read -r relpath; do
  [[ -z "$relpath" ]] && continue
  RELEASE_PATHS+=("$relpath")
done < <(grep -vE '^[[:space:]]*(#|$)' "$PATHS_FILE")

if [[ "${#RELEASE_PATHS[@]}" -eq 0 ]]; then
  echo "No release paths found in $PATHS_FILE" >&2
  exit 1
fi

missing=0
for relpath in "${RELEASE_PATHS[@]}"; do
  if [[ ! -e "$ROOT/$relpath" ]]; then
    echo "Missing release path: $relpath" >&2
    missing=1
  fi
done

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

echo "MG-17 Pages release path set:"
for relpath in "${RELEASE_PATHS[@]}"; do
  echo "- $relpath"
done

if [[ "$MODE" == "--dry-run" ]]; then
  echo
  echo "Dry run only. No files staged."
  exit 0
fi

(
  cd "$ROOT"
  git add -f -- "${RELEASE_PATHS[@]}"
)

echo
echo "Staged MG-17 Pages release path set."
