#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PATHS_FILE="$ROOT/04-production/MG-17/09-public-boundary/mg17_public_release_git_paths_v1.txt"

EXPECTED_FILE="$(mktemp "${TMPDIR:-/tmp}/mg17-expected-stage.XXXXXX")"
ACTUAL_FILE="$(mktemp "${TMPDIR:-/tmp}/mg17-actual-stage.XXXXXX")"
EXTRA_FILE="$(mktemp "${TMPDIR:-/tmp}/mg17-extra-stage.XXXXXX")"
MISSING_FILE="$(mktemp "${TMPDIR:-/tmp}/mg17-missing-stage.XXXXXX")"

cleanup() {
  rm -f "$EXPECTED_FILE" "$ACTUAL_FILE" "$EXTRA_FILE" "$MISSING_FILE"
}

trap cleanup EXIT

grep -vE '^[[:space:]]*(#|$)' "$PATHS_FILE" | sort > "$EXPECTED_FILE"
git -C "$ROOT" diff --cached --name-only | sort > "$ACTUAL_FILE"

if [[ ! -s "$ACTUAL_FILE" ]]; then
  echo "No staged files found for MG-17 Pages release." >&2
  exit 1
fi

comm -23 "$ACTUAL_FILE" "$EXPECTED_FILE" > "$EXTRA_FILE"
comm -13 "$ACTUAL_FILE" "$EXPECTED_FILE" > "$MISSING_FILE"

if [[ -s "$EXTRA_FILE" || -s "$MISSING_FILE" ]]; then
  echo "MG-17 staged set does not match the minimal Pages release set." >&2
  if [[ -s "$EXTRA_FILE" ]]; then
    echo "Extra staged paths:" >&2
    sed 's/^/- /' "$EXTRA_FILE" >&2
  fi
  if [[ -s "$MISSING_FILE" ]]; then
    echo "Missing staged paths:" >&2
    sed 's/^/- /' "$MISSING_FILE" >&2
  fi
  exit 1
fi

echo "MG-17 staged set matches the minimal Pages release set."
