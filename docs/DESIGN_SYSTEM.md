# Design system

## A calm cloud workbench

Dark navigation, a neutral work area and a deeper architecture canvas create spatial hierarchy. Mint marks active learning/selection; muted blue marks explanations and navigation. This original design does not reproduce the Azure Portal.

| Token      | Value     | Role                                      |
| ---------- | --------- | ----------------------------------------- |
| Background | `#f6f8fb` | Main surface                              |
| Ink        | `#172338` | Primary text                              |
| Muted      | `#617087` | Secondary text                            |
| Line       | `#e2e8f0` | Separation                                |
| Navy       | `#101c2e` | Immersive surfaces                        |
| Mint       | `#bef477` | Hero action, selection, activity progress |
| Blue       | `#2563c4` | Learning accent                           |

Tailwind CSS 4 is available. Semantic component classes and CSS properties in `globals.css` own current styling. System fonts avoid downloads. Restrained gradients, borders and shadows add depth without WebGL or animation dependencies.

## Components

- Shell: desktop rail/mobile top navigation, `aria-current`, explicit simulation labels.
- Buttons: dark primary, mint hero, outlined secondary and confirmed destructive actions.
- Scope nodes: icon, type and name, visible selection plus `aria-pressed`. Dashed identity links differ from containment.
- Inspector: role, parent, location and specific nuance; selection never mutates simulation state.
- Forms: native labels/controls, naming guidance, associated errors, live feedback.
- Assessment: fieldsets/legends/radios, explicit submission, explanations, retry/reflection.
- Previews: planned labels without dead controls or pretend integrations.

## Accessibility and responsive behavior

Graph nodes are keyboard-operable buttons. Equivalent HTML list and inspector communicate names, parents and regions. Pan/zoom/fit controls support visual exploration; wheel zoom is disabled to preserve document scrolling.

Below 960px the inspector moves under the map; below 640px cards stack and navigation becomes a top row. Labels remain visible. Focus indicators, a skip link, landmarks and live announcements are present. Reduced-motion preferences are respected; no automatic parallax or 3D.

Axe scans supplement interaction tests but do not establish WCAG conformance. Human screen-reader/contrast review and more browsers remain Phase 1 work. Narrow screens may need map zoom; list view is the reliable text alternative. Preserve required third-party graph attribution.
