#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS_DIR="$ROOT/docs"
MANIFEST_PATH="$ROOT/04-production/MG-17/09-public-boundary/mg17_public_bundle_manifest_v1.json"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/mg17-docs-build.XXXXXX")"

cleanup() {
  rm -rf "$TMP_DIR"
}

trap cleanup EXIT

python3 - "$ROOT" "$TMP_DIR" "$MANIFEST_PATH" <<'PY'
import json
import shutil
import sys
from pathlib import Path

root = Path(sys.argv[1])
tmp_dir = Path(sys.argv[2])
manifest_path = Path(sys.argv[3])
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

for entry in manifest["entries"]:
    target = tmp_dir / entry["target"]
    target.parent.mkdir(parents=True, exist_ok=True)
    source = entry["source"]
    if source is None:
        target.touch()
    else:
        shutil.copy2(root / source, target)
PY

python3 "$ROOT/04-production/MG-17/09-public-boundary/audit_mg17_public_surface.py" "$TMP_DIR"

mkdir -p "$DOCS_DIR"
find "$DOCS_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -R "$TMP_DIR"/. "$DOCS_DIR"/

echo "Built clean docs bundle at $DOCS_DIR"
