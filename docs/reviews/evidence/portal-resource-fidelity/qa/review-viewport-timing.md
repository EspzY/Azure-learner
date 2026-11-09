# Integrated Review viewport failure: bounded read-only findings

This is the author's retained optimized desktop Review/keyboard/Axe viewport case. It failed the original30000ms whole-case limit and subsequently the30000ms context-teardown limit. No source, assertion, setting, browser probe or heavy job was changed/run by this investigator. Raw trace copy is private mode600, SHA256 `3c8333c216c475da3e7cd6b6d45708a355a868ac2f7cef52b653433523738299`.

**The trace never reaches Axe.** It reaches accepted PostgreSQL configuration Review and its native controls. This failure cannot be attributed to the child-service helper branch or an Axe scan.

| Step                                  |                    Browser action elapsed |        Test-runner API elapsed | Additional recorded evidence                                                                                                                        |
| ------------------------------------- | ----------------------------------------: | -----------------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Review heading focused assertion      |                                    4.535s |                         4.730s | Before-action DOM snapshot collectionTime3420.5ms; after snapshot156ms. No wrong-focus retry is logged.                                             |
| Initial screenshot                    |                                    7.713s |                         7.982s | Before snapshot collectionTime2419.2ms. Font loading wait itself is approximately44ms, not7seconds.                                                 |
| First setViewportSize                 |                                    1.551s |                         4.348s | Before/after snapshot collection30.2/87.6ms.                                                                                                        |
| Create.scrollIntoView                 | 4.315s recorded selector-resolution phase | 13.606s whole locator API call | Before snapshot234.6ms; actual visible Create locator resolves. Remaining handle-scroll time is not a separate public browser action in this trace. |
| Following Create visibility assertion |                                    1.365s |                         1.623s | Completes; no absent Create error.                                                                                                                  |

The test timeout starts teardown while these calls continue. Later screenshot/viewport/scroll calls are recorded during teardown; none supplies pass credit. Context teardown then also exceeds its limit. The browser trace ends during a later screenshot; the test-runner trace continues further.

The trace quantifies multi-second **snapshot collection wall time** in two important steps. It does not distinguish DOM serialization work from browser/host scheduling or establish a particular CSS/CPU cause. It also shows latency across screenshot, viewport and scroll operations, rather than a single rejected Review or missing selector. No production or test-setting fix is proposed from this bounded trace alone.

`test.trace.last.sanitized.json` and `1-trace.trace.last.sanitized.json` contain selected late call timings, `long-action-logs.sanitized.json` contains the relevant action logs and `snapshot-collection.sanitized.json` contains actual snapshot collection metadata. Original error context/PNG/ZIP and provenance are private outside the repository.
