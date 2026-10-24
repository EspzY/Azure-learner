# Lysningen — G1 world design

Historical RPG subsystem: preserved at `/legacy/rpg` after the owner-authorized 2026-10-24 Portal pivot. Canonical entry and ordinary learning now follow [PORTAL_PRODUCT_STRATEGY](PORTAL_PRODUCT_STRATEGY.md). The implementation/history below remains valid for the archive; it does not mandate new game development.

## G1.3 presentation, not an environment replacement

Existing Lysningen geometry, characters, lighting and movement remain. A bounded speaker projection links short opening text or a small speaker/beat marker to the actual NPC eye target; long technical text stays in readable subtitles. Short-height and non-WebGL modes use the subtitle rather than hiding core speech in an unavailable bubble. Demonstrations intentionally frame the real responsibility/teaching installation. Original semantic flow/matrix/topology/timeline cues supplement it; no Learn images, new character models or photorealistic-art claim. The optional original ambient bed is registered in [asset provenance](ASSET_REGISTER.md). Human art/musical/reading-pace acceptance remains separate.

## G1.2 authored arrival and wayfinding

Lysningen is explicitly a fictional first learning station for an application team's modernization, with Ida as learning guide and Noor as platform engineer. Three skippable establishing views orient toward station, installation/people and gateway; the existing licensed geometry is retained. Selected destination gets a restrained ground marker and readable distance/direction cue. No new world, character, effect or asset is introduced. [Onboarding](PLAYER_ONBOARDING.md) owns the actual sequence; professional asset/hardware and human usability acceptance remain distinct from these presentation changes.

## L1 teaching projection

The existing Lysningen art, characters and physical installation are retained. Curriculum investigations project original labelled demand/allocation/shortfall columns or deployment-boundary shapes at the installation; the amber shortfall derives from the pure model. A bounded learning-framing hint reserves the upper mobile view while preserving old cinematic shot intent. These are explanatory teaching geometry, not new Azure resources or a claim of upgraded environment/character fidelity. No third-party asset is added.

## G1.1 conversation direction

Exploration remains third-person in the same Lysningen location. Authored conversational intent selects an establishing/concluding two-character view, a player-shoulder question view, a focused NPC response or a workshop demonstration. Character eyes remain above the measured dialogue boundary. Position/bearing and aspect determine composition; the four building proxies still constrain the camera. Interrupting/advancing a beat retargets the current camera without queuing cutscenes. Exit damps to the unchanged player pose/orientation; motion reduction cuts immediately to equivalent compositions.

Subtitles sit low on the left/centre, answers on a separate right-hand vertical list. A warm ivory/gold speaker/focus accent supports the navy/violet environment. A bottom gradient replaces the boxed conversation surface. Top HUD/nameplates/large station signs recede during conversation. Mobile places the speaker above a compact scrolling conversation area; short landscape uses two columns for people, while the workshop occupies the left half and scrollable controls occupy the right. That split reserves horizontal scene space instead of shrinking the installation behind a tall text stack. Larger text is available; it can require scrolling. Field notes are deliberately a readable inspection surface rather than pretending that long technical paragraphs are speech.

Presentation polish reduces sign scale and background weight, fits text to label width and prevents responsibility labels intersecting plates. Cooler unshadowed fill, restrained ambient light and earlier atmospheric falloff separate faces/construction/distance; no postprocessing, new asset or environment rewrite. The workshop remains schematic responsibility geometry, never management containment or a physical Azure deployment.

**Asset/art limit:** existing Kenney Mini Characters remain strongly stylized, large-headed figures with source limb/gesture limitations. Better composition does not make them high-fidelity mature character art. A future reviewed coherent character/animation family, all-limb clearance and representative-device review remain separate gates. No new assets are introduced in G1.1.

## Review status and purpose

`/expedition-3d` is a playable comparison candidate, not a replacement for `/`. Engineering verification, owner visual acceptance and educational validation are separate gates. Automated coverage and image inspection cannot establish professional art acceptance or learning effectiveness. Actual results and open defects live in [project status](PROJECT_STATUS.md).

The player is a visiting engineer at **Lysningen**, a small coastal research station. The route moves from arrival, through a responsibility workshop, to a platform engineer and a training gateway. This is a bounded outdoor chapter, not an open world. Buildings suggest the work of a station rather than representing Azure management scopes or physical datacenters.

## Selected art direction

Stylized, constructed technology: ivory modular architecture, slate metal, teal ground and cyan technical light against midnight blue/violet atmosphere. Purple player clothing and restrained violet portal illumination connect to AzureLab's identity without recoloring every object purple. Shapes and silhouettes come from a coherent reviewed asset family: actual hangars, pipes, machinery, dishes, cargo craft, rocks and rigged people. They are not primitive proxies for buildings or NPCs. Original geometry is reserved for terrain, deck, sky, lights and the deliberately schematic responsibility installation.

Reference sources are [Kenney Space Kit](https://kenney.nl/assets/space-kit) and [Mini Characters](https://kenney.nl/assets/mini-characters). [Asset register](ASSET_REGISTER.md) records exact files, licenses and modifications. The style is intentionally small and stylized; it is not photorealistic, bespoke character art or evidence of finished production art direction.

## Playable composition

World units are approximate meters. Player height is normalized to 1.75. Main walkable spine: x −4.5…4.5, z 14…−27; three side bays allow approach and limited exploration. The station's technical installations are not collidable Azure resources.

| Place                   | Center x/z | Physical interaction radius | Learning purpose / response                                                       |
| ----------------------- | ---------- | --------------------------- | --------------------------------------------------------------------------------- |
| Arrival                 | 0 / 11     | —                           | Read the route, take voluntary control; no auto travel or award                   |
| Ida                     | −3 / 4     | 2.5                         | Explicit conversation; branch into purpose, mechanism or experienced entry        |
| Responsibility workshop | 3 / −3     | 2.7                         | Select models; physical layer positions and ownership colors change               |
| Noor                    | −3 / −13   | 2.5                         | Receive requirements; revisit with actual unfinished or satisfied guided findings |
| Infrastructure gateway  | 0 / −24    | 3                           | Explicit eligibility check, local save, activation, workbench entry               |

The foreground contains the player, seams, fasteners, small rocks and equipment. Midground bays contain people, workshop, pipes and station architecture. Background hangars, dishes, craft and layered rock formations provide scale and distance. The gateway is visible as a destination. No empty future worlds are presented as playable.

## Camera and character

WASD/arrows move a real animated character at 2.7 units/second, including backward/lateral world-relative movement. The character turns toward movement; idle/walk/interaction clips crossfade. The camera follows behind the authored northbound route, with damped position/look targets and separate conversational framing. Four authored building bounds shorten its ray to avoid solid architecture. It is not a freely orbitable camera or general-purpose collision system. Manual input cancels assisted walking.

Reduced motion makes camera and workshop changes immediate while retaining voluntarily initiated locomotion. NPCs face the learner and use interaction gestures during conversation. No autoplay conversations or movement are tied to approach. Fine motion/foot contact and camera framing still require human play review; animations do not prove learning.

Conversation framing follows the learner's approach bearing, including returning from the gateway, so the camera views the person from the same side as the player. G1 originally hid the player and nameplates during all conversations; G1.1 supersedes that blanket player rule with shot-specific visibility. The quest HUD also recedes while dialogue is open, leaving responsibility labels and character faces readable.

Foot contact is corrected against the actual animated shoe/leg geometry, and the walking rate is calibrated to controller speed. Side bays have continuous deck surfaces. This corrects source clip height drift; full IK, all-limb clearance and human locomotion review remain outside the verified claim.

## Interaction surfaces and responsive design

The full viewport is the world. A compact location/XP header, optional quest HUD and proximity cue provide orientation; no permanent textbook or course catalogue occupies the scene. Native dialogue is a bottom layer with readable original Bokmål, choice rows, explicit close/Escape and expandable sources. It pauses movement while the environment remains visible. The workshop changes in the scene behind its controls.

Touch uses held directional buttons with cancellation/capture handling; optional orientation offers actual path-following walking around obstacles. Neither requires precision dragging. A semantic alternative selects places directly and provides all conversations, model comparisons, challenge decisions, portal access and actual workbench results. It does not claim to measure spatial ability. Small screens use lower initial quality and constrained, scrollable dialogue; short-height layouts retain the controls. Labels are also available as HTML, not exclusively in 3D textures.

## Review exercises / rejection criteria

1. Walk, stop, reverse and explore each bay; inspect feet, turning, proximity and camera intersections while moving.
2. Approach both people without triggering dialogue; explicitly talk, branch, close and return.
3. Compare IaaS/PaaS; verify OS layers move between customer/provider, while data/access remain with the customer.
4. Give a wrong answer, inspect explanation and correct it. Open the gateway only after the required decisions and accepted quest.
5. Exit unfinished work, return at the gate, finish real guided work and compare Noor's response. Reload and revisit.
6. Repeat at desktop/mobile sizes, keyboard only, reduced motion and without WebGL.

Reject for sliding/T-pose, obstructed reading, misleading technical geometry, invisible consequences, dead-end navigation, incorrect congratulations or loss of saved work. Owner review must judge visual quality during play, not screenshots alone. Keep this route separate until that review passes.

## Mandatory G1 quality-gate assessment

This is an evidence matrix, not a claim of owner acceptance. Actual command results are in project status.

| Gate                                        | Implemented evidence / remaining review                                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Controllable third-person character         | Actual position changes from held keys/touch; E2E asserts displacement and voluntary stop                                                              |
| Travel rather than camera-stop presentation | Free bounded movement, reversal/lateral control and optional interruptible walking; no ordinary-stop teleports                                         |
| Environment beyond primitive proxies        | Reviewed station meshes/props/terrain composition; actual images inspected; premium art acceptance remains owner review                                |
| Actual NPC characters                       | Two distinct skinned humans, separate skeletons/mixers and physical approach cues                                                                      |
| Functional locomotion/interaction           | Idle/walk/interact crossfades and observed bone motion; no permanent T-pose; foot contact/turning still needs human motion review                      |
| Meaningful dialogue branches                | Purpose/mechanism/experienced path plus different wrong-answer explanations                                                                            |
| NPC reacts to real quest state              | Noor entry derives from current guided findings and explicit report                                                                                    |
| Quest truth outside UI flags                | Pure typed story facts, actual technical context; visits/animation alone cannot finish it                                                              |
| Reactive technical installation             | Responsibility mesh positions/materials change; OS position and HTML equivalent are tested                                                             |
| Physical gateway/context continuity         | Proximity, explicit eligibility, activation, saved gate pose, real workbench and safe return                                                           |
| Challenge inside the game                   | Two connected authored decisions from the workload/installation; no separate quiz page                                                                 |
| Existing Azure correctness                  | Existing resource/policy/receipt/scenario modules unchanged; real denial, correction and hosting exercised                                             |
| Keyboard/mobile/accessibility alternatives  | Held native controls, assisted routes, native dialogue, reduced motion, semantic parity and Axe; human screen-reader/device review outstanding         |
| Clear asset licenses                        | Every included external file mapped to official CC0 archive and retained license; hash/reference/rig checks                                            |
| No unauthorized services                    | Local assets/authored dialogue, no paid/live Azure/AI/account integration                                                                              |
| Existing regression assertions preserved    | Original three E2E files and technical domain modules unchanged; regression suite retained                                                             |
| Visual acceptance distinct from tests       | Screenshots/play evidence reviewed, owner acceptance unperformed; no professional-art claim inferred from build/tests                                  |
| Visual defects treated as defects           | Origin/scale, conversation occlusion, coplanar bay surfaces and workshop framing corrected after inspection; remaining limitations recorded explicitly |

## Reproducible complete walkthrough

1. Open `/expedition-3d`, choose **Ta kontroll**, walk/stop/reverse with WASD/arrows or held touch controls. Orientation can walk to a place through the same corridor; manual input cancels it.
2. Approach **Ida**, press E. Ask why the models exist, then what changes technically. Choose the workshop demonstration, or take experienced entry without claiming mastery.
3. At **Ansvarsverkstedet**, compare **IaaS** and **PaaS**. Observe OS switching sides while customer data/identity/configuration remain. Expand the HTML responsibility list or technical references for detail.
4. Choose **Prøv teamets beslutning**. Try IaaS, read the reason it misses the no-guest-OS requirement, retry with PaaS. Reject the idea that Microsoft assumes all security responsibility; correct to code/data/access/configuration.
5. Walk to **Noor**, inspect the workload brief and explicitly accept. Approach **Infrastrukturporten** and activate it. Eligibility/save occurs before the entry effect.
6. First exit unfinished using **Tilbake til 3D-ekspedisjonen**. You return near the gate; Noor still requests work. Re-enter without losing valid technical commands.
7. Follow the [guided build walkthrough](CHAPTER_01_GUIDED.md): transfer PaaS/provider-OS/customer-code reasoning; create the application group in App Sandbox with Norway East metadata; predict independent plan placement; request North Europe and inspect the real custom policy denial; correct the plan to West Europe; create the app referencing it; explain metadata, hosting dependency and location correction. Nothing is deployed to Azure.
8. Return to the game. The HUD requests a report, not full Chapter 01 completion. Visit Noor; **Gå gjennom mitt veiledede arbeid** is available from actual satisfied findings. Reload and revisit: the safe pose, work and discussion remain; legacy XP is unchanged.
9. Repeat with reduced motion, keyboard-only navigation, or **Bruk tekstbasert spillalternativ**. Both learning decisions and the real workbench remain available. An unfinished return never receives the satisfied-result dialogue.

Production automation reproduces this through `npm run test:e2e -- tests/e2e/rpg.spec.ts`. It records raw screenshots, WebM and Playwright traces in ignored `test-results/`; open a generated `trace.zip` with `npx playwright show-trace <path>`. Reviewed images are versioned and linked in project status. Stop other port-3000 servers first. Software-WebGL/video cases are serialized to avoid observed concurrent context teardown stalls; assertions and accessibility checks remain enabled.

## Performance and evidence

Target budgets: under 2 MB reviewed GLBs, under 100k visible triangles, preferably under 120 render calls, bounded DPR (1…1.5 initially, 0.85 on sustained slow automatic mode), no postprocessing or remote runtime asset dependencies. Desired desktop 60 FPS/mobile 30 FPS are targets requiring representative hardware; headless SwiftShader is not that hardware. Settings expose actual rolling frame intervals, p95, calls, triangles and sample count. [Gameplay architecture](GAMEPLAY_ARCHITECTURE.md) describes batching, adaptation and lifecycle. Reviewed screenshots are linked from project status; raw traces/video remain reproducible test artifacts.
