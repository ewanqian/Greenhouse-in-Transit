#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VISIONPRO_ROOT="/Users/ewanqian/Documents/Sync/Workspace/Visionpro"
BOUNDARY_DIR="$ROOT/04-production/MG-17/09-public-boundary"
REPORT_PATH="$BOUNDARY_DIR/mg17_pages_release_readiness_latest.md"
WORKFLOW_PATH="$ROOT/.github/workflows/deploy-pages.yml"
BUILD_SCRIPT="$ROOT/scripts/build_public_docs_bundle.sh"
STAGED_SET_SCRIPT="$ROOT/scripts/check_mg17_pages_staged_set.sh"
AUDIT_SCRIPT="$BOUNDARY_DIR/audit_mg17_public_surface.py"
MANIFEST_PATH="$BOUNDARY_DIR/mg17_public_bundle_manifest_v1.json"
STAGE_PATHS_FILE="$BOUNDARY_DIR/mg17_public_release_git_paths_v1.txt"
DOCS_DIR="$ROOT/docs"
PREFLIGHT_REPORT="$VISIONPRO_ROOT/output/preflight-latest.txt"
PREFLIGHT_MAX_AGE_SECONDS=14400

require_file() {
  if [[ ! -f "$1" ]]; then
    echo "Missing required file: $1" >&2
    exit 1
  fi
}

require_file "$WORKFLOW_PATH"
require_file "$BUILD_SCRIPT"
require_file "$STAGED_SET_SCRIPT"
require_file "$AUDIT_SCRIPT"
require_file "$MANIFEST_PATH"
require_file "$STAGE_PATHS_FILE"
require_file "$PREFLIGHT_REPORT"

bash "$BUILD_SCRIPT"
python3 "$AUDIT_SCRIPT"
bash "$STAGED_SET_SCRIPT"

if ! cmp -s "$ROOT/mg17-intake.html" "$DOCS_DIR/index.html"; then
  echo "docs/index.html no longer matches mg17-intake.html" >&2
  exit 1
fi

if ! grep -q 'bash ./scripts/build_public_docs_bundle.sh' "$WORKFLOW_PATH"; then
  echo "deploy-pages workflow is not building the public docs bundle" >&2
  exit 1
fi

if ! grep -q 'path: ./docs' "$WORKFLOW_PATH"; then
  echo "deploy-pages workflow is not uploading ./docs" >&2
  exit 1
fi

if ! grep -q 'Preflight passed\.' "$PREFLIGHT_REPORT"; then
  echo "Latest standalone project_preflight report is not green" >&2
  exit 1
fi

preflight_age_seconds="$(
python3 - "$PREFLIGHT_REPORT" <<'PY'
import os
import sys
import time

print(int(time.time() - os.path.getmtime(sys.argv[1])))
PY
)"

if (( preflight_age_seconds > PREFLIGHT_MAX_AGE_SECONDS )); then
  echo "Latest standalone project_preflight report is stale (${preflight_age_seconds}s old)" >&2
  exit 1
fi

manifest_targets="$(
python3 - "$MANIFEST_PATH" <<'PY'
import json
import sys
from pathlib import Path

manifest = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
for entry in manifest["entries"]:
    print(entry["target"])
PY
)"

release_git_paths="$(
grep -vE '^\s*(#|$)' "$STAGE_PATHS_FILE"
)"

generated_at="$(date '+%Y-%m-%d %H:%M:%S %Z')"

{
  echo "# MG-17 Pages Release Readiness"
  echo
  echo "状态：\`Ready to push\`"
  echo "更新时间：\`$generated_at\`"
  echo
  echo "## Automated Checks Passed"
  echo
  echo "- Clean public \`docs/\` bundle rebuilt from manifest"
  echo "- Public surface audit passed"
  echo "- Current staged set matches the minimal Pages release set"
  echo "- \`docs/index.html\` matches \`mg17-intake.html\`"
  echo "- \`deploy-pages.yml\` builds the public bundle and uploads \`./docs\`"
  echo "- Latest standalone \`project_preflight.sh\` receipt is green"
  echo "- Preflight receipt age: ${preflight_age_seconds}s"
  echo
  echo "## Publish Bundle Targets"
  echo
  while IFS= read -r target; do
    echo "- \`$target\`"
  done <<< "$manifest_targets"
  echo
  echo "## Manual Steps Remaining"
  echo
  echo "1. Optional preview: \`bash scripts/commit_mg17_pages_release.sh --dry-run\`"
  echo "2. Commit the currently staged release set: \`bash scripts/commit_mg17_pages_release.sh --apply\`"
  echo "3. Push current changes to \`main\`"
  echo "4. In GitHub: \`Settings -> Pages -> Source = GitHub Actions\`"
  echo "5. Wait for \`Deploy Public Pages\` to finish"
  echo "6. Verify:"
  echo "   - root opens the client intake route"
  echo "   - archive deep-link still works"
  echo "   - maker docs are no longer public"
  echo
  echo "## Minimal Git Push Set"
  echo
  while IFS= read -r relpath; do
    echo "- \`$relpath\`"
  done <<< "$release_git_paths"
} > "$REPORT_PATH"

echo "Wrote release readiness report to $REPORT_PATH"
