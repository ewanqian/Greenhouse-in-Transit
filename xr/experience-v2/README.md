# MG-17 / Spatial Performance V1 — 60–90s Hand-Driven Visitor Loop

Source: `xr/experience-v2/index.html` (independent derivative of the existing `xr/ground-zero.html`). Original Ground Zero and nine-route Branch Atlas remain unchanged as baselines apart from added navigation links.

## Artistic intent

An unclaimed miniature conservatory is misdelivered into the exhibition. The spectator does not tour a UI simulation: they intentionally open a physical-looking suitcase, recognize three modest everyday traces, release a miniature climate, witness the memory of a garden, try to recover the object, and decide the displaced space might remain habitable.

**Default no autoplay.** A separate **REHEARSE 85s** button explicitly automates actions with source `SIMULATED` so a curator can test pacing; it is not evidence of hand tracking.

## Six scene stages and author cues

| Target sec | Stage | Visitor action and rule | Actual visual/sonic behavior |
|---:|---|---|---|
| 00–12 | MISDELIVERED | Gaze or point at MG-17 latch; pinch 90ms then release (or click cue/desktop button) | Closed case/lock, authored short low transient |
| 12–39 | INSPECT | Select ticket, climate parameter card, botanical memory sample (all 3, any order) | Lid opens; each evidence has its distinct label in existing archive; no invented numeric measurements |
| 39–53 | BLOOM | Pinch/select spatial cue or core after 3 correct records | Shell/greenhouse expands, botanical meshes and low-pitched harmonic cue |
| 53–66 | AFTERIMAGE | Deliberate second cue: record the botanical memory | Original 27 curved 3D ghost traces appear, diffuse light/geometry |
| 66–78 | RECOVERY | Deliberate third cue: attempt recovery | Shell and plants retract, but afterimages remain: recovery fails |
| 78–85+ | HABITATION | Decide to let the space remain | Interior scale expands slightly, light returns, scene is complete; reset for next visitor |

The target times are **performance score guidance**, not a forced timer. Human interaction determines cue timing. Automated 85-second rehearsal is operator-only simulation and must not be described as a real performer take.

## Interaction sources and feedback

1. **Desktop and touchscreen**: screen click hits 3D meshes via a real Three.js raycaster. Big visible 3D cue card and case latch proxy can be selected. Side panel buttons and evidence list are accessible backup.
2. **Quest/compatible headset controllers**: the existing `renderer.xr.getController(i)` select signal now constructs the ray from **world-space controller origin and orientation**; this corrects the original mixed local/world ray.
3. **Raw WebXR hand joints**: within Three.js `renderer.setAnimationLoop(now, frame)`, loop over the actual session's `inputSources`; obtain `getJointPose` for **thumb-tip** and **index-finger-tip** with renderer reference space. A pinch is accepted only at ≤32mm for ≥90ms and requires subsequent >52mm release. Missing pose ≥180ms causes a no-click RELEASE/LOST. Both hands are tracked independently; no fabricated click on unknown input.
4. **Selection route**: direct virtual fingertip contact within ~14cm of a target if physically reachable; else gaze-camera ray plus deliberate pinch. This is **gaze+pinch**, not arbitrary skeletal fingertip teleportation. Controllers remain a fallback.
5. **In-XR feedback**: gaze reticle on an actual raycast target, 3D cue panel near the case, XR text panel, visible event/gesture state; 2D page diagnosis when not immersive. Meaningful action feedback is never just a short click sound.

Safety limitations: WebXR permissions and headset support are runtime-dependent. We have no room-scale real-case registration, anchor persistence, hand occlusion confidence, headset hardware tested timings, physical emergency audio KILL, multisensory scent delivery, multiplayer or production sound spatialization. Don't claim these features until tested on real devices.

## Real authored visuals vs placeholders

Reuse MG-17 procedural Three.js geometry and narrative files; 3D wireframe toggle is genuine mesh triangle-wire mode and **not** an edited image. Original line-memory geometry is performance-specific but not a copyrighted film/plant scan. The existing 2.3 KB GLB/USDZ placeholder does not have enough detail to claim finished art assets. Replace only after author approves a model, scale and scene composition.

No auto camera push, no generic psytrance strobe, no arbitrary tech/sci-fi props. 60–90s dramaturgy and quiet/visible transitions outrank effect count. The custom sound cues are low-volume procedural **prototypes**, not professional mix/mastered spatial audio.

## Live show operation

- Normal visitor: open original https://ewanqian.github.io/Greenhouse-in-Transit/mg17-intake.html then choose the new hand-driven performance route.
- Direct stage: https://ewanqian.github.io/Greenhouse-in-Transit/xr/experience-v2/index.html
- Operator: append ?operator=1 for the existing operations panel; manual reset also exposed without operator mode.
- Keyboard: Enter advances the **current gated cue**; in INSPECT, keys 1/2/3 select the three required items; R resets. Old legacy keys 1–4 cannot bypass story gates.
- `story-action` cue works as fallback; "REHEARSE 85s" explicitly labels simulated input.
- Export session downloads local JSON with actual event sources/timestamps, evidence, current state and false-claim boundaries. No telemetry/cloud upload.

## Technical acceptance checklist

**Verified through CI only (not by email or assumptions):**
- [ ] Node reducer tests: 6 stages, 3-evidence gate, repeated selection, 85s cue order, pinching dwell/release/tracking loss, 10k synthetic frames.
- [ ] Real Chrome desktop+mobile Playwright: WebGL actually renders; click action, select 3 real evidence items, advance 6 steps, wireframe toggle, export and reset; screenshots are attached to CI artifacts.
- [ ] Build public Pages bundle with allowlisted V2 HTML and pure module; public boundary audit passes; live deployment succeeds.

**Requires operator with physical devices:**
- [ ] Quest 3/3S: 3 full interactive loops of 60–90 seconds with camera, gaze reticle, hand pinch vs controller fallback.
- [ ] Thumb/index validity at 20 near misses and 20 deliberate pinches, self-occlusion and pose missing trials, status evidence; adjust threshold from measurements, not guess.
- [ ] Vision Pro Safari: immersive-vr / gaze+pinch/select availability and correct world geometry (no unverified immersive-ar claim).
- [ ] Sound check: real headset audio context running, 10min stable output, correct mute/panic, no distortion. Physical audio KILL required before stage.
- [ ] 20 operator resets, ≥19 successes, real compositor FPS vs JS FPS, GPU/thermal on target headset, capture uncut 60–90s run.
- [ ] Replace placeholders with actual artist-authored botanical/case assets and licensed material only after human accept.

## Three-Live separation

The 2026-11-09 Google Three-Live project is an experimental compiler/native transport, **not a replacement for these WebXR data/Show Score/3D story mechanics**. Its own proof-of-concept must be a separately built A/B (one same-case GLB and one input mechanic) with actual published version, source license, screenshot/geometry parity and hardware checks. No Three-Live CDN or rapid beta dependency is loaded by this production candidate.
