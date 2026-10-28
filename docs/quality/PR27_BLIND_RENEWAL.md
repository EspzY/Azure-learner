# PR27 blinded Compute assessment renewal

Reviewer: separate agent `/root/pr27_blind_renewal`, 2026-10-28. Scope: the 14 Compute independent items, their accepted decision/reason relationships and alternative feedback, compared with `computeNb` teaching and guided scenarios. This is a content correction review before the renewed production suite and implementation stamp. It does **not** approve Gate 6, the final release fingerprint, browser behavior, or delivery.

## Outcome

No open BLOCKER or MAJOR remains in this scoped content review after the corrections below. All 15 independently defensible pairs across 14 items agree with the implementation; cp12 has two valid candidate-specific pairs. A correct decision with another reason is insufficient. The bank supports bounded observations of these situations, not validated psychometrics, exam readiness or measured learning transfer. Human Azure-SME, novice/IT UX, screen-reader and transfer reviews remain unperformed.

## Blinding and evidence sequence

The first and only initial file read was `.artifacts/pr27-blind-items-renewed.json`, containing prompts, premises, decisions and reasons without keys or feedback. All independent answers, ambiguities and cues were locked using `apply_patch` in the ignored `.artifacts/pr27-blind-renewal-locked.txt` before reading repository documentation, source, accepted pairs, feedback or guided scenarios. No previous reviewer keys were supplied.

Only after that lock did the reviewer read [the evaluator/key](../../src/domain/curriculum/compute-items.ts), `computeItemsNb`, `computeNb` theory/models/missions, [the Compute contract](../COMPUTE_HOSTING.md), and the permanent quality/source/release contracts. The locked record remains intact; its mistaken aggregate position tally has an explicitly appended arithmetic erratum. No item-level answer changed. Correct frequencies, including both cp12 pairs, are D1/D2/D3 = 6/5/4 and R1/R2/R3 = 5/4/6; these small counts do not establish psychometric balance.

The author then corrected cp06's object graph and the specific cueing clauses identified below. Those final edits were reviewed with knowledge of the initial locked answers; they are a disclosed correction review, not a second blinded solve.

## Findings and disposition

### B1 — source uncertainty in the initial cp06 AVD object graph; resolved by removal

The initial item placed two RemoteApp application groups from one host pool in two different workspaces. The reviewer independently flagged a possible same-pool/workspace restriction before reading the key. Current primary [AVD terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) documents multiple RemoteApp groups per pooled host pool and one workspace per application group. The current [deployment instructions](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop), updated 2026-09-30, document compatible deployment scopes and adding unassigned application groups; they did not resolve the exact initial restriction. Old Microsoft URLs redirect to current material. Historical community reports were insufficient to establish a current authoritative restriction.

The original topology is therefore **not reported as a confirmed Azure defect**. The source uncertainty was removed instead: [nb.ts](../../src/content/nb.ts) lines 9179–9193 now describes two existing pooled host pools with compatible common image, separate RemoteApp groups and explicit compatible deployment scope/location. Each group's registration and user assignment remain separate. Moving Innkjøp's registration from Pilot to Kontor while retaining its own targeted assignment is defensible under that graph. A shared image supplies no shared publication/access relationship. No claim of a real session or authentication is introduced. The decision/reason pair remains D1/R3.

### B2 — MAJOR, self-disqualifying distractor clauses; fixed and re-reviewed

The initial wording repeatedly told the learner that a distractor should override an explicit requirement or prioritize an absent one. Examples included cp02's startup priority despite no latency requirement (line 9059), cp07's isolation priority over the explicit app/sharing need (9225), cp08's OS-first action without an OS finding (9256), cp10's overruling the responsibility boundary without agreement (9324), and cp12's introducing Kubernetes despite no control need (9389). These clauses let a reader reject reasons by their argumentative form without applying the relevant compute mechanism. This was a substantive assessment defect, not an accepted finite-bank limitation.

The initial corrections removed those clauses, and the reviewer identified the same remaining pattern in cp13 at lines 9421/9423. Both were then corrected. The final source now proposes positive competing hypotheses: a warm continuous process, dedicated-host isolation, OS memory fixes, consolidated Kubernetes rollout/networking, declarative Kubernetes Jobs, aggregate capacity and co-location overhead. The learner must assess whether those real properties or causal hypotheses address the actual constraints. The rejection explanation remains in post-submit feedback. Additional cp09 line 9286 and cp11 line 9357 wording removes an explicit region contradiction and an option that announced its own scope disqualification.

Re-reviewed final evidence: `nb.ts` lines 9059, 9225, 9256, 9286, 9324, 9357, 9389, 9421 and 9423. All retain the original accepted relationships. Their properties are insufficient for the stated task for concrete technical/operational reasons; they do not depend on declaring themselves forbidden. No remaining comparable systematic cue was found in the current 14-item set. Some individual misconceptions remain simple, especially OS/kernel versus files and command identity versus resource role; difficulty is not evidence of validity in either direction.

## Locked pairs and rationale check

Positions are 1-based. Item text starts at the listed `src/content/nb.ts` line. The matching 0-based implementation is `src/domain/curriculum/compute-items.ts` lines 20–59.

| Item | Text line | Defensible pair(s) | Decisive relationship                                                                                                               |
| ---- | --------: | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| cp01 |      9012 | D3/R1              | Required Linux guest/kernel administration selects the VM boundary; a Windows Hyper-V container does not supply that guest.         |
| cp02 |      9045 | D1/R3              | Message-triggered code and retained code/data/access/plan duties fit the requested event model and low infrastructure effort.       |
| cp03 |      9078 | D2/R1              | Preserved external results do not establish a compatible execution host for the unchanged Linux image.                              |
| cp04 |      9111 | D2/R3              | Flexible fleet management and configured scaling address variable count without requiring identical instance types.                 |
| cp05 |      9143 | D3/R2              | Existing VM1/VM6 share UD0; placing an app copy on observed VM2/UD1 addresses this maintenance event. FD is distinct.               |
| cp06 |      9176 | D1/R3              | Correct application-group registration in the used workspace is distinct from common image, host capacity and user assignment.      |
| cp07 |      9209 | D2/R1              | Fixed personal desktop assignment and shared pooled RemoteApp delivery serve two distinct requirements.                             |
| cp08 |      9242 | D3/R2              | Known RAM demand exceeds RAM; reduce concurrent demand or plan adequate RAM, then validate. Spare disk is not RAM.                  |
| cp09 |      9275 | D1/R3              | A fixed region-B workload needs region/subscription-compatible NIC/network references; RG metadata cannot relocate them.            |
| cp10 |      9308 | D2/R1              | Independent components retain their control and ownership constraints despite sharing an image delivery format.                     |
| cp11 |      9341 | D1/R2              | Reuse the verified compatible concrete App Service plan; general technical eligibility does not grant a new hosting mandate.        |
| cp12 |      9374 | D1/R3; D3/R1       | Manual ACA Job execution and an appropriately configured finite ACI group both fit, with their own distinct lifecycle explanations. |
| cp13 |      9407 | D1/R2              | Healthy total capacity is 30, but the only used path offers 10; distribute work to existing capacity before expansion.              |
| cp14 |      9440 | D2/R3              | Accepted A's IDs remain A's evidence; rejected B with no changes cannot create vm-new or reattribute A's children.                  |

No additional technically defensible pair was found under the supplied premises. In particular, cp12's crossed reasons are not interchangeable: ACI's group/restart policy and ACA's reusable Job/separate execution are different customer-facing objects. A proposed AKS Standard platform conflicts with the declared operating capacity. Generic truths about an option do not by themselves justify that option for the given task.

The reviewer directly executed `evaluateCompute` using Node's TypeScript stripping with an expected table copied from the blinded item-by-item lock, rather than deriving expectations from `accepted`. All 224 combinations of decisions/reasons in `{0,1,2,null}` matched: 15 accepted pairs, 30 correct-decision/wrong-reason combinations rejected, and no incomplete pair passed. The relation check at evaluator line 70 requires equality of both values. This proof verifies pair behavior, not the instructional quality of the strings or browser assistance shielding.

## Changed independent decision structures

The comparison used the actual guided mission situations/steps at `nb.ts` lines 8537–8616 and the relevant model/theory examples, not item titles alone.

| Independent cases | Changed constraint or inference relative to guided work                                                                                                                                                                                                                                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cp01–cp03         | Kernel-control requirement, event-code workload, and compatibility diagnosis with already-preserved results differ from the guided ephemeral/external-data recreate contrast.                                                                                                                                                                              |
| cp04–cp05         | Mixed-instance fleet/scaling choice and app placement on already-observed UDs differ from the guided zonal-failure/capacity-rule comparisons. The learner does not choose a VM's assigned UD.                                                                                                                                                              |
| cp06–cp07         | Compare two publication/assignment graphs and allocate two user groups with fixed-host versus shared-app requirements, rather than only toggling one publication chain.                                                                                                                                                                                    |
| cp08–cp09         | Diagnose a RAM limitation and a fixed-region network-reference conflict rather than reproduce the guided Windows/standard/64GiB/same-subnet build.                                                                                                                                                                                                         |
| cp10–cp12         | Component decomposition with separate owners, mandatory reuse of a concrete existing plan, and finite export with two acceptable lifecycle-specific choices differ from the guided sequential HTTP-image → Kubernetes-control requirement change.                                                                                                          |
| cp13              | Existing healthy total capacity is sufficient while the used route is insufficient; the task prioritizes a remedy with failure/data causes excluded instead of selecting more compute or a fault-placement mechanism. Primary-only routing is explicitly taught in mission C at line 8584, so this is bounded near transfer, not evidence of far transfer. |
| cp14              | Conflicting new/old command outcomes and resource identities require provenance analysis rather than the guided single new accepted build/inspection sequence.                                                                                                                                                                                             |

The six especially close cases cp03/cp06/cp10/cp11/cp13/cp14 now require distinct diagnosis, comparison, decomposition, constrained reuse or provenance decisions. This is an authored structural judgment. It does not establish that learners transfer the skill, or convert guided work into independent credit.

## Primary checks and limits

The reviewer independently checked the niche claims against these current Microsoft primary pages on 2026-10-28:

- [VMSS orchestration modes](https://learn.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes): Flexible supports identical/mixed VM types, standard VM APIs and metrics-based scaling, subject to documented constraints. Supports cp04's qualified choice.
- [AVD terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) and [AVD deployment](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop): personal/pooled and desktop/RemoteApp distinctions, separate group/workspace and user relationships, compatible deployment scope. Supports the corrected cp06 graph and cp07; does not prove a working session.
- [Container Apps Jobs](https://learn.microsoft.com/en-us/azure/container-apps/jobs): finite jobs, manual executions and the definition/execution distinction. Supports cp12 D1/R3.
- [ACI restart policies](https://learn.microsoft.com/en-us/azure/container-instances/container-instances-restart-policy): appropriate policies allow finite group tasks to stop; results can be written externally. `Never` is not an unconditional no-restart guarantee after nonzero exit. Supports the qualified cp12 D3/R1.
- [Create/change/delete NICs](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface): NIC/VNet and attached VM location/subscription constraints; RGs may differ. Supports cp09 without importing AzureLab's narrower local same-group rule into Azure generally.

Public main text was available despite generic authorization banners. No Azure account, resource, authentication flow or runtime was exercised. An unfiltered exact-phrase search returned unsolicited exam-bank snippets while investigating cp06; those results were excluded, not opened, used or cited. No protected assessment or copied question bank informed the decisions or corrections.

## Reviewed source snapshot and handoff

Working-tree HEAD was the PR26 base `7e35e1d38e956573e2004fc891c1ef1e4b643625`; the source under review was not yet committed. After the final cp13 correction, raw SHA-256 values were:

- `src/content/nb.ts`: `a9b8fd7cae31c8aa72c42980b5c8fdbcc2f65bdfee10d8ea3b964d3a43e57d3b`.
- `src/domain/curriculum/compute-items.ts`: `dee0b98d76722ac3c673007686568db346a83070783797deb1013c73afdaf49e`.

These two raw-file hashes identify this content review only. The separate main reviewer must verify the final normalized implementation fingerprint after the renewed full suite/build, actual rendered inspection and final `quality:stamp`, including any subsequent changes. The reviewer changed only this report and the ignored lock record, made no implementation edits or commits, and spawned no agents. Full release gates and human review statuses cannot be inferred from the 224 evaluator comparisons or this report.

Report validation: `node scripts/docs-check.mjs` passed with 85 Markdown files and valid required/local links; `npx --no-install prettier --check docs/quality/PR27_BLIND_RENEWAL.md` passed. The initial Prettier `--write` attempt returned EPERM; formatting was applied with `apply_patch` from Prettier's read-only formatted output before the successful check. There is no remaining report-formatting blocker.
