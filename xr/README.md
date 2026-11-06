# MG-17 / Ground Zero — WebXR Engine Proof 01

Date: 2026-11-06. Status: source-built logic and platform-validation prototype, **not production-quality modeling or headset certification**.

## Entry points

- xr/ground-zero.html: desktop WebGL with feature-detected immersive VR; immersive AR button only when supported by actual browser.
- xr/ground-zero.html?operator=1: operator mode.
- mg17-intake.html: original on-site lost-item entry.
- Archive/archive-viewer-v2.html: deep lore archive.

This engine extends the original MG17 entry, not a separate fiction project.

## Implemented

- Ground Zero coordinate: the suitcase is the origin for an expanding greenhouse.
- Four cues: sealed, inspect, expand, trace.
- Six selectable records from 02-lore-database/objects or existing project lore: (1) boarding ticket; (2) lost-item tag; (3) environment parameter card; (4) botanical memory sample (provisional model); (5) travel utility kit; (6) MG-17 core (conceptual model).
- Desktop click/touch source selection, left-hand object list, WebXR select target-ray event; **actual headset input requires testing**.
- Operator panel: operator query option, reset, auto-cue, manual four-phase buttons, diagnostics.
- Copyable investigation summary. No user data upload, no backend, no telemetry.
- No fabricated numeric environment measurements, passenger identities, species, or reconstruction claims.
- Procedural meshes, not shipped final GLB/USDC art assets.

## Device fit and acceptance

| Device | Main role | Test gate | Priority |
|---|---|---|---|
| Desktop PC/Mac | curator, client preview | all 4 cues + 6 records + no blocking browser errors | P0 |
| Phone/tablet | scan-to-archive and nonimmersive preview | responsive, readable, reliable navigation | P0 |
| Meta Quest 3 | public WebXR and possible MR | measured stable target refresh ≥72 Hz, selection/recenter/exit | P1 |
| Meta Quest 3S | lower-cost venue deployment | label readability, scene optimized to headset | P1 |
| Apple Vision Pro Safari | premium VR web preview | gaze+pinch / hand selection and visual comfort | P1 |
| Apple Vision Pro native | real-case spatial tracking and premium MR | scene anchored to actual suitcase, stable reopening | P2 only after WebXR tests |

**Important**: The prototype's Quest AR mode, if available, renders an unanchored virtual scene over passthrough. There is no implemented surface hit-test placement, anchor persistence, real suitcase registration, depth occlusion, multiplayer, Gaussian splatting, or 6DoF physical manipulation. Do not advertise these as finished.

## Cost/benefit, additional person-days, not quotes

Assume existing lore and source repo reused; person-days exclude commercial asset production, device procurement, and taxes.

| Extra module | Incremental days | ROI |
|---|---:|---|
| Desktop/mobile visual QA and polish | 2–4 | Very high, broad audience |
| Quest WebXR input + perf QA | 2–5 | High, reusable across venue installations |
| Quest true MR surface hit-test/anchor | 3–7 | Good only when physical spatial alignment matters |
| Apple Vision Pro Safari WebXR QA | 2–4 | Medium-high, premium VR preview |
| Apple Vision Pro RealityKit object anchored experience | 8–15 | Medium short term, high in commissioned showcase |
| Mobile headset Gaussian splat optimization | 5–12 | Defer to World Remix rather than MG17 |

These are initial effort assumptions; update with observed results.

## Operator runbook

1. Place real silver case on stable stand. Check participant space and hygiene/fit.
2. Open HTTPS URL with ?operator=1 on staff desktop; verify WEBGL / ACTIVE.
3. Reset to sealed; verify no expanded greenhouse appears.
4. Give 30 seconds to find ticket, parameter card and sample. The other three records are optional for rushed sessions.
5. Manually move from inspect → expand → trace, or use AUTO CUE for staffed demonstrations.
6. Quest: open same HTTPS URL in Meta Browser; use immersive VR when supported. AR is an experimental unanchored overlay, not a calibrated installation.
7. Vision Pro: Safari immersive VR only when available; true MR/physical case tracking requires native RealityKit project.
8. After each participant, exit immersive mode, click reset, confirm 0/6 recognized.
9. On any failure, fall back to desktop and existing archive; do not block the visitor queue.
10. Staff shortcuts: number keys 1–4 for cues, R to reset, Esc to exit XR session.

## Verification gates

### Source built
- [x] Existing project lore and canonical object files reviewed.
- [x] Two-stage intake → XR preview link connected on development branch.
- [x] Four phases; six selectable records; operator panel; runtime feature detection.
- [x] JavaScript static syntax parsed.
- [ ] Browser rendering / actual 3D hit tests.
- [ ] Mobile viewport 360px testing.
- [ ] Timed interactive run and memory profiling.

### Hardware NOT VERIFIED
- [ ] Quest 3 Meta Browser three repeated runs; selection, exit and frame time measurements.
- [ ] Quest 3S contrast + 72 Hz tested.
- [ ] Vision Pro Safari gaze/pinch input.
- [ ] Staff operated 20 full visitor resets, ≥19 successful.
- [ ] If pursuing MR: surface placement, relocalization, physical suitcase registration.

### Art and commercialization NOT COMPLETE
- [ ] Replace procedural case with approved production model and Blender source.
- [ ] Model all 6 artefacts; named nodes ticket, tag, parameter, sample, utility, core.
- [ ] Device-specific texture/LOD packages and source provenance.
- [ ] Continuous 90 s capture, 6 object views, setup photos, 1 page operator summary.
- [ ] Clear asset permissions / rights and ready-to-share credits.

## Source of truth

- 02-lore-database/objects: canonical object facts.
- xr/ground-zero.html: procedural engine + interactive view.
- Archive/archive-viewer-v2.html: in-depth narrative archive.
- mg17-intake.html: publicly accessible entry.
- Store final object definitions as shared JSON later if adopting SceneForge or SpacePort; do not invent a second lore history.

## Platform references

- Meta WebXR: https://developers.meta.com/vr/documentation/web/webxr-overview/
- Meta performance: https://developers.meta.com/vr/documentation/web/webxr-perf-workflow/
- Apple WebXR WWDC26: https://developer.apple.com/videos/play/wwdc2026/8004/
- Apple native object tracking: https://developer.apple.com/documentation/visionos/using-a-reference-object-with-realitykit

## Release rule

No "Quest-ready", "Vision Pro-ready", "real-case anchored" or "commercially finished" claim unless the corresponding hardware/content QA checklist is evidenced. A GitHub merge proves source publication, not hardware performance.
