# PaaS practical refinement

## Environment variables presentation — 2026-10-26

The existing app resource menu now opens Environment variables → App settings as a compact Name/Value list. Edit opens a native accessible editor for one allowlisted key. Save draft changes in-memory form values only; Cancel discards that editor draft. The separate page Apply sends the unchanged SetAppSettings command. Leaving/reloading before Apply does not persist the draft. Values are harmless teaching enums, visibly shown rather than pretending to implement secret masking/security. No restart, arbitrary key, runtime behavior or new award. Existing persisted settings, receipt and independent predicates remain authoritative. [Source and fidelity comparison](PORTAL_REFERENCE_FIDELITY.md).

Reviewed 2026-10-25: [configure App settings](https://learn.microsoft.com/en-us/azure/app-service/configure-common), [hosting plans](https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans), [OS/runtime patch boundaries](https://learn.microsoft.com/en-us/azure/app-service/overview-patch-os-runtime).

The previous plan/app creation is retained. New operation: SetAppSettings for an existing supported Web App with a valid hosting plan. Allowlisted fictional application settings APP_ENVIRONMENT (development/staging/production) and CATALOG_MODE (standard/read-only) are harmless training values. They are not built-in Azure configuration switches. Customer code would need to read them. No secrets, free-form scripts, connection strings or code execution.

In the familiar app resource menu, Environment variables → App settings → explicit Apply produces an updated receipt and persisted configuration. Invalid values/app/dependency or stale revision leave state unchanged. Settings do not become a separate ARM resource. Accepted values appear in properties and history after reload. In real App Service, settings changes can restart the app and inject environment variables; this laboratory executes neither restart nor runtime behavior.

Flow: course PaaS → prior Web lab when dependencies are missing → inspect existing real app → edit → Apply → compare actual result → live hosting relation → exact course return. Reuse is guided practice, not new independent evidence. Policy denial/correction remains the existing bounded Web-location rule. A settings update does not bypass it or claim healthy hosting.

Changed independent task uses newly configured app/plan after the boundary and production/read-only settings. The learner explains platform OS versus retained customer code/data/access. Immutable first submissions retain help/retry status and actual command/resource references. A successfully configured application is not a tested working application.

Independent matching selects an eligible newly created plan/app even when an earlier partial configuration remains in the same attempt. Applying settings to a new app on an old plan cannot satisfy the new-plan requirement. The guided inspector displays actual hosting separately from the missing settings change, and preserves the assigned independent requirements after help.
