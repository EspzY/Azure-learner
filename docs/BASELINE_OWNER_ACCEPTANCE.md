# PR80 owner acceptance — production controls

10 November2026. PR80 remains Draft/unmerged at `c2bce3efa2ed4a56c96b594a6731662663e597d1`; main is `d87fa852ceda7d8a7bff8ddfc72027e8fd9d153c`. Quality135 completed1459Vitest,35Node,503curriculum and511/511browser cases without retry, with separate audit, complete aggregate and strict release. Those results approve a technical candidate, not a main merge or production deployment.

The earlier authenticated Vercel settings request returned403. GitHub's successful preview status does not disclose production settings. **All operator values below remain UNCONFIRMED.** No setting, variable, credential, domain or deployment is changed by this document.

Open the connected **azure-learner** project in the correct Vercel team. Inspect the actual labels shown in that project; dashboard navigation can change. Record values/screenshots without secret values or bypass tokens.

| Control               | Owner must inspect and record                                                                                                                                                | Decision before merge                                                                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project/repository    | Project name/ID and linked `EspzY/Azure-learner` repository under project Settings/Git                                                                                       | Confirm the inspected project is the one publishing AzureLab.                                                                                                                                             |
| Production Git branch | Production environment's tracked Git branch (Settings → Environments/Production or the Git production-branch control)                                                        | Record the actual branch. Do not infer `main` from defaults.                                                                                                                                              |
| Automatic deployment  | Whether pushes/merges to that branch automatically create production deployments; any deployment checks, ignored-build rules, promotion/manual-deploy controls               | Explain whether merging PR80 immediately starts production, whether it can precede CI, and the exact mechanism that separates the two approvals if separation is required.                                |
| Domains               | Settings → Domains and the active production deployment's assigned domains/aliases                                                                                           | List actual production domains and preview aliases separately, including redirects. A branch preview is not a production/recovery target.                                                                 |
| Deployment protection | Settings → Deployment Protection and any per-environment/domain exceptions: Authentication, password protection, trusted IPs or bypass mechanisms                            | Record which audiences can access production and preview. Never send passwords/bypass-token values.                                                                                                       |
| Current production    | Deployments → current Production deployment → source commit, deployment ID/URL, status and assigned aliases                                                                  | Identify what is currently served. Initial main's earlier failed Vercel status is not a known-good deployment.                                                                                            |
| Rollback              | A retained known-good deployment, whether Rollback/Instant Rollback is available for it, protection/domain behavior, environment compatibility and any external deploy hooks | Record target ID/SHA and an owner-approved recovery procedure. If no working production exists, state that explicitly and decide how an initial launch will be recovered. Do not execute a test rollback. |
| Environment scope     | Environment-variable **names and scopes only**, especially `LAB_DATABASE_URL`/`LAB_ORIGIN`, integrations and build/deploy hooks                                              | Verify that the merge will not activate an unintended database or expose secrets. No new database or variable changes are authorized. Build does not run migrations.                                      |

Owner return form:

```text
Project/repository confirmed:
Production Git branch:
Main merge automatically deploys? Exact controls/timing:
Production domains / preview aliases / redirects:
Protection and actual public audience per environment:
Current production deployment ID, SHA and status:
Known-good rollback target, or explicitly none:
Environment names/scopes and deploy hooks reviewed (no values):
Production deployment remains pending, or separate explicit approval:
Baseline merge approval (not assumed from this form):
```

If main automatically deploys, a merge approval cannot silently imply production approval. The owner must either explicitly approve both operations, or separately approve and verify a concrete arrangement that prevents unapproved production deployment. This agent will not change that arrangement.

After owner confirmation and explicit approval, re-read remote main/PR80 head, complete latest CI, actual preview identity and mergeability. Any changed head/base needs renewed applicable verification. Prefer one ordinary **Create a merge commit**, preserving the verified ancestry; do not individually squash the old stacked PRs. Retain the PR73/74 provenance refs as described in [FIRST_MAIN_BASELINE](FIRST_MAIN_BASELINE.md).

Record the eventual merge SHA, previous main, approved provider state and checks. A reviewed first-parent Git revert preserves history but can itself trigger deployment; provider rollback is separate and neither restores database/browser data. Proposed baseline tag remains `azurelab-baseline-2026-11-10`, only after approved merge/checks. No merge, tag, rollback, production configuration or deployment has been authorized or performed here.

Useful operator references: [Git deployments](https://vercel.com/docs/git), [environments](https://vercel.com/docs/deployments/environments), [domains](https://vercel.com/docs/domains), [deployment protection](https://vercel.com/docs/deployment-protection), [rollback](https://vercel.com/docs/instant-rollback). These are navigation references, not evidence of this project's configuration.
