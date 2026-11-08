# Topology Remediation Part B — Laboratory3.7

Base: PR69 `41a187a4437eeea76749c61c94219a2577848645`. This is a new, explicit workspace model; existing3.0–3.6 workspaces, executors, receipts and SQL001–007 remain frozen. No import or automatic upgrade.

## Versioned implementation contract

- `UpdateRoute` validates a complete destination/next-hop replacement against the existing route's actual parent. A private Create proposal reuses the original CreateRoute/CreateFirewallRoute validators, then every current subnet association is revalidated. Only the original route configuration is replaced in one commit; ID, name, parent, origin, count and nextId remain unchanged. Extra appliance fields on non-appliance routes and no-op updates are rejected.
- `DisassociateSubnetNsg` removes only an actual subnet attachment. It retains NSG/rules and original Create/association history; it is not inherently a security improvement.
- `SetPeeringVirtualNetworkAccess` changes only the selected directional peering's access flag and its actual change origin. The remote flag, forwarding flag and derived Initiated/Connected status remain unchanged.
- The new model reuses3.6 canonical private evaluation and rejects unsupported empty keys before inherited dispatch. No original request is rewritten. New immutable topology-change receipts contain original identity/origin and before/after values.
- Additive008 extends model constraints. Cold setup001→002→008; historical003–007 databases add008. Do not rerun narrower constraint-only migrations over newer data.
- Shared Portal Review is read-only; Save/Disassociate pins workspace/model/revision/exact identity/parent. Studio only links to that existing command path. No optimistic success or alternate write authority.

## Peering source decision

Official references retrieved8 November2026 are retained with response dates/hashes in the delivery evidence. The management guide describes `Allow local to access remote` as traffic from local to remote. ARM `allowVirtualNetworkAccess` describes local VMs accessing remote VMs. `allowForwardedTraffic` is a separate receiving setting in the management guide; enabling access does not enable forwarding or install UDRs. Connected is relationship state, not a policy verdict.

Route selection remains the original modeled configuration/LPM calculation, not real NIC effective routes. Analysis exposes directional access checks and conservatively refuses a positive complete path where selected/return access is disabled. It also checks evaluated VirtualNetwork default-rule dependencies on disabled remote ranges, even when that peering was not selected as the route. Literal custom matches do not acquire a dependency on unrelated unused peerings. Exact Azure effective-route propagation and full VirtualNetwork service-tag membership after such changes are not established by these sources; do not invent a routing drop or default-rule Allow. Literal NSG/firewall matching continues to use the original evaluators.

**Peering Delete deferred:** the current Portal management guide says the remote peering is also deleted; its CLI/PowerShell examples delete both links separately. The troubleshooting guide says a surviving single-sided link becomes Disconnected and must be deleted/recreated. The REST Delete contract targets one named directional resource and does not specify remote cascade. This evidence does not establish one safe side-effect contract for the shared Portal flow. No DeletePeering, invented cascade or Disconnected transition is activated here.

## Reference boundaries

- [Route management](https://learn.microsoft.com/en-us/azure/virtual-network/manage-route-table), [UDR selection](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview): mutable route configuration and LPM/source precedence. Existing conservative VnetLocal/appliance profiles remain simulator restrictions.
- [NSG management](https://learn.microsoft.com/en-us/azure/virtual-network/manage-network-security-group): subnet disassociation retains the NSG.
- [Peering management](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-manage-peering), [troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-network/virtual-network-troubleshoot-peering-issues), [ARM](https://learn.microsoft.com/en-us/azure/templates/microsoft.network/virtualnetworks/virtualnetworkpeerings), [REST Delete](https://learn.microsoft.com/en-us/rest/api/virtualnetwork/virtual-network-peerings/delete): separate directional properties and the deletion ambiguity above. Requested REST2025-05-01 redirected to2026-01-01; this is recorded rather than treated as the requested version.

Implementation has real pure-domain/PostgreSQL and production-browser evidence; exact commands, failures/corrections and image scope are recorded in the PR70 QA report. A separate post-stamp final audit and actual complete candidate CI/strict remain release requirements, not inferred from targeted execution. No measured learning/security effect is claimed. Local PostgreSQL/isolated CI only; public Laboratory503 remains expected. Frozen3.5 malformed-input history is not repaired. Earlier Compute/Back, Axe, landing/resume and CI-budget causes remain open.
