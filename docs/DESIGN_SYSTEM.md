# Design system — immersive reset

## L1 readable technical investigation

The cinematic environment now supports a constrained instrument surface and a semantic shared Knowledge Journal: 15–16px body text, 1.75 line spacing for theory, visible violet section hierarchy, cyan data and amber unmet demand, native labelled controls and 3px cyan focus. Mobile uses a compact upper demonstration with a scrollable lower investigation; short landscape retains separate scene and control columns. Every chart has table/label equivalents. [Experience design](EXPERIENCE_DESIGN.md) and [content standards](CONTENT_STANDARDS.md) govern educational depth and visual review.

## G1.1 cinematic composition

Conversation uses open subtitle/choice composition rather than a bordered command surface: important speech #f4f1f3, speaker #e0ceaa, response focus #e1bc80, restrained violet response wash and a midnight bottom gradient. Desktop speech is 20 px with 1.65 line height; mobile 16 px / 1.55. Optional larger text is 23/19 px. Choices remain at least 44 px high. Speaker head framing responds to viewport and the measured text boundary. Technical field notes deliberately retain an opaque readable surface and scroll independently. [World design](GAME_WORLD_DESIGN.md) owns responsive/shot decisions.

## G1 spatial presentation

The separate game route retains midnight/violet/cyan identity and adds ivory/slate construction, teal ground and warmer character/lighting accents. This avoids an all-purple world. [World design](GAME_WORLD_DESIGN.md) owns environment, camera, HUD and responsive dialogue composition; the licensed mesh/material pipeline is in [asset register](ASSET_REGISTER.md). Existing technical-workbench tokens remain below. All essential labels/choices have readable HTML equivalents; scene textures are not the sole learning interface.

Phase 0.5 replaces the white/navy/mint dashboard direction. All routes share a dark environment with upright technical labels, carefully separated surfaces and restrained luminous selection. Full interaction/rendering reasoning is in [EXPERIENCE_DESIGN.md](EXPERIENCE_DESIGN.md). Phase 1B.1 extends that language: cyan dotted membership differs from solid management edges; directed violet hosting links differ from both. Amber policy/rejection annotations are not resource models. Plans use compute plates and apps a code window; visible selection and textual relationship/property alternatives carry the same meaning without relying only on color. The desktop operational console and mobile split scene/console share native controls and focus indicators.

| Token          | Value     | Meaning                                        |
| -------------- | --------- | ---------------------------------------------- |
| Environment    | `#070b1a` | Midnight background; no white workspace        |
| Surface        | `#11172c` | Contextual UI material                         |
| Raised surface | `#161d36` | Foreground controls                            |
| Line           | `#2c3453` | Quiet separation                               |
| Primary text   | `#e9edff` | Important labels and explanations              |
| Secondary text | `#a8b1cb` | Readable supporting text                       |
| Violet         | `#a48bff` | Selection, active path, focus/navigation       |
| Magenta        | `#f05bb5` | Identity association and mission attention     |
| Cyan           | `#50d8e8` | Technical containment and location comparison  |
| Success        | `#a6e6cd` | Confirmed outcome, never fabricated competence |

Primary buttons use a darker violet surface with light text; bright accents are borders/labels rather than indiscriminate neon fills. Geometry uses distinct top/side materials and a ground reference. Shadows and glow support real projected volume instead of substituting for it. System sans typography and a system monospace stack avoid network fonts.

## Components and layout

- Slim desktop navigation rail and top status strip; mobile bottom navigation with the same routes.
- Scene-first Explore: contextual selection, upright labels, camera controls and meaningful connections occupy the viewport.
- Native HTML node buttons, a dark XYFlow diagram and an equivalent list share domain selection/actions.
- Context inspector: concise role, parent/location, relevant command, expandable nuance and child navigation. Desktop anchoring becomes a mobile bottom sheet with internal scrolling.
- Mission HUD: current objective and three current-attempt steps. Stored XP is separate from replay status.
- Native modal commands: brief, two-property resource-group creation, sequential check and scenario reset. Visible labels/errors and explicit actions, with no hidden fake operations.
- Supporting mission/progress routes use restrained dividers rather than a grid of white cards. XP, mastery and readiness retain separate meanings.

## Interaction rules

Visible focus rings and native controls are mandatory. Selected geometry and its connections are emphasized, while unrelated geometry recedes without fading essential text below readable contrast. Successful creation materializes the actual new object and focuses its label; XP feedback reports only the award earned. Domain errors remain associated with the configuration control.

Camera transitions are approximately 420ms, inspector entry 220ms and object creation 650ms. Reduced-motion mode removes transitions/animations. No auto-orbit, background animation loop, ornamental parallax or audio is introduced.

At 640px and below, Explore uses a bounded camera viewport plus contextual bottom sheet/HUD; essential learning does not become a long mobile document. Diagram/list alternatives and manual zoom/overview avoid precision-dependent gestures. Modal content scrolls at short heights and form inputs use mobile-readable sizing.

Automated axe checks and viewport screenshots supplement manual inspection. They do not establish WCAG conformance, physical touch-device usability or screen-reader support across all engines. Those remain explicit validation work, including short landscape viewports and Safari foreignObject/dialog behavior.

## Proposed journey expansion — not implemented

Phase 1A preserves these visual tokens but broadens representation beyond one scene. The [product blueprint](PRODUCT_BLUEPRINT.md#coherent-experience-architecture) specifies orientation, competency navigation, active workspaces and evidence review. [Experience patterns](EXPERIENCE_PATTERNS.md) select spatial, matrix, flow, table, timeline or comparison based on the learning problem. Keep checkpoint, selected resource, relation type and simulation boundary consistent across lenses. Do not use a beautiful object, generic card or animation as evidence that learning occurred.

Chapter 01's proposed matrix/receipt controls and mobile composition need new screenshots and human accessibility review when implemented. The existing screenshots/axe results validate only Phase 0.5 states. No new design is claimed as rendered or tested in Phase 1A.

## Phase 1A.5 journey composition

The expedition uses a perspective landscape, a narrow contextual console and a route overview instead of a dashboard. Its geometry, camera timing and mobile bottom-console behavior are canonical in [JOURNEY_EXPERIENCE.md](JOURNEY_EXPERIENCE.md). The existing orthographic resource world keeps its distinct technical composition.

Within responsibility teaching, magenta denotes customer work, cyan Microsoft operations and violet shared responsibility; adjacent native labels always state the owner. These are a context-specific legend, not a global claim that cyan always means Microsoft. Portal cyan/green confirms historical activity; it never indicates mastery. Navigation dots indicate visited positions only. Correctness also has text/icons; color is not the sole signal. New stops reset internal scroll/focus; mobile layer controls scroll horizontally without widening the viewport.
