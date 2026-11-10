# VM laboratory technical specification

## Reference-led form and resource inspection — 2026-10-26

The existing four tabs, fields, bundle command and technical profiles are preserved. Project details/Instance details use compact label/control alignment, explicit region, required markers, dry Review + create and separate Create. The direct review action does not submit a resource. Resource Overview now has a searchable service-specific menu, linked Essentials and separate Disks/Networking projections from actual supported relations. No SSH credentials, public IP, NSG, pricing, image marketplace or runtime power actions appear. Resource creation still opens the actual local resource with a real receipt link; no counterfeit Azure deployment job is introduced. Public screenshot/text version differences are [registered](PORTAL_REFERENCE_FIDELITY.md).

Reviewed sources 2026-10-25: [Windows Portal quickstart](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal), [Linux Portal quickstart](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal), [network relationships](https://learn.microsoft.com/en-us/azure/virtual-network/network-overview), [managed disk roles](https://learn.microsoft.com/en-us/azure/virtual-machines/managed-disks-overview), [naming](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules).

## Learning and supported state

Learner chooses scope, region, guest image, vCPU/RAM profile, durable disk and new/reused subnet. They must distinguish guest configuration from hardware ownership, RAM from durable storage, and a network association from proven reachability. Accepted creation makes a VM, required managed OS disk, NIC, VNet and subnet visible in lists, details, history and graph; optional data disk is another resource. Reused subnet is a real ID reference. Disk attachments, NIC attachment, subnet membership, VNet parent and management membership use distinct relation types. Region remains a property, never a management parent.

Local image aliases represent Ubuntu 22.04 and Windows Server 2022; small=2 vCPU/4 GiB and standard=4 vCPU/8 GiB are teaching profiles, not currently sold SKUs or capacity guarantees. Linux OS disk=64 GiB and Windows=128 GiB are authored allocations. Optional data=32/64 GiB. No temporary disk, ephemeral OS, encryption model, pricing, boot, login, process, backup, availability or connectivity is simulated.

## Command and failure contract

CreateVmBundle takes groupId, name, region, image, profile, dataDiskGiB and subnetId (empty creates network). Validate exact fields, bounded strings, supported region/image/profile/disk, existing group and region-compatible subnet, uniqueness and whole-bundle capacity before mutation. IDs share the monotonic allocator. One accepted receipt lists every new ID; one revision covers the transaction. Any invalid input leaves all resources unchanged. The existing custom Web-only deny policy does not target Compute/Network/disks.

Naming is an intentionally narrow training subset: lowercase, initial letter, 3–15 characters, alphanumeric final character. This is not Azure's complete resource-name or OS hostname rule. Network reuse is limited to the same group and region; Azure supports additional arrangements outside this model. New network uses authored 10.42.0.0/16 and subnet 10.42.1.0/24; no IP allocation/reachability is inferred. No Public IP, NSG, credential or inbound-port operation.

Capacity, stale revision, duplicate delivery/conflicting ID, unknown field and unsupported command return deterministic receipts. DeleteVmBundle removes only exclusive VM dependencies; an in-use VNet/subnet is retained. Group deletion fails while any supported member exists. Reset is an explicit local attempt change, not Azure deletion.

## Portal sequence

Course IaaS → lab purpose → real global search → Virtual machines → Create → Basics → Disks → Networking → Review + create → explicit Create → resource result with actual receipt link → receipt → Go to resource → properties/dependencies → live Architecture Explorer → exact lesson debrief. Review is dry-run only. No credential fields or fake deployment spinner. Errors identify the property/rule, and the learner corrects their own input.

Independent changed task: Windows/standard/data64 in Shared Sandbox, newly created after the attempt boundary; inspect actual attachments and explain retained OS patching and why a configured NIC proves no network connection. First/help/retry/abandon and resource/receipt references remain separate from guided practice.

## Implemented model limits and review status

Sandbox@2 permits at most8VMs,8groups and96scope/resource objects. These local limits are enforced before a whole bundle is committed. Existing v1 receipts keep their old3group/16object rules. VM profile selections are visible in properties, OS/data disks have different roles, and network objects/relationships are inspectable. Domain, workflow and visual review results are recorded in [QA](PRACTICAL_LABS_QA.md); qualified human acceptance is still pending.

The current form prevents duplicate submissions, retries rejected creation with its prior values, and exposes no pretend VM update action. Receipt inspection has an explicit return to the existing resource; cleanup has a truthful receipt without a dead resource link.
