# Laboratory Compute Part A — bounded contract

Base PR65: `c9cf4f375e5b332b1f17a5ba31d021d093b1cb47`. New explicit workspaces use `laboratory@3.4.0`; existing3.0–3.3 workspaces are never upgraded. No v2 import or course changes.

## Authority and atomicity

One `CreateVirtualMachine` request creates a VM, primary NIC and managed OS disk, with one revision increment and one original receipt identifying all three. The unchanged PostgreSQL repository locks the workspace, verifies complete historical replay, checks command identity, validates revision and commits snapshot plus append-only event before returning success. Same-ID same-request redelivery returns the original result; different requests conflict. Failed validation/rollback creates none of the bundle. Read-only analysis never writes.

NIC/IP/subnet/subscription/region/NSG checks run through the frozen3.3 validators in a private proposal. Intermediate proposal receipts are not ledger events. Only the outer command is committed. Inverse NIC/disk ownership is derived from VM references in the same World. No inventory/result authority is added.

## Deliberate configuration scope

- One primary NIC, explicit **Static IPv4**, existing subnet. VNet derives from the actual subnet. Four leading and the final subnet addresses remain reserved by the existing rules. Existing NIC allocations participate in collision checking. A full subnet cannot accept another address.
- VM names use an ASCII alphanumeric/hyphen subset, start/end alphanumeric; maximum64 Linux/15 Windows. NIC and disk names derive as `name-nic`/`name-os`. This is a simulator subset, not a claim that all other Azure names are invalid.
- Frozen symbolic image selectors: Ubuntu22.04 Gen2 x64 (`Canonical:0001-com-ubuntu-server-jammy:22_04-lts-gen2:latest`) and Windows Server2022 Datacenter Azure Edition x64 Gen2 (`MicrosoftWindowsServer:WindowsServer:2022-datacenter-azure-edition:latest`). `latest` is a documented selector, not pinned/downloaded OS bits. Replay uses the frozen catalogue, never a live lookup.
- `Standard_D2s_v4` (2vCPU/8GiB), `Standard_D4s_v4` (4vCPU/16GiB), both x64 and Gen2-compatible. Dsv4 supports accelerated networking without requiring it; we do not model acceleration. Dsv5 currently requires it, so it was not chosen. No regional SKU capacity/quota assurance.
- Metadata-only OS disks: `Microsoft.Compute/disks`, `StandardSSD_LRS`,128/256GiB. Both catalogue images accept either supported size. Bounded catalogue compatibility, not an assertion of every Azure image minimum or disk option. Eight VMs/eight OS disks, existing16NIC and96total-resource budgets.
- No boot, OS installation, block data, guest credentials, power state, publicIP, VM deletion, SSH/RDP, extensions, telemetry, performance, pricing or real Azure operations.

## Shared Portal and diagnostics

The existing shared header/navigation/resource lists/Create–Review–Create/Properties/history remain the presentation. VM→NIC→subnet→VNet→NSG/route table uses actual World identities. VM diagnostics reuse the existing read-only route and NSG policy analyses with its NIC selected. A policy Allow is not a running VM or application response.

## Migration order

005 is additive: it extends only model allowlists to3.4, with no payload/snapshot rewrite. Cold install uses001,002,005. Existing001/002/003 or004 databases apply005. Do not reapply003/004 after newer workspace data exists: those constraints intentionally reject newer model IDs. All original migrations remain byte-identical. Repository replay dispatch is bound to persisted workspace model, never inferred from command name.

## Official sources checked7 November2026

| Claim                                                       | Microsoft source                                                                                                                                                                               |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Normal Portal VM creation creates a NIC; Linux Gen2 profile | [Linux Portal quickstart](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal)                                                                                  |
| Windows Server2022 Azure Edition x64Gen2                    | [Windows Portal quickstart](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal)                                                                              |
| Image URNs and symbolic latest                              | [Find images](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/cli-ps-findimage)                                                                                                 |
| Dsv4 sizes, architecture and generation                     | [Dsv4](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dsv4-series)                                                                                             |
| OS disk resource and real-Azure limits                      | [Managed disks](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview), [disk ARM schema](https://learn.microsoft.com/en-us/azure/templates/microsoft.compute/disks) |
| VM configuration and resource references                    | [VM ARM schema](https://learn.microsoft.com/en-us/azure/templates/microsoft.compute/virtualmachines)                                                                                           |
| Private addresses                                           | [Private IP](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/private-ip-addresses)                                                                                         |
| Naming                                                      | [Resource name rules](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules)                                                                           |

These sources justify representative configuration, not Azure runtime parity. Local and CI verification, screenshots, independent audit and final delivery evidence are recorded separately after execution. Public functional Compute remains intentionally unavailable without an approved database; expected503 is not a functional Gate7.

## Prior navigation-flake follow-up

The owner-required investigation captured one visible sidebar and a hidden React streamed copy with duplicate IDs. A scoped CourseSidebar change attaches disclosure IDs/controls only after hydration; links, order, teaching callbacks and original test assertions are preserved. Original15-run baseline (14pass/1fail), failed trace, raw DOM evidence, post-fix15/15 run and20-run zero-duplicate observer remain in [the investigation](reviews/evidence/pr66/NAVIGATION_INVESTIGATION.md). This does not close the older independent Compute/Axe causes.
