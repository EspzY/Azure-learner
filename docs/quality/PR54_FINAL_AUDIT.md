# PR54 — Independent Final Audit

The active disposition is the bounded post-publication recheck at the end of
this report. It reviews the **2026-11-04T12:30:33.275Z** stamp, **37 snapshot
files**, fingerprint
`e982870361e3f7afe8916aaed472ac94d61a873aa1ffb5a104ee656d928f09cb`.
Two minor findings are corrected; no open scoped BLOCKER or MAJOR was identified.
The failed first CI is retained. Complete new-head CI/strict and anonymous
new-SHA Gate7 remain required. CC-03 remains P1 and CC-02 remains P2.

## Initial implementation review — retained history

**Disposition: scoped implementation review accepted. One minor contract defect
was corrected; no open BLOCKER or MAJOR was identified in this CC-01 change.**
This does not close delivery gates or approve wider rollout. CC-03 remains P1,
CC-02 remains P2, and the other original PR53 findings retain their dispositions.

Reviewer: `pr54_independent_final_audit`, kind `agent`, separate from
`pr54-cc01-implementation-author`. This is a code-aware engineering review,
not a human novice/SME study or a new blind assessment solve. No runtime or test
implementation was edited by this reviewer.

Base/local HEAD: `0e96c991d5e735e6b217bed15f20a3d5ef765c98`.
Branch: `codex/cc01-challenge-return-resume`.
The owner's narrow PR54 authorization supersedes the historical no-PR53 limit
only for this work; it authorizes no merge or production deployment.

Initial recorded review checkpoint: **2026-11-04T11:30:54.980Z**, after the initial
11:28:35.200Z stamp, fingerprint
`c732da8ce53d3cb4695686c4b498706d1ceacb9a5a4d34f574ae8f4fceeff2c0`.
Following the localization correction below, the bounded final recheck started
**2026-11-04T11:42:10Z**, after implementation finished
**2026-11-04T11:41:31.112Z**. Active reviewed fingerprint, **33 snapshot files**:

`5286f66bbae49a5be1975e8ee1baaaf0622a53c33fdba81bbcec3bef9181f2a9`.

## Concrete finding and correction

**PR54-A1 — minor, fixed: new interface text bypassed the locale contract.**
The initial `ChallengeReturn`, legacy challenge storage/history controls and
unknown-origin Portal label embedded new Norwegian strings in TSX. AGENTS
requires learner-facing copy in `src/content/nb.ts`. This was a real consistency
violation, with no demonstrated scoring, durability or accessibility consequence.
The implementation author moved the exact strings to an appended
`challengeReturnNb` export and changed the component references.

The final locale's complete original **1,488,942-byte prefix** independently
matches the Git base, SHA256
`00a8ad2ccbc85e24b79921b4f9ebc4707fbf88eb0204333a5ef2f3e2f3ff14f2`.
Only **1,184 interface-copy bytes** are appended. The bounded preservation test
checks base length/hash and exact `Buffer.equals` prefix equality; it does not
replace an exact comparison with a similarity or threshold assertion.
Post-correction author full check exited 0. This reviewer then executed the
production keyboard/short-height/reduced-motion/Axe journey on both selected
desktop and compact projects: **2 passed, no retry**. The fresh 1024×500 screenshot
is byte-identical to the inspected committed evidence candidate.

## Six-domain review

### Content and sources

No original teaching, source bank, answer wording, rubric or assessment premise
was rewritten. Independent base comparisons cover all preserved manuscript and
source paths plus the entire original locale prefix. The appended text explains
navigation, storage uncertainty and deliberate assistance; it introduces no new
Azure claims or completion promise. The original source review and PR53 findings
remain historical evidence, not a fresh blanket source/content approval.
In particular, the old OS-dependent-software premise remains the documented
CC-03 P1 and is not repaired by a better return link.

### Technical truth, origin binding and persistence

Independently inspected the actual base parser and Hub branch: the parser dropped
`resource-bridge`, causing Computing's `intro-request` fallback; the Hub separately
hardcoded Services/practice. These match the preserved before-reproduction and
full-SHA records. The patch adds only Computing's explicit topic to that parser.

The sidecar accepts exactly Computing/resource-bridge, Services/practice or null.
It binds the latest begin index to SHA256 of the canonical original save prefix,
including the original technical attempt and boundary. Pending, mismatched,
corrupt, unsupported or stale metadata yields unknown origin. It is navigation
evidence, not a signed identity claim, an assessment result or teaching authority.
Old attempts are not assigned an origin from a current URL or Course resume.

Start checks both current storage bases after the digest, uses Web Locks when
available, writes pending metadata, confirms the original begin, then confirms
metadata. Draft/aid/submit/abandon publish only after durable readback. Original
schema1/content1.0.0/`portal-transfer@1`, events, replay and evaluator are unchanged.

A separate actual Chromium probe interrupted the commit after durable begin but
before sidecar confirmation. The UI reported uncertainty; reload recovered
exactly one original active begin and an unknown origin, with no submission or
invented success. A partially durable event can therefore exist after an error;
explicit reload is the documented recovery, not rollback or automatic restart.
This is a bounded localStorage protocol, not a general transactional database.

### Visual and accessibility

Personally inspected the actual before challenge image, both final neutral
1440×900 and 1024×500 images, and the completed original six-criterion result.
The neutral view keeps a readable status, resume link and separate deliberate
teaching action in a small amount of content. No answer/debrief panel or fixed
footer is mounted there; the short view has no horizontal clipping.

Also inspected two independently captured neutral images. The post-correction
browser journey verified heading focus, Tab-to-resume, Enter, all three sizes
1440×900/1024×768/1024×500, reduced motion, no overflow and zero Axe violations.
The selected compact project remains a representative witness rather than a
claim of real-device or human screen-reader validation.

### Assessment immutability and assistance

The original assessment reducer/evaluator and all answer/rubric bytes remain
unchanged. No new completion, score, XP or receipt is derived from navigation.
The real Computing browser journey completed original RG/Plan/App operations
and submitted the same original six criteria, preserving an unassisted first.
Historical records, assisted retries and abandon retain their old events.

Prior answer-bearing Portal feedback is hidden during active unassisted work;
opening it explicitly records durable aid. In an additional two-tab probe,
a stale/conflicted view exposed no prior feedback; explicit reload exposed it
only after the stored history actually contained aid. Denied durable writes
withheld teaching and history. The narrow `only=core` guard correction includes
the old Portal context in the existing teaching preflight; it does not invent a
new assistance store or authorize from the navigation sidecar.

### Guidance, return, Hub and lab isolation

An independently executed real Computing lab covered the existing policy denial,
correction, hosting relation, explicit challenge Start, neutral return, draft,
Hub resume, reload and Back/Forward, then original submission and debrief.

A separate probe compared **all localStorage entries** before and after neutral
return: exact equality, including Course/visit data, assessment, technical World
and XP. Deliberately opening teaching appended exactly one original aid event;
technical/XP bytes stayed unchanged. A terminal known Computing challenge with
an unrelated active updated Benefits assessment was also tested: denied Benefits
aid kept Computing teaching unmounted and preserved the unaided Benefits log;
Hub retained that assessment's existing higher resume priority.

Known Computing and Services origins use the same read-only projection in Portal,
Hub and mission safety. Old unknown history stays neutral despite mutable URLs.
The explicit exclusions preserve newer PaaS practice, platform missions,
Benefits bridges, VM and Studio inspection contracts. The inherited targeted
Portal/Course/VM/Web/Policy receipt supports those unchanged routes. This review
does not claim to diagnose the pre-existing Compute help/Back flake.

### Regression, preservation and release honesty

Rebuilt the changed-path set independently from Git diff plus untracked files,
not merely the stored snapshot keys: all **33 hashes** and the active fingerprint
match; snapshot/base and structural validation report zero errors.
Independently compared **1,691 whole preserved paths** to base and manifest,
plus every byte of the old locale prefix: zero mismatches. Original PR53 reports,
ZIPs, locks, proof files, manuscripts, source data and technical engines remain
intact. This is preservation, not reinterpretation of the old findings.

Reviewed all three historical preservation-test amendments: only seven named
CC01 domain/guard paths use explicit old/new hashes, and the locale exception
requires its complete old prefix. Remaining old assertions remain. The changed
denied-write assertion now requires failure instead of optimistic success.
No worker/retry/timeout/skip setting or quality threshold was weakened.
Independent plan validation gives **358 = 324 desktop + 34 compact**, retaining
the inherited 351 executions and adding six desktop cases and one compact witness.

## Actual checks and evidence limits

- Inspected final author `full-check-localized.log` and exit-0 result: **651
  Vitest, 503 curriculum subset, 24 Node checks and production build passed**.
  The earlier seven new browser cases and sixteen inherited targeted cases are
  actual separate runs; they are not relabelled as the localized full profile.
  The author's localized correction run passed four selected cases without retry.
- This reviewer executed the real Computing lab and denied-aid/origin cases:
  **2 passed, no retry** on the initial production build; then the localized
  desktop/compact accessibility/neutral-return cases: **2 passed, no retry**.
- This reviewer executed **22 focused domain/preservation tests**, plan validation,
  the crash/stale/entire-storage probes and unrelated-assessment gate/Hub probe.
  Local probe records are retained under `/workspace/azurelab-pr54/` in this session.
  An initial ad-hoc harness incorrectly expected a debrief without a guided
  session; it was corrected to inspect the actual original teaching article,
  and the rerun passed. No product defect or test relaxation followed from that.
- Permanent evidence is in [the CC01 contract](../CC01_CHALLENGE_RETURN.md),
  [preservation](../reviews/evidence/cc01/preservation.json),
  [bounded change lock](../reviews/evidence/cc01/authorized-changes.json),
  [full check result](../reviews/evidence/cc01/full-check-result.json),
  [targeted results](../reviews/evidence/cc01/targeted-results.json), and
  [original findings](../reviews/CLOUD_CONCEPTS_FINDINGS.md).

Complete exact-head CI and its strict full-browser receipt remain **pending**,
as does an actual anonymous root/full-SHA/journey Gate7 on the delivered PR54
preview. A local server and the old public-base proof do not satisfy those gates.
The known Compute help/Back and Guidance/Axe document-title flakes remain
causally unresolved. Human Azure-SME, novice, screen-reader, psychometric and
measured learning-transfer validation remain **unperformed**. This review makes
no certification-readiness, broad pedagogy, merge or production approval claim.

Post-review validation: `docs:check` passed (152 Markdown files), `quality:check`
passed, formatting and `git diff --check` passed. Local strict `quality:release`
exited 1 **solely for the missing executed complete candidate browser profile**;
there was no stale fingerprint, base, preservation, review or other structural
error. The implementation stamp/snapshot and release payload outside `review`
were preserved.

## Bounded post-publication recheck — 4 November 2026

Reviewer remains `pr54_independent_final_audit`, kind `agent`, separate from the
implementation author. Recheck started **2026-11-04T12:31:52Z**, after the new
**2026-11-04T12:30:33.275Z** implementation-finished stamp. This supersedes the
then-current 33-file fingerprint above; the initial review remains history.
Local HEAD/public runtime at this recheck:
`6e065c785d386c25801bdecf9be15bb82369e65f`.
Original PR base remains `0e96c991d5e735e6b217bed15f20a3d5ef765c98`.

**PR54-A2 — minor, fixed: browser protocol did not await actual state.**
The first new journey could decide menu visibility before the Portal workspace
was ready and select fields before their state was observed. The missing
subscription reached actual Review validation, which correctly blocked Create.
A later independent helper could similarly operate with the wrong subscription.
The Services case also reloaded immediately after a Hub click, allowing reload
to abort the in-flight destination. Inherited Portal/Course tests navigated or
captured immediately after asynchronous durable Start, and an old Hub fixture
still expected a fabricated Services origin for a v1 record without a sidecar.
These are concrete test-protocol/expectation defects, not evidence of deleted
work or permission to weaken assistance or scoring.

The author corrected only the four browser files. The new journey follows the
actual Search action and waits for observed guide/form steps, workspace focus,
Shared Sandbox in actual Review, accepted resource names and the original
passed/unassisted result. Services now confirms its exact destination before
reload. Portal/Course await confirmed active status before leaving Start; the
Hub fixture now expects the exact neutral legacy route. All existing behavioral
assertions remain; no timeout, action deadline, retry, worker, skip, count or
production source byte changed. The old retry-to-abandon flow already waits for
an active-only control and retains its assertions.

The first complete CI run **41824040575**, head `6e065c…`, **failed** with
**352 passed, 1 flaky and 5 failed**. I compared the saved sanitized CI summary
with [the retained result](../reviews/evidence/cc01/initial-ci-result.json).
It is not a green candidate receipt. The separate existing Compute help/Back
and Guidance/Axe document-title issues remain causally unresolved; the old
Course fixture's missing confirmed-Start wait does not establish fixes for them.

The external native first case also exhausted its unchanged 30-second overall
budget. I inspected the final trace actions: seven actual receipts, resource and
answer selections, submission and first-result assertion had succeeded before
the final return expectation. No native timeout is relabelled as passed.
An initial native-menu trace was overwritten by output-directory reuse; its
text log survives, along with the initial standalone failure JSON/screenshots.
Later failures have separate directories. No recovery of that lost trace is
claimed. The four-case follow-up runner's historical `VERIFIED` label is explicitly
limited to its recorded cases in the
[readiness record](../reviews/evidence/cc01/preview-readiness.json); it is not a
complete native/full-CI or new-head Gate7 receipt. All eight artifact hashes in
that record independently match their actual local files.

### Independent actual external journey

I independently ran the current first function without a helper monkeypatch in
a fresh anonymous browser, through the ordinary root and visible Computing entry.
The displayed full SHA was `6e065c785d386c25801bdecf9be15bb82369e65f`, with no
cookies or page errors. The final explicit-postcondition run completed
**12:12:17.676Z–12:12:32.388Z** and retained 45 route records, screenshots, trace
and the synthetic local history in
`/workspace/azurelab-pr54/independent-manual-first-v2/`.
This was labelled standalone actual journey orchestration; it does not use or
claim a native suite deadline, retry success or complete CI receipt.

The journey performed the original guided denial/correction and RG/Plan/App
work, neutral active return, exact draft/Hub/history/reload, and final debrief.
I explicitly asserted first-result `data-correct=true`, exactly six criterion
items each marked successful, and unassisted text. Original stored begin is
boundary `portal-4`, attempt 1; submit is through `portal-7`; the intervening
history contains drafts and no aid/compare/guided event. The actual completed
image was personally inspected. A preliminary independent probe had an incorrect
English validation-text expectation; the real Norwegian validation was valid,
and the corrected probe passed. Its failed artifact was retained.

This establishes a representative journey on the named **old published SHA**.
The forthcoming child commit requires its own displayed-SHA/root verification.
It is not legitimate to reuse this observation as anonymous new-head Gate7.

### Bounded six-domain disposition and validation

- Content/source and assessment: all production source bytes match published
  `6e065c…`; original manuscripts, keys, rubrics and firsts remain as reviewed.
  The test explicitly checks the frozen result; it does not approve CC-03's
  unchanged premise or claim learning/SME validity.
- Technical and guidance: the new waits observe existing durable Start and
  workspace state. They neither authorize teaching nor issue commands. Actual
  invalid scope was rejected. Neutral return, aid and sidecar contracts remain
  the same. Exact hydration mechanics or a general product-input defect are
  not claimed diagnosed or fixed by this test-only correction.
- Visual/accessibility: there is no renderer or style change. Prior actual
  neutral/short-window/Axe evidence remains applicable; the independently
  inspected external completed view agrees with the original rubric result.
- Regression: independently rebuilt the actual diff/untracked snapshot, not
  merely the stored keys: **37 files**, exact active fingerprint, zero structural
  or snapshot/base errors. All source files are unchanged from `6e065c…`.
  The updated preservation manifest removes only the two explicitly amended
  Hub/Portal test paths from the prior whole-file set. Every other entry retains
  its earlier independently base-verified hash, and current bytes match all
  **1,689** entries. The complete original **1,488,942-byte locale prefix** also
  matches base exactly. Old proof artifacts and test settings remain intact.

Reviewed actual final-candidate full check result/log: **exit 0 at
12:29:01.174566Z**, 651 Vitest, 503 curriculum subset, 24 Node checks and production
build. The affected browser retest finished **6 passed, no retry**, including the
new Computing/Services and inherited Hub/Course/Portal desktop/compact cases.
Independent collection validation retains **358 = 324 desktop + 34 compact**.
The reviewed new test hash is
`faf1a883e5618d8c7383aff22b264767f5e8e2c6f4ded1ae5dcbb63186e82956`,
matching the independently executed current first-journey payload.

**Active disposition: PR54-A1 and PR54-A2 fixed; no open scoped BLOCKER/MAJOR.**
Complete full-358 CI/strict and actual anonymous Gate7 on the new delivered SHA
remain pending. The failed first CI is not replaced by targeted or standalone
passes. All previously stated human-validation, original product-finding and
merge/production limits remain.

Post-follow-up validation: `docs:check` and `quality:check` passed. Strict local
`quality:release` exited 1 only for the missing executed complete candidate
browser profile; no stale fingerprint, preservation, reviewer or other structural
error remained. The new implementation stamp, snapshot and every non-review
release field were preserved by this reviewer.
