# Dependency follow-up — PR45 inspection, 2 November2026

Navigation scope does not include dependency upgrades. Actual `npm audit --json` reports12moderate package entries,0high/critical. `npm audit --omit=dev --json` reports0vulnerabilities. All12entries stem from [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), minimatch globparts amplification/denial of service, plus propagated lint-tool dependencies; they are not12independent runtime vulnerabilities.

| Package                                | Installed version | Dependency status | Reported via                                                                                                                        |
| -------------------------------------- | ----------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `@eslint-community/eslint-utils`       | 4.10.1            | transitive dev    | eslint                                                                                                                              |
| `@eslint/config-array`                 | 0.23.5            | transitive dev    | minimatch                                                                                                                           |
| `@eslint/js`                           | 10.0.1            | direct dev        | eslint                                                                                                                              |
| `@typescript-eslint/eslint-plugin`     | 8.72.0            | transitive dev    | @typescript-eslint/parser, @typescript-eslint/type-utils, @typescript-eslint/utils, eslint                                          |
| `@typescript-eslint/parser`            | 8.72.0            | transitive dev    | @typescript-eslint/typescript-estree, eslint                                                                                        |
| `@typescript-eslint/type-utils`        | 8.72.0            | transitive dev    | @typescript-eslint/typescript-estree, @typescript-eslint/utils, eslint                                                              |
| `@typescript-eslint/typescript-estree` | 8.72.0            | transitive dev    | minimatch                                                                                                                           |
| `@typescript-eslint/utils`             | 8.72.0            | transitive dev    | @eslint-community/eslint-utils, @typescript-eslint/typescript-estree, eslint                                                        |
| `eslint`                               | 10.13.0           | direct dev        | @eslint-community/eslint-utils, @eslint/config-array, minimatch                                                                     |
| `eslint-config-prettier`               | 10.1.8            | direct dev        | eslint                                                                                                                              |
| `minimatch`                            | 10.2.6            | transitive dev    | minimatch                                                                                                                           |
| `typescript-eslint`                    | 8.72.0            | direct dev        | @typescript-eslint/eslint-plugin, @typescript-eslint/parser, @typescript-eslint/typescript-estree, @typescript-eslint/utils, eslint |

Actual `npm ls minimatch --all` chains:

- AzureLab → eslint10.13.0 → minimatch10.2.6.
- AzureLab → eslint10.13.0 → @eslint/config-array0.23.5 → minimatch10.2.6.
- AzureLab → typescript-eslint8.72.0 → @typescript-eslint/typescript-estree8.72.0 → minimatch10.2.6.

**Available root correction:** advisory fixed version is minimatch11.0.1; registry metadata confirms Node18/20/≥22 support. It is outside the currently declared10.x ranges of the three consumers. npm's automatic proposed changes include eslint4.0.0, typescript-eslint8.14.0 and eslint-config-prettier6.15.0; these are incompatible/obsolete toolchain substitutions, not an appropriate force-fix for this project.

**Actual relevance and follow-up:** the affected package matches glob patterns during repository linting/configuration analysis. No production dependency or application request path to this code was found in this inspection. Hostile patterns or untrusted tooling/configuration can still cause developer/CI availability problems; production audit0 does not prove universal safety. Track as separate technical maintenance: validate compatible upstream lint releases adopting the corrected minimatch, or evaluate a narrowly reviewed override with lint/config regression evidence. Do not blindly force a major dependency change or disable audit. No high/critical or demonstrated directly exploitable application issue was found; escalate if that evidence changes.

Dependencies/lockfile, Node/browser pins and existing `npm audit --audit-level=high` threshold remain unchanged. Issue remains open; this document records investigation, not remediation. Recheck current advisory/ranges during the separate maintenance delivery.
