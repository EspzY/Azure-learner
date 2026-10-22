# Design system — immersive reset

Phase 0.5 replaces the white/navy/mint dashboard direction. All routes share a dark environment with upright technical labels, carefully separated surfaces and restrained luminous selection. Full interaction/rendering reasoning is in [EXPERIENCE_DESIGN.md](EXPERIENCE_DESIGN.md).

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
