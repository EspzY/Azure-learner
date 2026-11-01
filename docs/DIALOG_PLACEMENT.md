# Dialog placement — PR44 / UX-01

## Cause and bounded correction

Confirmed on the anonymous PR43 preview, full application SHA `0d7905061ccd9bd0684a37cea895b0baad137c38`: native `PortalDialog.showModal()` had computed `margin: 0` after the global reset. At1440×900 the Security start dialog occupied x0/y0,750×563.984375. A DOM-only `margin:auto` experiment moved the unchanged box to x345/y168; removing it restored the defect. This reproduces [the PR42 owner image](reviews/screenshots/owner03-assessment-dialog-1440x900.png).

The only application change is `.portal-dialog:not(.portal-side-panel) { margin: auto; }` in `portal.css`. Existing width750/95vw (96vw below800),90dvh maximum, internal overflow, sticky header, spacing, backdrop, focus, Escape and reduced-motion behavior remain. No coordinates, new framework, component/state transition or store changes.

| Overlay                                                                                               | Result                                                     |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Security, Storage, Identity, Monitoring start; global Journal; ordinary Portal Help and confirmations | Native viewport-centered modal                             |
| Notifications and Appearance/settings                                                                 | Existing right-side panel; explicitly excluded             |
| Native GuidanceWindow/MissionBriefing                                                                 | Existing own centered styling, Start/Cancel and scroll     |
| PR43 Portal SavvyShark recovery menu                                                                  | Existing header-anchored menu, including320/800 boundaries |

## Actual before/after and short windows

| Capture                                                                          | Actual bounding rectangle in CSS pixels                       |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| [Before1440](screenshots/dialog-placement/before-assessment-1440.png)            | x0,y0,w750,h563.984375                                        |
| [After1440](screenshots/dialog-placement/after-assessment-1440x900.png)          | x345,y168,w750,h563.984375                                    |
| [After1024×768](screenshots/dialog-placement/after-assessment-1024x768.png)      | x137,y102,w750,h563.984375                                    |
| [After1024×500](screenshots/dialog-placement/after-assessment-1024x500.png)      | x137,y25,w750,h450; internal scroll114 brings Start into view |
| [Journal1440](screenshots/dialog-placement/after-journal-1440.png)               | x345,y45,w750,h810; long content scrolls                      |
| [Notifications1024](screenshots/dialog-placement/after-notifications-1024.png)   | x584,y40,w440,h728; margin0                                   |
| [Native SavvyShark1440](screenshots/dialog-placement/native-savvyshark-1440.png) | x200,y24,w1040,h852; unchanged own geometry                   |

All seven actual images inspected. Centering replaces the corner attachment with balanced space without changing content or making buttons permanently sticky. At short heights, ordinary internal scrolling and keyboard focus expose the existing actions; the short screenshot shows Start focused, not pressed. The long Journal remains long: content consolidation is outside UX-01.

## Verification and integrity

New `dialog-placement.spec.ts`: eight desktop cases plus one justified initial compact Portal/native/geometry witness. Four assessment types assert actual centering within1CSSpx at1440×900,1024×768,1024×500; modal/title, opening focus, Tab/Shift+Tab, inert background, Cancel/Escape, focus and scroll return, reachable unobscured Start and no attempt/write. Journal covers1440,1024short,800compact, keyboard End scrolling, reduced motion and Axe. Portal exercises ordinary Help, right Notifications/Appearance, real local Resource Group plus receipt preservation,320/800 header/menu bounds and both native briefings. Actual pinned full Chromium browser zoom uses its isolated appearance setting at200% (DPR2/innerWidth720), followed by doubled computed text size; no CSS zoom or fake device emulation.

The eighth case explicitly starts/submits an unaided first, opens a new partial assessment, denies the durable assistance write, verifies protected Journal content withheld and exact draft retained, then verifies durable assisted access after reload while preserving the original first. Nine affected existing VM/PaaS/Compute/Networking guide recovery, short/reduced-motion/Axe, Portal keyboard and denied/cross-tab assistance cases also pass.

Final targeted results:8/8desktop (34.9s),1/1compact (6.4s),9/9existing affected (40.7s), all exit0 without retry. Early new-test failures were locator/hydration/scroll synchronization and browser launch configuration issues, corrected without changing product behavior or weakening assertions. The plan retains all265 inherited executions and adds9:274=253desktop+21compact; optional full legacy506. Pinned browser, workers/retries/timeouts/skips and every old test remain unchanged. Full candidate CI/strict and external final-SHA journey are separate delivery requirements; local evidence is not substituted for them.

All domain/content/app code, banks/rubrics, learning stores, teaching/Journal/assistance, Sandbox commands/World/receipts/XP, Course resume/navigation and PR43 guide code remain byte-identical to the base. No assessment is created by open, Cancel or Escape. No new curriculum/coverage or exam-readiness claim. Other P1/P2 findings remain open. Human SME, novice UX, screen-reader, psychometric and measured-learning validation remain unperformed. No merge/production deployment.

## Scoped sources

Reviewed1November2026. [Microsoft Portal overview](https://learn.microsoft.com/en-us/azure/azure-portal/azure-portal-overview), updated26January2026, supports the existing graphical-management context only; no Azure capability is added. [MDN native dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) documents `showModal`, inert background and native dialog behavior; [MDN margin](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin) explains auto margin. The CSS cause and focus/short-height conclusions are additionally demonstrated by actual pinned-browser geometry and state checks, not inferred from Microsoft documentation. Earlier manuscripts/assessments were preserved, not re-audited.
