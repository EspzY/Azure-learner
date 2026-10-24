# G1 NPC dialogue and learning design

Historical RPG subsystem: preserved at `/legacy/rpg` after the owner-authorized 2026-10-24 Portal pivot. Canonical entry and ordinary learning now follow [PORTAL_PRODUCT_STRATEGY](PORTAL_PRODUCT_STRATEGY.md). The implementation/history below remains valid for the archive; it does not mandate new game development.

## G1.3 living teaching supersedes G1.1 pacing

Versioned presentation scripts now lead Ida's welcome/provisioning and service-mechanism teaching, and Noor's workload/requirements conversation. Full essential content is in the live sequence; optional field notes retain revision and additional inspection. NPCs explain actual mechanisms and consequences instead of mostly reading evidence classifications. Long beats use subtitles; short opening text can be projected beside the active character, without duplicate visible speech. Manual/pause/history controls are available; explicit service answers, acceptance and report still use the original deterministic story graph. Camera/demo/history timing cannot emit those events. The existing return predicates select unfinished, guided-built and reported Noor scripts. Source-asset and human review limits remain.

## G1.2 educational context and re-entry

Ida's opening speech now establishes Lysningen, Foundations 01, subsequent service responsibility and Noor's application team. Her returning speech points to actual progression in the log. Mechanism/misconception branches and full L1 material remain; welcome can be skipped without evidence. Log access overlays the conversation and returns to it. Choosing Foundations or the workshop offers manual versus explicit assisted walking. Noor uses real technical work even when the player bypassed the preliminary quest; guided findings are never independent mastery. [Onboarding](PLAYER_ONBOARDING.md) and [progression](EXPEDITION_PROGRESSION.md) own the cross-experience route. No new dialogue reward/event or content-version migration.

## L1 — educational manuscript drives investigation

Ida offers an explicit cloud-computing investigation alongside the preserved G1 conversation. This action walks to the real installation; the curriculum session uses the existing cinematic demonstration shot, with concise original speech and the active technical investigation. The six unit manuscripts live in nb.foundations rather than an enlarged one-off story graph. Learners can inspect mechanism/Azure examples, ask for full journal depth, perform bounded experiments and receive causal feedback. Closing retains the module and restores exploration; old service-model choices/Noor quest remain intact.

The shared journal is a structured reference, not the old dialogue transcript. Native nested modal focus returns to the original conversation/investigation, with assistance recorded during an active transfer. No dialogue event grants XP or fakes technical completion. [Manuscript](FOUNDATIONS_01_CONTENT.md) owns the actual educational text/spec and [content architecture](CONTENT_ARCHITECTURE.md) owns bindings.

## G1.1 pacing and speaker contract

The same reviewed graph/events now has two content layers: nb.rpg.spoken contains concise authored conversational beats; nb.rpg.dialogue retains the complete original explanations in field notes. Questions without an override use their original short text. There is no text truncation or automatic timed advancement. Explanation depth, including container maintenance and retained security duties, remains accessible before choosing an answer. Dialogue/inspection/replay earns no XP and never constitutes unaided evidence.

Ida opens/concludes with both people visible, asks operational questions over the player's shoulder and gives targeted misconception responses in close-up. In the workshop, her attributed text accompanies the real model/layer change; the camera shows the installation. Ida is not teleported there and no voice/lip-sync is implied. The installation is the interlocutor's visual focus. Noor's offer, requirements, accepted, unfinished, guided-satisfied and explicitly reported states retain their existing deterministic derivation. Requirements use a shoulder shot, while return explanations use a close-up. Optional post-report depth stays with Noor in field notes; asking to reconsider the model sends the player to the actual workshop.

The native cinematic dialog names the speaker, distinguishes system messages from NPC speech, labels player responses separately and restores an equivalent exploration interaction control after closing. Choices are authored **interface responses**, not recorded player audio or spoken lines. Arrow keys/numbers are scoped to a focused response; native select navigation is unaffected in notes. Escape closes notes before closing the conversation. Advancing a beat never waits for camera settling.

Sources S01/S12 were re-read on **2026-10-23** for the original shorter wording; no new technical capability is claimed. Future audio may attach to authored beats, but playback must never gate evidence, XP or quest truth. Human Azure-SME and learner comprehension reviews remain planned.

## Characters and roles

**Ida**, cloud guide: practical, curious, direct. She asks what a team wants to operate and uses the workshop to explain responsibility. She offers purpose → mechanism → caveat depth, or an experienced entry directly into investigation. Skipping the introduction grants no competence or award.

**Noor**, platform engineer: precise about workload constraints and evidence. Noor requests a custom web application platform without customer operation of the guest OS. Noor distinguishes an accepted task, unfinished recorded work, satisfied guided findings and an explicitly reviewed result. Neither character promises security, availability, exam success or independent mastery.

Both are actual rigged/animated people, physically approached in the spatial mode. Interaction is explicit; proximity never opens dialogue. Conversation pauses movement, turns people toward the learner, changes camera framing and uses a native keyboard-accessible dialogue. The same authored graph works in semantic mode without WebGL. No live AI model generates explanations or evaluates answers.

## Implemented conversation graph

Version 1.0.0; stable node IDs in `domain/rpg/story.ts`, original Bokmål in `src/content/nb.ts`. Node/choice references are validated in tests. Effects are allowlisted data, never scripts.

| Entry / branch                            | Learner action                                                 | Response and state                                                                                    |
| ----------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `guide-welcome`                           | Ask why, or choose experienced entry                           | Purpose/operational mechanism, or direct investigation; records meeting only                          |
| `purpose` / `mechanism` / `guide-detail`  | Explore deeper explanation                                     | OS/runtime/code boundaries, container caveat and retained security responsibilities; no reward        |
| `installation`                            | Select IaaS/PaaS/SaaS, compare at least two                    | Layer geometry/materials and corresponding explanation update; model observations recorded            |
| `service-question`                        | Select a model for custom code without guest-OS administration | VM/SaaS choices receive distinct misconception responses; PaaS is supported for these requirements    |
| `ownership-question`                      | Allocate remaining tasks                                       | OS/all-security misconceptions get corrective explanations; code/data/access/configuration is correct |
| `engineer-offer` → `engineer-brief`       | Inspect requirements, explicitly accept                        | Saves acceptance; does not create resources or fulfill technical requirements                         |
| `portal-ready`                            | Activate after investigation/decisions/acceptance              | Saves return context before loading the real guided workspace                                         |
| `engineer-reminder` / `engineer-progress` | Return without all guided findings                             | No congratulations; explains remaining investigation and preserves work                               |
| `engineer-built` → `engineer-reported`    | Review actual satisfied guided findings                        | Records discussion; explicitly says not independently assessed/full chapter complete                  |

Re-entry is derived, not a one-way dialogue completion flag: meeting Ida changes her entry to `guide-expert`; current technical state changes Noor's entry. Reset technical work and Noor loses a satisfied-result response. Portal visits and render timing cannot create that response.

## Teaching sequence and causal demonstration

1. Discover why the operating boundary matters before choosing a product.
2. Physically inspect the installation: infrastructure/OS/runtime/application/network/settings/identity/data are **responsibility layers**, never management scopes.
3. Switch IaaS → PaaS. OS moves to Microsoft; customer data/identity/settings stay. Shared application/network responsibilities remain visible where relevant. SaaS represents using a supplied application, not hosting arbitrary custom code.
4. Apply these differences to the team requirement. Incorrect answers explain the mismatch; retries preserve the history.
5. Accept Noor's assignment and use actual resource/policy/dependency rules in the workbench.
6. Return and discuss evidence from that work, retaining explicit guided/independent boundaries.

The challenge tests two connected reasons, not the word “PaaS” alone. Feedback is immediate and assisted. Neither model comparison, correct retry nor a guided technical result is independent evidence. There is no new XP for replaying dialogue, clicking or following hints.

## Source-backed nuances

Technical sources use the existing [source register](SOURCE_REGISTER.md): **S01** shared responsibility, **S12** App Service plans, **S03** resource groups, **S38** policy deny. S01/S12 were re-read for G1 on 2026-10-23. UI references open explicitly in a new tab, preserving game state. Materials and questions are original; no proprietary Microsoft assessment is reproduced.

- A managed platform does not transfer all customer security obligations. Data, identities, configuration and controlled code still need customer work.
- The installation is a simplified responsibility comparison, not a complete inventory of Azure controls, endpoint protection or contractual obligations.
- Built-in App Service runtime differs from customer-supplied container maintenance. The latter does not remove responsibility for container contents.
- A plan supplies the app's compute/OS/region in the bounded guided model. A resource group's metadata location does not substitute for hosting configuration.
- The custom Web-location rule is an authored training policy, not every Azure built-in policy or an authorization failure.

## Authoring requirements

Each new branch needs an objective, misconception or technical purpose; a real learner choice; an allowlisted observation/action; original localized feedback; source IDs; and an accessible equivalent. Choices may test a condition, trigger a workshop/navigation action or emit a typed observation. Re-entry must examine current validated state. All essential mechanisms must be available without finishing introductory prose. Do not hide missing technical logic behind dialogue congratulation or a successful animation.

Before publishing a new teaching branch, verify both incorrect/correct paths, references, source date, version compatibility, controller escape/return, narrow readable layouts and the distinction between assistance and independent assessment. Future contextual tutoring may recommend authored nodes; factual truth and scoring must remain constrained by reviewed content and domain rules.

## Evaluation status

Automated graph, answer, state and browser checks establish implementation behavior only. A beginner should explain the responsibility change in their own words; an experienced engineer should challenge the container/hosting caveats and try unfinished return; an Azure reviewer should inspect policy and location reasoning. These human exercises remain planned, not completed learning validation.
