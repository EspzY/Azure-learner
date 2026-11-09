# Bifrost foundation and landing · author QA

9 November 2026. This is actual implementation/author evidence, not the separate Independent Final Audit. Base is `249833f7cb7ea41d3e411444ec3c4f83805d3a5f`; foundation commit is `40b8d22`, with the coordinated font performance follow-up `7e6fe1b`. All captures use the actual local production build at port3004 or the supplied HTML opened directly, as labeled. They do not establish an external deployed SHA or complete candidate CI.

The product landing now uses the supplied Purple light/dark values, exact full inline landing logo,44px/900 heading request, three balanced190px course cards,22px padding,8px radius and18px gap. AZ-900 remains one whole link to `/learn`; AZ-104/AZ-305 remain planned nonlinks. The Laboratory is one broad whole link to `/labs/laboratory`. Existing current description, read-only status projection and Course Hub resume ownership remain unchanged. The existing scale cue starts with immediate routing; no140ms navigation hold remains. Hover uses translateY(-3px),160ms violet border/depth/arrow; reduced motion removes the cue.

## Actual production checks

- Production build exits0; scoped ESLint/Prettier and standalone TypeScript pass.27 foundation/status/source-token/SVG/license unit checks pass.
- The final WOFF2 production batch passes all seven new browser cases plus the inherited responsive/Axe case:8/8,33.1seconds,0retries. Both themes fit1920×1080,1440×900,1024×768,1024×500 and800×700 without horizontal overflow or unnecessary scrolling.320px reflow keeps every choice reachable. Desktop and reflow Axe report0 violations.
- Native Chromium extension `chrome.tabs.setZoom/getZoom` confirms125%/200% in **both** themes, readable focused course/Laboratory choices, no horizontal overflow and Axe0. The captures use native browser surfaces; no CSS zoom or page-scale proxy is called browser zoom.
- Pre-hydration SSR with all application bundles blocked retains the remembered light/dark theme against an opposite system preference. Blocking local font requests retains readable text, native links and Axe0. No runtime third-party font request exists.
- System default performs no write; light/dark/system persist only to the dedicated visual key. Reload, cross-tab and system changes work. Blocked visual storage preserves usable in-memory appearance and one honest inline message. The browser tests compare all other AzureLab local-storage bytes unchanged.
- Actual original course Portal and explicitly started temporary free Portal retain identical computed root/header/main/input/button/select font, foreground/background, border and native control scheme under light/dark changes, even when placed beneath a learning wrapper. Both remain Segoe UI and light Azure blue/white. No Portal source/CSS or technical authority changes.
- Three affected inherited browser cases also pass,20.0seconds,0retries: actual root/read-only navigation, responsive status/keyboard/Axe fixture, and compact whole-link/native-modifier/reduced-motion/free-Lab journey. The only inherited test edit adds `.bifrost-learning` to its isolated status fixture; all assertions and settings remain unchanged.

The initial five-case production batch had3passes/2failures. Both failures were the same real Axe landmark issue: the new appearance select was outside any landmark in a generic div. The landing wrapper is now a semantic header. The [original red output](evidence/initial-landmark-error.md) is retained; the later7/7 result follows the actual correction. One added redundant unit assertion used an invalid TypeScript string argument to `matchAll`; the build rejected it, the redundant assertion was removed, and exact geometry/unique-reference checks and the production build pass.

## Reference and current actual images

| Surface                                                      | Supplied reference / production evidence                                                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Actual supplied light HTML                                   | [Reference light](evidence/owner-demo-light.png)                                                                                      |
| Actual supplied dark HTML                                    | [Reference dark](evidence/owner-demo-dark.png)                                                                                        |
| Light production1440×900                                     | [Landing light](evidence/bifrost-light-1440-900.png)                                                                                  |
| Dark production1440×900                                      | [Landing dark](evidence/bifrost-dark-1440-900.png)                                                                                    |
| Short desktop1024×500                                        | [Light](evidence/bifrost-light-1024-500.png) · [Dark](evidence/bifrost-dark-1024-500.png)                                             |
| Compact desktop800×700                                       | [Light](evidence/bifrost-light-800-700.png) · [Dark](evidence/bifrost-dark-800-700.png)                                               |
| Actual original operating Portal under dark learning wrapper | [Course mode](evidence/bifrost-boundary-course.png) · [Free mode](evidence/bifrost-boundary-free.png)                                 |
| Native125%                                                   | [Light](evidence/bifrost-native-zoom-light-1.25.png) · [Dark](evidence/bifrost-native-zoom-dark-1.25.png)                             |
| Native200% with natural scrolling                            | [Light](evidence/bifrost-native-zoom-light-2.png) · [Dark](evidence/bifrost-native-zoom-dark-2.png)                                   |
| Fonts and hydration blocked                                  | [Light](evidence/bifrost-before-hydration-fonts-blocked-light.png) · [Dark](evidence/bifrost-before-hydration-fonts-blocked-dark.png) |

[Measurements and actual rendered platform font](evidence/production-measurements.json) confirm Open Sans (not Satoshi),190px ordinary cards and natural160px short-window cards. [Visual provenance](evidence/visual-provenance.json) binds final screenshot hashes to the actual production presentation sources. The official unmodified Latin variable WOFF2 is48,320bytes,90.9% less than the initial532,636-byte TTF; its license and family are unchanged.

The source token/geometry snapshot is [hash-bound to the actual attachment](bifrost-demo-reference.json); [official-source/license provenance](bifrost-source-provenance.json) records what was read and what may be redistributed. The reference's demonstration bar, explanatory sections and decorative outer panel are not product navigation. The product uses the same restrained radial background over its full landing and the existing Lucide icon package for equivalent course/Laboratory symbols.

**Typography limit:** local Open Sans is the actual cleared font. Satoshi is requested only if already installed; proprietary FFL2.0 forbids repository redistribution, so it is not vendored and the page is not claimed to match Satoshi exactly. No font is renamed or falsely represented. No SavvyShark asset changes exist.

Root coordination still owns fullcheck, raw whole-base/hash-bound preservation, the fresh stamp, separate six-domain audit, Draft publication, complete exact-head CI/strict and actual anonymous preview verification. The unchanged468-case baseline and its assertions/workers/retries/timeouts/skips remain mandatory. Historical timing uncertainties remain open. Human UX/screen-reader/Azure-SME/learning validation is unperformed. No merge or production deployment is authorized.
