# PR70 — actual failures, corrections and remaining uncertainty

Base: PR69 `41a187a4437eeea76749c61c94219a2577848645`. Its CI110 attempt1 was cancelled at the unchanged35-minute limit; attempt2 completed447 direct passes plus one Compute help/Back retry, with strict release success. The original error is `compute-hosting.spec.ts:310`, assisted feedback absent after Back. Its trace was referenced but not uploaded by the unchanged final-failure-only workflow. No trace inspection or causal repair is claimed. Earlier landing/resume, Compute/Axe/PG and CI-budget uncertainties remain open. New-model3.7 does not repair older3.5 malformed-input history.

## Focused independent peering review

A separate AI reviewer reproduced a MAJOR before final stamping: an unselected disabled app↔data peering could still supply positive VirtualNetwork default-rule membership while a different enabled route traversed the Firewall. Deleting the explicit source NSG rule produced a definite assessed Allow. The command-created one-direction and both-direction histories replayed exactly; this was a semantic false-certainty defect, not storage corruption.

Correction: check actually evaluated VirtualNetwork fields independently of route selection, using the actual packet address and disabled remote VNet range. Include local/reverse uncertainty in access checks; return undetermined/incomplete and clear unavailable match traces/Firewall conclusions. Do not guess Azure tag exclusions or change frozen evaluators. Literal custom decisions remain usable when they have no dependency on an unrelated disabled peering. The reviewer reran the original two cases plus nine adversarial read-only/replay challenges successfully; original report and evidence remain unchanged, with a separate correction report. This focused AI review is not the post-stamp final audit or human Azure approval.

## First native production run —6 failed /1 passed

All seven original results and actual failure traces are retained. No retry or bound change was used.

- Studio preserved viewport/workspace query parameters between `view` and `id`. The new test incorrectly required those parameters to be adjacent. It now asserts both exact parsed identities and keeps the actual Portal return-context behavior.
- The shared-table error correctly said “Virtual network-ruten må ligge innenfor adresserommet til alle tilknyttede VNets”. The new test expected an internal enum name. It now asserts the actual authoritative message, read-only rejected Review and unchanged World.
- Access Update correctly stored its actual immutable command ID in accessOrigin. The new test expected the former null value. It now asserts the actual command ID, unchanged Create-origin, opposite peering and forwarding flag.
- Explicit new-session creation correctly returned201. The new test expected200. It now checks201, actual replacement cookie/workspace and server rejection of the original pinned Save.
- Both accessibility failures were the same actual `link-in-text-block` violation: the subnet association receipt link had only color differentiation,2.68:1 against surrounding text. The free Laboratory's actual evidence link now has a scoped underline class. Axe is not disabled or narrowed.

The corrected seven-case native profile passed without retry in55.8s. It covers actual Portal writes/Studio effects, shared-table rejection, historical state, scope/session/revision conflicts and1440×900/1024×768/1024×500 keyboard/focus/Axe/reduced motion. The existing seven-case3.6 rule-remediation profile also passed without retry in1.0m; all original behavioral assertions remain. Its initial fixture explicitly chooses historical3.6, while its separate new-workspace fixture honestly expects current3.7 and retains original3.5 bytes/cancel/no-import/course assertions.

## Actual visual inspection and bounded refinement

The first passing short-window image showed repeated metadata pushing the comparison below the initial modal viewport. A topology-only grid declaration attempted two metadata pairs per row, but final screenshot inspection confirms the inherited label/value rows remain. No density improvement is credited; all pinned values and the comparison are reachable by the tested normal internal scroll. Enabled peering details are now an ordinary collapsed technical table after the primary policy outcome; an important undetermined caveat remains visible. No old3.6 modal layout or course design changes. The final affected production rebuild/browser verification is recorded separately, rather than attributed to the preceding run.

## Preservation control caught an adapter error

The first direct preservation run failed two assertions: an import replacement also changed a quoted source fragment inside the old preservation test. The actual-file guard detected it. The old file was restored to the exact base with only its first import adapted; the original assertion body is unchanged. Both new/old guard files then passed6/6. The test-only reader validates finite actual after-hashes before returning original before-bytes; a new direct filesystem guard independently checks every base file except the current quality record. It is not a runtime compatibility layer.

Initial targeted lint found six unused projection imports and an unnecessary initial value in a new concurrent test. These were removed without changing test behavior or thresholds. The first full check then caught an overbroad test-variable edit: a first scenario lost its initial state read when the concurrent scenario's unused initialization was removed. Its actual initial read was restored; no assertion was removed. All original diagnostics remain in evidence.

Final full check, stamped independent audit, complete exact-head455-case CI/strict and anonymous deployed-SHA/expected503 are distinct delivery results. A later green run does not close any older timing cause. Public functional Laboratory remains owner-deferred without a database; local PostgreSQL and isolated CI are the functional environments.

The next full check executed1082 Vitest cases:1081 passed and one historical3.6 fixture failed because `engine.models.filter(m => m !== laboratoryModel)` now included the newer3.7 among epochs expected to lack3.6 rule lifecycle. Its old-model range is pinned to the index of its original imported3.6 model; every original assertion and intended3.0–3.5 case remains. The new direct preservation guard checks this exact single-expression adaptation. No evaluator or older result changed. The first attempted edit stopped at a mismatched-source assertion without changing any file; no pass is credited to that attempt. Full candidate success still requires a new completed check.

## Final local candidate evidence

The completed full check exited0:1082Vitest/89files,24Node,503curriculum,57objectives/126facets, all lint/type/format/docs/assets/legacy/quality checks and the normal production build. Final production-browser verification with the actual local PostgreSQL passed7/7 in55.8s, zero retry, after the compact metadata and progressive disclosure refinement. The earlier historical3.6 seven-case profile passed7/7 in1.0m. Candidate plan is455=408desktop+47compact; collection is not a full execution claim. New profile adds only six desktop and one compact case to448 inherited controls. Original assertions and QA bounds remain. Exact raw results are retained under `docs/reviews/evidence/pr70/qa/`; complete CI and strict release are still separate publication gates.

## Commit packaging correction

A committed-byte comparison caught Git's root `text=auto eol=lf` normalizing eight PR70 raw evidence files (seven current Microsoft Markdown bodies and one full-check output). The actual reviewed working files and original source hashes were unchanged; the committed copies did not match. Before opening the PR, a rule scoped to `docs/reviews/evidence/pr70/**/*.raw` disables text conversion, preserving the original exact bytes. The direct base-file guard adds only this exact `.gitattributes` delta to its finite hash-pinned list. Domain/runtime/test assertions are unchanged. New guard checks, stamp and independent packaging review are required; no pass is credited to the failed comparison.
