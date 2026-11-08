# Architecture Studio Part A

Base PR67: `36f355c0a8262a1ed556d1bb473de54999094998`. Presentation and read-only analysis over existing `laboratory@3.0.0`–`3.5.0`; no new model, command, SQL, migration or inventory authority. Free Laboratory only; no course workspace, learning result or XP.

## Authority and shared presentation

`ArchitectureStudio` receives the existing server-read, replay-verified Snapshot. `laboratoryInventory` remains the single existing ephemeral resource projection. `projectTopology` adds derived scope nodes, typed structural relations and deterministic positions. These are display data, never a World accepted by the server or stored in another database. Subscription nodes represent only local scopes referenced by actual Resource Groups; they are not deployed Azure subscriptions and have no invented receipts.

The existing course `ArchitectureExplorer` and Laboratory Studio both use the extracted `PortalArchitectureGraph`: React Flow, original resource glyphs, node rendering, zoom/pan and controls. The original course controller, providers, teaching boundary, relation callbacks and assessment behavior remain in their original component. The shared renderer imports no course controller/provider, learner store or Laboratory engine. Studio never mounts the v2 explorer/controller over a v3 World. The existing Portal header, navigation, title, tables, resource Overview/Properties and original history remain the product shell.

No graph position is authoritative or persistent. Bounded URL-only subscription/RG/type filters, selected identity and viewport let the ordinary resource/Properties/receipt links return to Studio. URL workspace metadata only scopes presentation; the HttpOnly session and server ownership checks remain authorization. Metadata from another workspace is ignored. No arbitrary return URL or imported World is accepted. Browser history uses Next's external native-history API with null caller state; copying Next's internal state bypassed its search-parameter update and caused an initial real selection/filter failure. Original red native evidence is retained.

## Topology semantics

Nodes retain actual resource IDs inside their explicit workspace/model/revision. Names are labels, never join keys. Scope and IDs disambiguate equal permitted names in different RGs/VNets. The graph includes the existing Storage/data objects, networking/peering/security/routing resources, VM/NIC/OS disk and Firewall/Public IP/Policy hierarchy supported by the actual snapshot's version. Unsupported families are not invented for older models.

Edges distinguish scope membership, parent/child, VM attachments, NIC subnet/NSG, subnet NSG/Route Table, directional peering and Firewall subnet/Policy/Public IP/appliance-reference relations. A configured appliance reference is not proof that a selected packet uses it. Peering target edges carry the existing authoritative Initiated/Connected projection; Initiated is visibly dashed/labeled. Structural edges are not connectivity results. There is no inferred peering transitivity.

Layout is deterministic and non-draggable. Resource Groups occupy disjoint bands; parent depth and stable resource IDs determine columns/rows, wrapped in eight-row lanes with240px spacing to accommodate actual maximum-name cards. A full near-capacity overview cannot make every label simultaneously large: pan/zoom, type/scope filtering, a selected-resource focus control and the full semantic resource/relationship list provide inspection. No manual node placement is required. List and sidepanel expose actual identity, scope, Properties and original receipt links. The capacity probe uses 96 real resources plus one used-subscription node, created by supported commands, not synthetic positive World injection.

## Diagnostics and revision binding

The existing `PolicyAnalysisView` performs the same authenticated GET `/api/laboratory/policy-analysis`. Its optional read-only result callback lets Studio highlight actual referenced resources. No new evaluator or endpoint is introduced. Existing route/LPM, three-valued NSG and Firewall/forward/return evaluation remain frozen. System-route candidates stay in the existing analysis detail; they are not fabricated persisted resources.

Graph highlights and the reference list mean “referenced by this analysis”, not packet hops. The existing detailed result retains the actual selected route, Firewall group/collection/rule, decisive NSG layer, forwarding and return explanations. A Policy reference is configuration/evaluation context, not a physical traffic hop. Unsupported or unassessed stages are not represented as successfully traversed. Where an earlier layer prevents Firewall evaluation, Studio does not invent a Firewall Allow result. The supported destination-NSG conflict reports the actually evaluated Firewall Allow and the decisive actual NSG Deny.

Results must match snapshot workspace, model and revision before any marker/observation is displayed. A confirmed changed snapshot removes old markers immediately; a new request is explicit. Backend/replay errors withhold Studio instead of constructing an alternative graph. Historical snapshot reads use their actual through-boundary. Analysis transmits no packets, boots no VM, verifies no TCP handshake/application and grants no course credit. Existing request-rate bookkeeping is operational metadata, not a technical event/receipt.

The graph exposes a short summary from that same result and the existing detailed panel exposes the evaluated route/rules/forwarding/return. This phase does not add a historical topology/analysis timeline: Studio opens the current verified snapshot and original evidence links. Pure projection and PostgreSQL historical through checks verify compatibility; the existing server diagnostic endpoint remains current-revision analysis.

## Bounded observations

| Type                   | Evidence                                                                                                       | Classification                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| peering-not-connected  | Actual directional peering status is Initiated                                                                 | Review point; not a universal architecture failure                                    |
| broad-allow            | Actual custom NSG rule or Allow collection rule has source, destination and destination port all `*`           | Review point; protocol and business requirements still matter                         |
| firewall-bypass-intent | Existing analysis reports bypass, and user explicitly checked expected Firewall inspection for this connection | Finding for that explicit intent and revision                                         |
| return-incomplete      | Existing analysis supplies a concrete return-path reason                                                       | Unknown/incomplete for that connection, not a guessed global defect                   |
| nsg-deny               | Existing evaluated layer supplies concrete first matched Deny                                                  | Finding about the selected hypothetical initiation, not a universal security judgment |

No absence-of-NSG heuristic, security/architecture score, compliance/Well-Architected approval or automatic modernization result. A configuration may intentionally differ from a reference architecture. Findings link to actual identities and the current analysis; broad-rule review points do not invent severity.

## Sources and boundaries

Official Microsoft pages retrieved and read8 November2026 with retained body SHA256, actual retrieval-start/end timestamps and selected response Date/Last-Modified/ETag:

- [Hub-spoke reference](https://learn.microsoft.com/en-us/azure/architecture/networking/architecture/hub-spoke): nontransitive peering and explicitly configured shared-service/routing architecture. Its real DNS, gateways, IDPS, Monitor and other features are not added by this presentation.
- [Landing-zone design areas](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-areas): reference architecture is a starting point; choices follow organizational requirements.
- [Topology/connectivity design area](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/network-topology-and-connectivity): requirements/context guide topology decisions.
- [Well-Architected](https://learn.microsoft.com/en-us/azure/well-architected/): workload-oriented design guidance, not a score Studio can claim to compute.

Actual source records are in `docs/reviews/evidence/pr68/sources/`. Existing Firewall/NSG/route model rules and their source limitations remain in their original versioned contracts. No new Azure behavior is inferred from a diagram. No drag/drop provisioning, new service, scenario import, arbitrary World bootstrap, automatic grading or learner scoring. Public Laboratory503 without approved database remains expected; local PostgreSQL and isolated CI are the functional environments. No external database, Azure resource, Vercel configuration, merge or production deployment.

## Verification status

Tests/evidence must distinguish actual native interaction from command setup: new browser scenarios prepare real owned environments through existing server commands, verify returned original receipts, then use ordinary Studio controls. They never inject a World/receipt. PR67's inherited ordinary-UI provisioning journeys remain in the mandatory complete profile. Pure layout/reference tests, actual PostgreSQL read/isolation/corruption/through/reset controls, all historical models, backend failure, zero technical inspection writes, keyboard/focus/Axe/reduced motion and actual short-window images are required. Current execution results, original failures and separate post-stamp audit are recorded separately. Human usability, Azure SME, screen-reader and learning-effect validation remain unperformed.
