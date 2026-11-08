import { firewallWorld } from './firewall-world';
import { execute, freshWorld } from '../../src/laboratory/v36/domain';
import {
  laboratoryModel,
  nsgEditable,
  type Command,
  type Entry,
} from '../../src/laboratory/v36/contract';
/** Only real registered commands produce positive setup. No injected resource state. */
export function remediationWorld() {
  const f = firewallWorld();
  let world = freshWorld();
  const entries: Entry[] = [];
  const s = {
    get world() {
      return world;
    },
    entries,
    run(command: Command, revision = world.revision) {
      const request = {
        commandId: 'remediation-' + (entries.length + 1),
        expectedRevision: revision,
        command,
      };
      const r = execute(world, request, entries.length + 1);
      entries.push({ model: laboratoryModel, attempt: world.attempt, request, receipt: r.receipt });
      world = r.world;
      return r.receipt;
    },
    create(command: Command) {
      const r = this.run(command);
      if (r.outcome !== 'accepted') throw Error(JSON.stringify(r));
      return r.addedIds[0]!;
    },
    updateNsg(ruleId: string, changes: Record<string, string>) {
      const r = world.securityRules.find((r) => r.id === ruleId)!;
      return this.run({
        type: 'UpdateSecurityRule',
        ruleId,
        nsgId: r.nsgId,
        ...Object.fromEntries(nsgEditable.map((k) => [k, String(r[k])])),
        ...changes,
      } as Command);
    },
  };
  for (const e of f.s.entries) {
    const r = s.run(e.request.command);
    if (r.outcome !== 'accepted') throw Error(JSON.stringify(r));
  }
  const appRule = world.securityRules.find((r) => r.nsgId === f.appNsg)!.id,
    dataRule = world.securityRules.find((r) => r.nsgId === f.dataNsg)!.id;
  return { ...f, s, appRule, dataRule };
}

/** Two unsupported keys must select one stable diagnostic across JSONB ordering.
 * Partial NSG Update deliberately stays within the frozen parser's12-key bound. */
export function ruleChanges(f: ReturnType<typeof remediationWorld>): Command[] {
  const r = f.s.world.securityRules.find((r) => r.id === f.dataRule)!;
  return [
    {
      type: 'UpdateSecurityRule',
      ruleId: r.id,
      nsgId: r.nsgId,
      ...Object.fromEntries(nsgEditable.map((k) => [k, String(r[k])])),
    } as Command,
    { type: 'DeleteSecurityRule', ruleId: r.id, nsgId: r.nsgId },
    {
      type: 'UpdateFirewallNetworkRule',
      ruleId: f.rule,
      collectionId: f.collection,
      source: '*',
      destination: '*',
      protocol: 'Tcp',
      destinationPort: '1433',
    },
    { type: 'DeleteFirewallNetworkRule', ruleId: f.rule, collectionId: f.collection },
  ];
}
export function ambiguousChanges(f: ReturnType<typeof remediationWorld>) {
  const r = f.s.world.securityRules.find((r) => r.id === f.dataRule)!;
  return [
    {
      command: {
        type: 'UpdateSecurityRule',
        ruleId: r.id,
        nsgId: r.nsgId,
        ...Object.fromEntries(
          nsgEditable.filter((k) => k !== 'sourcePort').map((k) => [k, String(r[k])]),
        ),
      },
      extra: 'note',
    },
    { command: { type: 'DeleteSecurityRule', ruleId: r.id, nsgId: r.nsgId }, extra: 'priority' },
    {
      command: {
        type: 'UpdateFirewallNetworkRule',
        ruleId: f.rule,
        collectionId: f.collection,
        source: '*',
        destination: '*',
        protocol: 'Tcp',
        destinationPort: '1433',
      },
      extra: 'priority',
    },
    {
      command: { type: 'DeleteFirewallNetworkRule', ruleId: f.rule, collectionId: f.collection },
      extra: 'priority',
    },
    {
      command: {
        type: 'CreateGroup',
        name: 'denied-group',
        subscriptionId: 'sub-shared',
        metadataRegion: 'norwayeast',
      },
      extra: 'priority',
    },
  ];
}
