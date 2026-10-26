# Portal learning manuscript and vertical slice

## Retirement status — 2026-10-26

Current delivery is the course, SavvyShark and shared Portal/SaaS labs. The RPG, timed Living Learning and SVG journey are retired; older sections describing their presentation are historical. No competency objective, original manuscript, assessment rule, source mapping or learning-data version is removed. SandboxStore still validates the frozen Chapter01 prefix; the old Chapter UI/provider does not run. See [audit and actual shared-code extraction](LEGACY_AUDIT.md) and [current architecture](ARCHITECTURE.md).

## 3.2.1 practical extension

The complete existing manuscript and conceptual experiments remain. Service Types IaaS/PaaS/SaaS now each have a practical entry with purpose, supported actions and exact lesson return. VM creation persists its real local dependency set; PaaS adds App settings to existing Web flows; SaaS administration uses a separate fictional product. Inspection and changed-task reasoning are required alongside actual accepted commands. Independent criteria/feedback are withheld until delivery or explicit help; guided correction is not independent mastery. [Coverage and gaps](FUNDAMENTALS_LAB_COVERAGE.md), [implemented specifications](INTEGRATED_LABS_ARCHITECTURE.md).

## 3.2 operational Service Types extension

The existing original service manuscript, simulation, guide, policy rejection and architecture remain. Current course Service Types v2 adds operational configuration/reasoning before and after the lab; legacy `version=1` preserves its original guided cases/assessment. The [deeper manuscript](SERVICE_TYPES_DEEP_LEARNING.md) distinguishes conceptual VM/SaaS/platform controls from actual supported group/plan/app operations.

Lab origins preserve exact current/archive/computing return. An explicit reuse action can adopt replayable accepted resources from the current technical attempt when no course lab exists; it does not fabricate policy/hosting inspections or transfer old learning evidence. Existing valid lab sessions resume; no automatic inventory reset or duplicate group setup. Guided lab facts plus the new retained-responsibility answer are required by new practice; independent service evidence remains separate. New active assessments disable solution highlights, and external theory/guidance access is classified as assistance.

## Course-first refinement — 2026-10-25

The complete manuscript below is reused in `/learn/services`, with explicit previous/next activities. Applied group/plan/app work follows theory and justified cases; SavvyShark guides actual controls and causal inspection. Exact return to `services/practice` provides a factual guided debrief and retained-responsibility reflection. Existing changed independent task/rubric remains separate. [Course flow](COURSE_FIRST_PRODUCT_EXPERIENCE.md) replaces manual coordination, not substantive content.

Authored before portal presentation, 2026-10-24; original AzureLab service-types module v1.0.0, F01 with G01/C01/G03 application. This replaces the RPG as teaching presentation without deleting its source history. Exact English metadata remains distinct from our original Bokmål learning activities. Human Azure SME/learner review is not performed.

## Objectives, sources and activity contract

Official [Describe cloud service types](https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/) has six units and four outcomes: describe IaaS, describe PaaS, describe SaaS, identify appropriate uses. Original content below maps these separately; the old responsibility workshop alone was partial coverage. Sources: S01 shared responsibility, S12 hosting plans, S39 App Service patch/runtime boundaries, P03 groups, P04 plans; original questions are not Microsoft assessments. All learner-facing prose is maintained in nb.ts.

| Objective      | Mechanism taught                                                                   | Learner action                                                          | Observable verification                                                                                  |
| -------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| ST01 IaaS      | Provider hardware/virtualization versus customer guest OS/runtime/code             | Select VM, inspect OS, choose a legacy OS-dependent case and reason     | Responsibility selection and justified case response; changed OS-control requirement assessed separately |
| ST02 PaaS      | Managed built-in runtime, customer code/data/access, plan compute dependency       | Compare App Service; choose own-code/no-OS case; create actual plan/app | Accepted receipts, actual hosting edge, inferred app location; no runtime-health claim                   |
| ST03 SaaS      | Ready application/configuration, retained data/identity responsibilities           | Compare Microsoft365, choose ready collaboration use case               | Reasoned case and changed ready-service assessment; no arbitrary app hosting                             |
| ST04 Selection | Service model differs from deployment model, requirements and retained work decide | Compare layers, justify team choice, diagnose scope/location constraint | Three guided cases plus changed technical/decision criteria, first/help/retry distinctions               |

## Complete original teaching manuscript

### The abstraction is a division of work

An application needs physical compute, virtualization/isolation, an operating system, runtime libraries, code, configuration, identity controls and data. A runtime is the environment that executes code; an operating system manages processes, memory and devices. A service model describes which operational tasks a provider exposes to a customer and which it performs. Moving a task to a provider does not remove the technical layer. Deployment models such as public/private/hybrid describe the environment, not the same responsibility axis. A public-cloud service can expose IaaS or PaaS; calling something hybrid does not answer who patches its guest OS.

The responsibility explorer gives nine selectable layers, including explicit virtualization. Provider, customer and shared/service-dependent states are explained in words as well as colour. Inspecting a layer reveals mechanism and qualifications; changing the service model moves responsibilities without creating any infrastructure or learning award.

### IaaS: retain control of the guest environment

With Azure Virtual Machines, Microsoft operates physical facilities/servers and the virtualization boundary. The customer configures a guest OS, updates it, maintains its application runtime and deploys code. A VM is a virtual computer, not a ready functioning application. A legacy application that needs a specific OS configuration or driver may justify this control, but the team retains patch planning, backups, identity/access decisions and operational configuration. A VM's existence proves neither network reachability nor secure application operation. The simulator compares this model but cannot create a VM, disk or network.

Worked counterexample: if a custom web team specifically wants to stop maintaining the guest OS, moving the same system onto a VM does not meet that operational requirement. The hosting address changed, but the guest remains the customer's task. IaaS is not intrinsically better or cheaper; control is useful only when its retained work matches requirements.

### PaaS: deploy code onto a supported platform

In our built-in-runtime App Service example, Microsoft operates the platform's OS and provided runtime. The team supplies its web code, supported settings and access rules, and remains responsible for its data and application decisions. A platform still has limits: supported runtimes/configurations and service capabilities matter. Customer-supplied containers are a different boundary: maintaining what is inside the image remains customer work. Managed infrastructure is not a promise of correct application code, automatic scaling, security or availability.

An App Service plan describes the compute hosting an app, including OS and region. A web app references that plan; a resource group only groups management/lifecycle. Group metadata in Norway East can coexist with a plan/app in West Europe. The teaching model supports a Linux learning profile, not a real pricing tier, runtime deployment or SLA. It limits hosting to the same group for a tractable slice; Azure's broader capabilities are not falsely forbidden. A missing plan produces a real dependency rejection. A denied plan is not an existing host.

Worked example: a team retains custom web code but wants no guest-OS administration. A supported App Service approach fits that division of work. Create the lifecycle group, configure a plan in an allowed region and reference it from the app. Inspect separate membership and hosting edges. This records configuration, not a deployed or healthy application.

### SaaS: configure a ready service

Microsoft365 is a ready productivity-service example. The customer uses supported application functions and administers users, permissions, settings and data instead of maintaining the provider's application runtime. Its underlying servers still exist. The provider operating the service does not choose appropriate sharing/access for each organization. Customer application configuration and provider application operation are different tasks, which explains a shared/application-dependent layer.

A team needing ready email/collaboration can evaluate SaaS; a team needing to host arbitrary bespoke server code cannot assume that uploading that code into Microsoft365 is an equivalent hosting plan. Extensibility does not turn every SaaS service into a general PaaS runtime. No real Microsoft365 configuration or security guarantee is simulated.

### Choose against requirements, not a ranking

Compare three original cases: a legacy agent with OS-level requirements; a custom HTTP application whose team does not want guest-OS work; a team needing ready collaboration. Select both model and reasoning. Feedback explains the specific mismatch: OS control, custom-code platform or ready application. A correct model paired with an unrelated reason is incomplete evidence. Service models are not maturity levels that every team must climb. Existing investments, operational skills and actual supported capabilities matter; no invented Azure prices decide the result.

The practical requirement preserves the Chapter01 brief: App Sandbox, lifecycle group metadata in Norway East, custom web code and no guest-OS maintenance. The authored custom policy applies only to Web plan/app types in App Sandbox and permits West Europe. It does not restrict group metadata. After a rejected North Europe request, inspect type, scope, resource location, constraint and unchanged world; correct the resource configuration rather than moving the group's metadata. This is our custom bounded rule, not a universal built-in policy or a residency guarantee.

### Changed-context independent application

A separate team now needs a new platform under Shared Sandbox, metadata in Norway East and hosting in North Europe. It has custom HTTP code and wants no guest-OS maintenance. Additional changed requirements ask which approach fits OS-specific software and ready collaboration. The learner receives requirements and ordinary portal controls, not configuration steps. It must submit selected actual group/plan/app references, model/reason decisions and a causal location explanation. The same world is used, with a captured command boundary; pre-existing guided resources cannot satisfy new construction.

Submission evaluates the actual replayed technical prefix plus original answer IDs. It reports per-criterion outcomes, the immutable first submission and whether in-attempt theory/hints were used. Wrong responses receive technical explanations after submission. Subsequent attempts are retry practice; they cannot erase an earlier wrong/assisted first attempt or create XP. This is task-local evidence, not full Chapter01 transfer/promotion, general mastery, retained competence or certification readiness. Missing technical history is unverifiable, not successful.

## Portal-integrated sequence

Learn (full theory) → interactive responsibility/VM-versus-App-Service comparison → guided three-case decision → requirements → Resource groups/Create/review/commit → plan attempt/real rejection → operation/policy inspection → corrected plan → Web App/plan dependency → All resources → Architecture/typed links → exact module/topic return → changed-context challenge → explicit result.

Focused reading and a guided companion pane serve different space needs; core theory is not hidden in narrow tooltips. The six-unit cloud-computing manuscript, investigations and assessment remain available in a portal presentation using the original LearningStore. Direct experienced challenge entry creates no prerequisite completion. Journal/theory access during a new active challenge records assistance. Official reference links verify facts rather than replacing basic instruction.

## Planned human review

Ask a beginner to explain retained OS/data work and use Home/search to find the task. Ask an experienced Azure user to compare supported creation/list/detail actions with documented Portal conventions, diagnose the denied plan and inspect its hosting dependency. Record confusion and factual disagreements. Neither automated structure checks nor author review establishes SME approval or educational effectiveness.

## Reproducible review walk

1. Open `/` → `/portal`; the simulation badge is persistent. Search App Service and inspect service/resource/reference results; Escape clears search.
2. Open Learning workspace → Describe cloud service types. Read overview, IaaS, PaaS and SaaS including mechanism, worked example, misconception and limits. Compare all three examples; inspect OS, data, identity and the bounded network layer.
3. Open “Velg ut fra kravene”. Choose both model and reason for the OS-dependent agent, own-code/no-OS team and ready collaboration. Try an incorrect reason, read feedback, then correct it. This is guided practice.
4. Return to PaaS and open guided practice. Create `rg-guided` in App Sandbox, metadata Norway East. Review is not a committed command.
5. Create `plan-guided` in that group, Linux learning profile, North Europe. Explicit Create returns the real `policy-location-denied` receipt. Inspect its assignment scope/type/allowed region and unchanged revision/count. All resources contains no denied plan.
6. Correct the plan to West Europe, then create `app-guided` referencing it. Resource overview reports configuration only; OS/location derive from hosting, not group metadata. No code deployment/health/network claim.
7. Filter All resources; open Architecture Explorer. Select the membership and hosting relationships separately, request their explanations, and compare group metadata with plan/app location. Use the hierarchy lens for tenant/root/management; use list/zoom on narrow screens.
8. Return to the exact PaaS topic. Start Independent challenge. Read only the changed brief and normal Portal properties; opening theory/reference is recorded as assistance.
9. Create a new group in Shared Sandbox with Norway East metadata, a new plan in North Europe, and a web app referencing it. Submit actual resource IDs plus the changed OS/custom-code/ready-service and location-cause decisions. Inspect first-submission criteria/help status, reload and verify retained results. This is bounded task evidence, not professional mastery.
10. Revisit without rewards. A cancelled attempt remains cancelled and retries stay retries. Under Model limits, optionally export and explicitly restart the shared technical attempt; old module history remains, while deleted technical evidence becomes unverifiable. Never infer new success after reset.
11. Open the preserved Describe cloud computing module: all six original manuscripts, probes and changed assessment remain accessible without WebGL. The Portal journal reads the current unit without replaying any conversation or duplicating core theory.

The production Playwright suite automates the corresponding semantic/touch flows; traces/videos are local review artifacts, not evidence of human usability or educational effectiveness. An experienced reviewer should additionally compare the supported steps against the dated reference checklist.
