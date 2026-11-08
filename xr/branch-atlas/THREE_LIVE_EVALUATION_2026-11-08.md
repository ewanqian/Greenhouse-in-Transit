# Three-Live / XR-Live, 2026-11-08: Should MG-17 abandon Three.js?

**Decision: TRIAL / not migration.** Three-Live is NOT a replacement for the entire Three.js ecosystem or existing WebXR sensor stack. Its valuable niche is **portable procedural 3D → sandboxed GLB/USDZ native/Web XR rendering** with small viewer bundles and declarative XR interaction plugins.

## Verified sources, explicit dates

- 2026-11-03 Google Open Source Blog intro, initially v1.0.0 Developer Preview. It is a Google-hosted research/open-source project but **explicitly not an officially supported Google product**: https://opensource.googleblog.com/2026/11/introducing-three-live-ai-generated-3d-ar-webxr.html
- Official project and docs: https://github.com/google/three-live , https://github.com/google/three-live/blob/main/docs/xr-live.md , https://google.github.io/three-live/
- Official CHANGELOG has **v1.3.2 Beta entry dated 2026-11-08**, while the GitHub Releases page viewed on 2026-11-08 presented **v1.3.1 as latest published release**. These are distinct signals. Prefer a real published tag and lock it, do not automatically run untagged HEAD or assume registry/CDN already contains the changelog's newest entry:
  https://github.com/google/three-live/blob/main/CHANGELOG.md
  https://github.com/google/three-live/releases
- 1.3.1 release discusses MCP tools `three_live_validate/render/convert/sim`, spatial audio emitter handling, Web/XR animation and an authoring-to-device compiler. All performance claims here are source claims, not hardware measurements made by this project.

## Feature fit

| Use case | Assessment | Reason |
|---|---|---|
| small portable suitcase procedural model | **STRONG / trial** | Box, dome and botanical mesh prototypes compiled to GLB/USDZ |
| export to RealityKit/visionOS | **STRONG / trial** | Explicit native pipeline; actual build and signing not tested |
| XR grabbing, pinching and spatial UI | **MAYBE / proof first** | Declarative 25-joint, plugin systems; original project gesture logic and hysteresis must be compared |
| 81-branch user-facing narrative and archive | **KEEP HTML/JS** | State graph/reading experience not made easier by a model compiler |
| continuous live-set point/line geometry + external cues | **KEEP existing Three/WebGL** | Requires custom live geometry, clock, mapped screens, WebAudio/OSC, dependable profiling |
| classic scene inspection | **ALTERNATIVE**, not upgrade by default | Existing `xr/ground-zero.html` already works in desktop and carries four-stage narrative |
| spatial audio emitter plugin | **TRIAL**, not DAW solution | Vendor feature does not replace Ableton/Max/Strudel or measured HRTF behavior |

## No-go migration gates

Do not replace baseline without all five:
1. The same authored MG-17 miniature `GLB` or procedural scene renders the same silhouette/lid/shell and is exportable as `USDZ`, with stable authored materials and aspect ratios.
2. At least **20 interactive selections** each on desktop, Quest 3 and Vision Pro; track missed/phantom events and audio context behavior.
3. Lifecycle/context recovery and min 10 minute repeated scene load/exit test, with real compositor FPS and memory (not JS setInterval/FPS alone).
4. Latency and visual accuracy parity with existing Three.js `ground-zero.html`, no extra manual registration or unreliable WebXR hand tracking.
5. Clear maintenance/license/security risk and a tagged release; no dependence on unlocked LLM-generated code outside the project sandbox.

## Recommended independent 90-minute spike

Use the existing 2.3 KB `mistgarden-case.glb` as a **structural source**, not visual quality baseline. Try published Three-Live `<three-live src=...>` *viewer-only* bundle first (no remote client-code compilation) and compare against the existing Three.js WebXR renderer. Then optionally use `three-live-cli validate/render/convert` on an **original** wireframe procedural case/greenhouse model and inspect the GLB/USDZ output.

Do not put this experimental library on the public `mg17-intake.html` root or overwrite `ground-zero.html`. If it passes two target devices and the author approves, promote an adapter rather than replacing the app framework.

## Reference CLI — illustrative only, not executed here

    npx -y three-live-cli@1.3.1 validate scene.js --json
    npx -y three-live-cli@1.3.1 render scene.js --view=quad --grid --annotations -o contact-sheet.png
    npx -y three-live-cli@1.3.1 convert scene.js -o case.glb

Exact command and current npm release package should be verified on the local development machine. No compiler, output or physical XR has been run by this ChatGPT GitHub-source task.

## Practical decision

- **Now:** website with line/mesh abstractions and effective selection logic; existing WebXR input is a separate, testable baseline.
- **Next:** one actual Three-Live model + asset export proof (small branch; no irreversible migration).
- **Later, only if it wins:** native RealityKit/Android Filament bridge for the exhibition version, while author controls final art, geometry and camera.
