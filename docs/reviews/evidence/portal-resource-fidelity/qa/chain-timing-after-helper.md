# Optimized context-reuse control: read-only addendum

The author's new29.4-second pass is **not a demonstrated timing improvement** over the prior29.5-second control. This investigator ran no native probe and changed no repository file.

The retained trace has461/461 recorded browser actions versus584/584 previously, a reduction of123 (about21%). Counts reduce by56 expectations,30 queryCount,14 clicks,11 evaluateExpression,10 isVisible, one waitForSelector and one selectOption. Both traces retain32 Laboratory requests and the same15 accepted operations through revision15.

Recorded Before Hooks→After Hooks interval is27.683s versus27.649s (+34ms); action span26.982s versus27.193s (−212ms). Remaining click median is102.426ms versus88.371ms; expectation median15.206ms versus12.881ms. Initial goto1.532s versus0.914s and initial browser-page creation366ms versus161ms are also different. Summed API response time1.303s versus0.994s. These are observed phase differences, not proof of CPU, source or renderer causality.

Fewer recorded calls are established. Elapsed improvement and timing-cause closure are not. No assertion-drop, scope-bypass or further optimization recommendation follows from this single control. `optimized-control/provenance.json`, `summary.sanitized.json` and `actions.sanitized.json` bind the private trace and selected metrics.
