#!/usr/bin/env python3
from __future__ import annotations

import sys
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DEFAULT_DOCS_DIR = ROOT / "docs"
MANIFEST_PATH = (
    ROOT
    / "04-production"
    / "MG-17"
    / "09-public-boundary"
    / "mg17_public_bundle_manifest_v1.json"
)

BANNED_TOKENS = [
    "README.md",
    "../README.md",
    "00-overview/",
    "Doc/",
    "03-experience-flow/",
    "checkpoint",
    "runbook",
    "scorecard",
    "runtime",
    "operator console",
    "查看文档",
    "完整文档",
]


def load_docs_allowed_files() -> set[Path]:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    return {
        Path(entry["target"])
        for entry in manifest["entries"]
    }


def main() -> int:
    docs_allowed_files = load_docs_allowed_files()
    docs_dir = (
        Path(sys.argv[1]).resolve()
        if len(sys.argv) > 1
        else DEFAULT_DOCS_DIR
    )
    public_files = [
        ROOT / "index.html",
        ROOT / "mg17-intake.html",
        ROOT / "Archive" / "archive-viewer-v2.html",
        ROOT / "Archive" / "project-home-v2.html",
        ROOT / "Archive" / "greenhouse-flow-evidence-demo-v1.html",
        ROOT / "Archive" / "index.html",
        docs_dir / "index.html",
        docs_dir / "mg17-intake.html",
        docs_dir / "Archive" / "archive-viewer-v2.html",
    ]

    failures: list[str] = []
    missing: list[str] = []

    for path in public_files:
        if not path.exists():
            missing.append(str(path))
            continue

        content = path.read_text(encoding="utf-8")
        lower = content.lower()
        for token in BANNED_TOKENS:
            haystack = lower if token == token.lower() else content
            needle = token.lower() if token == token.lower() else token
            if needle in haystack:
                failures.append(f"{path}: contains banned token `{token}`")

    if docs_dir.exists():
        actual_docs_files = {
            path.relative_to(docs_dir)
            for path in docs_dir.rglob("*")
            if path.is_file()
        }
        unexpected_docs_files = sorted(actual_docs_files - docs_allowed_files)
        missing_docs_files = sorted(docs_allowed_files - actual_docs_files)

        for path in unexpected_docs_files:
            failures.append(
                f"{docs_dir / path}: unexpected file in public publish bundle"
            )
        for path in missing_docs_files:
            failures.append(
                f"{docs_dir / path}: required public bundle file is missing"
            )
    else:
        missing.append(str(docs_dir))

    if missing:
        print("Missing public files:")
        for item in missing:
            print(f"- {item}")

    if failures:
        print("Public surface audit failed:")
        for item in failures:
            print(f"- {item}")
        return 1

    print("Public surface audit passed.")
    for path in public_files:
        if path.exists():
            print(f"- ok: {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
