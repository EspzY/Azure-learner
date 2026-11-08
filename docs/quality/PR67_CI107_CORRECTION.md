# PR67 CI107 — failed result and bounded correction

The first complete [Quality107](https://github.com/EspzY/Azure-learner/actions/runs/42473433589) tested head `aa61600822ccdd998ea001b834b58b16dc332225` (synthetic merge747912f08e8ffcccc4a42af5bd083f7abfacc6e3 has exactly the same tree). Full check967Vitest/24Node, PostgreSQL setup and dependency high-threshold passed. Browser: **431 passed +2 flaky +1 failed /434,24.1min**. Strict release was skipped, not passed.

The failed inherited compact Compute case and its desktop flaky execution waited for Networking while an actual `aside.portal-nav.mobile-open` intercepted pointer events. The second flaky case was the new overlapping-hub extra-tab test: missing Virtual Networks link during the helper's visibility decision. All original failure assertions/settings are retained.

## Available and unavailable evidence

The decoded original job log is retained under evidence/pr67/ci107. Artifact13615640165 is587007468bytes; GitHub records digest `2bc58c32fc7fc4c28eb6131c6c6c7b0d5ea9889b9357c4380d3017ebc3457b72`. The connector rejects archives above512MiB. The legitimately authenticated CLI redirect to its backing Blob was then blocked by the environment's CONNECT policy. No proxy bypass or access change was attempted. The full CI trace was **not** retrieved or inspected. The source metadata/digest is not a locally verified ZIP hash.

Read-only instrumented copies of the exact original bodies ran locally:5/5compact Compute and3/3Firewall passed. Actual local trace DOM observations show the real breakpoint window: width1024, native media=true, desktop `aria-expanded=true`, no `mobile-open`, hidden navigation, followed by narrow React state. These green runs do not themselves close either CI failure. The extra editor was closed before afterEach; only surviving main-page observer notes were attached. Do not claim editor DOM notes were collected or that the exact original new-tab cause is proven.

## Proven vulnerability and correction

The header used a cached React breakpoint in its click callback. A deterministic native regression delays only delivery of real media change events, keeping CSS/native matchMedia real. At compact width, the old callback acted on the previous desktop mode and failed to open the drawer. The retained red trace confirms that product vulnerability. The same test explicitly recreates the old helper decision ordering: read desktop-expanded state after CSS resize, deliver the real media update, then click the toggle and observe the newly opened overlay. This establishes the vulnerable class, not the inaccessible CI trace's exact interleaving.

The free Laboratory header now reads actual matchMedia at click and uses functional state updates. Escape idempotently dismisses its menu, matching the existing course Portal behavior. The shared Laboratory test helper waits for the visible Portal and completion of visible initial loading; compact close presses Escape and asserts both the actual mobile-open class and visible overlay are gone. No force click, first selector, fixed delay, timeout/retry/worker/skip change or removed assertion is used. Course Portal, shared CSS/presentation and all technical engines/receipts remain unchanged.

The new regression performs a real explicit session Start and compares authoritative World/events and course-storage bytes before/after menu actions. No World, receipt or positive state is injected. Four affected desktop/compact controls passed59.9s,0retry; expanded deterministic decision-order check passed1/1,6.1s. Full mandatory check, renewed stamp/independent follow-up and new exact-head completeCI/strict remain required. Original extra-tab event timing, older VM-status/Compute/Axe uncertainties and source-provenance limits stay explicit.
