# Three-Live / MG-17 comparable viewer spike — 2026-11-09

## Question

Should the Google-hosted, unofficial **Three-Live / XR-Live** replace the existing Three.js WebXR and MG-17 storytelling runtime?

**Provisional answer: NO full migration.** Use a small, unconnected benchmark for one authored suitcase model and potential USDZ/GLB packaging. Three-Live is a procedural authoring/compiler and native transport with an optional XR hand stack; it doesn't replace the existing event/cue, archival content and physical-venue QA workflow.

## Verified upstream status

- Google Open Source Blog on **2026-11-03** introduced Developer Preview v1.0.0; clearly states that Three-Live **is not an officially supported Google product**: https://opensource.googleblog.com/2026/11/introducing-three-live-ai-generated-3d-ar-webxr.html
- As of **2026-11-09**, the GitHub Releases page lists **v1.3.2** (published November 8, 2026) as the latest official release, not v1.3.1. https://github.com/google/three-live/releases
- Browser usage and src/ios-src syntax: https://github.com/google/three-live/blob/main/docs/three-live.md
- Official web bundle endpoint: https://google.github.io/three-live/dist/three-live-viewer.min.js (project-hosted, **moves with HEAD**, not immutable)
- The source is Apache 2.0; the official site disclaims formal Google product support. Review actual compatible release binaries before bringing it into any client product.

## Implemented spike

`xr/three-live-eval/index.html` displays ONE existing tiny `assets/models/glb/mistgarden-case.glb` through **two viewers**:
1. Three.js 0.165.0 + GLTFLoader + OrbitControls, against the experiment-only validated GLB.
2. Official hosted `three-live-viewer.min.js` + `<three-live src="./mistgarden-case-validated.glb">` with camera-controls. AR and actual native USDZ parity are not evaluated by this one-file browser test.

This path is **experiment-only** and is not linked from `mg17-intake.html` or loaded by `xr/experience-v2/index.html`. It has no access to the user's private documents, no external model uploads, and no script compilation of untrusted LLM code.

**Source asset finding / 2026-11-09:** the original 2,344-byte GLB was malformed: its first JSON chunk ended with a NUL 0x00 alignment byte rather than the glTF 2.0 required SPACE 0x20. This makes some strict Three.js GLTFLoader implementations fail JSON.parse before Three-Live can even be compared. We verified the error by reading the actual GLB binary and its first JSON chunk (one mesh with 48 vertices/72 indices). **The original stays untouched** at assets/models/glb/mistgarden-case.glb. A new one-byte-repaired binary lives solely at xr/three-live-eval/mistgarden-case-validated.glb; both viewers are given that exact same corrected file. The geometry bytes, model and materials are unchanged. Khronos primary spec: https://github.com/KhronosGroup/glTF/blob/main/specification/2.0/Specification.adoc#4432-structured-json-content

Source model size: approximately 2.3 KB and NOT a production-quality 3D botanical case; its visual quality does not establish high-quality renderer output. The USDZ placeholder is similarly tiny. The test's first job is basic glTF parse and viewer compatibility.

## Test protocol / explicit unknowns

- Browser: check both viewers load the same exact URL, original GLB metadata and actual mesh count; compare field of view, tone mapping and rendered screenshot. A registered custom element is **not equivalent** to a loaded/rendered model.
- Browser QA scripts may pass Three.js while the hosted Three-Live bundle fails (network/version/API). Document failure as separate, not an error in MG-17 V2.
- Apple Quick Look: if a compatible iPhone can open the USDZ placeholder, note the actual native app and model scale. Web browser AR button alone does not imply native RealityKit UI interactivity.
- Quest 3 and AVP: test actual hand/controller input, headset session exit/reenter, spatial audio and geometry performance separately. A same-asset viewer proves **none** of those automatically.
- Once source model and viewer parity pass, next optional 90-minute spike is one KHR_interactivity latch/hinge event exported from an *artist-owned* case model, not a nine-world migration.
- Before production use, **download and hash-check a release v1.3.2 bundle**, mirror under an attributed third-party folder with license and code review, and freeze version/API. This spike deliberately uses the changing official GitHub Pages endpoint, so it is never considered a pinned production integration.
- Decision labels: `GO_VIEWER_SPIKE` (same GLB works); `HOLD_NATIVE_XR` (unverified on device); `NO_GO_MIGRATION` (not enough benefit to replace existing scene / event / audio / gesture state).

## Artist production remains separate

The authored 85-second `xr/experience-v2/` path remains the primary visitor experience. Three-Live evaluation MUST NOT modify its choreography, change its static camera, auto-generate a new style, overwrite old Ground Zero, or report headset audio/hand completion from desk tests.
