# MG-17 Branch Atlas — nine routes, nine choices each
2026-11-08 · Greenhouse in Transit / 箱中温室

## What is actually implemented

Run `xr/branch-atlas/index.html` through HTTPS / `python -m http.server` at repo root. Independent, non-destructive prototype (the existing site root, `mg17-intake.html` and `xr/ground-zero.html` remain canonical and unchanged).

- Nine selectable narrative paths × nine specific micro-actions = **81 selectable and logged events**. Routes are grounded in the existing MG-17 / Senja / Songjian / STB lore; new routes are marked creative interaction **variants**, not archival facts.
- 3D-coordinate procedural wireframe case, lid with hinged rotation, shell rings, botanical growth strands, plant/memory shards, dedicated 3D diagrams for each branch, orbit controls, 3D-projected clickable numbered nodes.
- Three depth states: **SEALED → OPEN CASE → ENTER INTERIOR**, with EXIT/reentry.
- Three technical visualization modes: **STRUCTURE / SECTION / MEMORY**.
- Three mutable narrative variables. Most important: **PERMEABILITY / 边界渗透率** actually changes the shell radius, lid angle and inside/outside reveal; **MEMORY / 记忆显影度** changes plant height, points and trace; **DEVIATION / 航路偏差** changes spatial offset.
- Repeated node selection is recorded but changes scene variables only the first time. Global route progress is shown without requiring an account.
- Keyboard: 1–9 select current route nodes, Shift+1–9 selects routes, E enters, Escape exits. Mouse/touch drag rotates the 3D scene, wheel zooms. Optional manual **REHEARSE 09** runs the selected route's nine beats once, stops and can be interrupted.
- Export a local, human-readable JSON session; no telemetry or network uploads. Scene implementation is pure Canvas 2D rendering of **3D perspective-projected wireframe geometry** (it does not require a CDN or glTF engine). It must NOT be described as a glTF model or WebXR-ready rendering engine.
- Node 22 tests / GitHub Actions CI verify full 81 options, numerical mapping and source syntax.

## Nine directions (each has nine specific decisions)

| # | Thread | Interaction vocabulary | Visual treatment |
|---|---|---|---|
| 01 | 异常错投 Misdelivery | Inspect / Compare / Trace / Unseal / Suspend / Activate / Recall / Transfer / Retain | external package / coordinate misalignment |
| 02 | 箱体解剖 Container | same nine gestures applied to independent documents | hinged lid, handles, sectional layers |
| 03 | 微气候协议 Climate | parameter card, sampling, missing readings, wind and isolation | wireframe mist isosurfaces |
| 04 | 植物记忆 Botanical | potato sprout, leaves, roots, succulent, mint, seed | original thin-stroke botanical growth |
| 05 | 旅客遗物 Traveler | ticket, slippers, toothbrush, inventory, loss | six small evidence objects |
| 06 | 潮线航路 Navigation | digital current, transfer node, missing destination | multiple paths / orbits in 3D |
| 07 | 花园残影 Memory | scans, occlusion, missing points, archive decay | partial reconstruction and sparse shards |
| 08 | 异常回收 Recovery | claim, check, compress, abort, retain | collapsing/expanding wire shell |
| 09 | 重新栖居 Habitation | new resident, patio, invitation, garden, choice | greenhouse architecture inside old shell |

Each node is an authored micro-story option, not a fully produced 90-second cinematic scene. The data design allows a producer to A/B nine directions before asset investment.

## Narrative / interaction stages

1. **Exterior**: introduce box as one real-world evidence object. No giant nav screen replaces the original site.
2. **Open**: show physical handle/hinge shell and 9 evidence points in a coherent 3D coordinate system.
3. **Interior**: closer camera to compressed greenhouse, more apparent plant/shell geometry.
4. **Investigate**: choose a route and one of nine nodes; visual changes, parameters change; observe significance of each clue.
5. **Retain or return**: choose how much boundary remains permeable. Export the visited graph as personal interpretation (no false sense of complete ARG).

## Model / art source policy

- Existing `assets/models/glb/mistgarden-case.glb` exists in repo but is about 2.3 KB and not automatically accepted as final high-quality 3D asset.
- Existing `xr/ground-zero.html` already uses Three.js 0.165.0 + WebXR and six original evidences. That baseline remains the **headset-device interaction reference**, while this new branch is a **fast content-selection prototype**. 3D position projection in the new page should not be confused with physical-space tracking.
- Future authored assets: real case lid/shell, botanical PLY/GS, transparencies, iridescent disc, map/label stickers, opening sound, scent/props and physical QR.
- Before importing, require model license / format / scale / orientation and a stable screenshot comparison to existing exhibition documentation.
- Avoid user-disliked cyberpunk, generic frequency equalizer, auto-zoom or arbitrary sci-fi geometry. Preserve author-approved silhouette and camera. Do not force 81 individual shaders or 81 rendered worlds.

## XR program closure

Existing Quest 3 / AVP baseline `xr/ground-zero.html` uses native target-ray/scene selection and 4 phases. Do **not** claim 25-joint proximity / actual object anchoring works in this separate branch without physical-device test.

Stage gate to declare the project interactive prototype: 
- [ ] open, enter, orbit, choose 81 routes, adjust variable and exit on desktop and mobile;
- [ ] asset URLs and fallback accessible on same-origin HTTPS;
- [ ] one real Quest / AVP test with actual headset, camera comfort, sound unlock, sensitivity and safe exit;
- [ ] no incorrect loss/re-arm or false tracking states;
- [ ] human choose **ONE** strongest four-part 60–90-second narrative for production rather than maintaining nine full shows.

The already functioning 4-phase Ground Zero is the production candidate for headset field test; this 9x9 explorer is the ideation/curatorial selection station.

## Three-Live assessment

See `THREE_LIVE_EVALUATION_2026-11-08.md`. No forced migration. Prefer making one small, real case export from the archived GLB to an independent pinned Three-Live/XR-Live test page and measuring parity on mobile/Quest/AVP. Product status and official links should be updated as releases change.
