import { it, expect } from 'vitest';
import {
  remediationWorld,
  ambiguousChanges,
  ruleChanges,
} from '../tests/fixtures/remediation-world';
import { replay, execute, canonical, parseRequest } from './laboratory/v36/domain';
import { laboratoryModel, type Command } from './laboratory/v36/contract';
import { analysePolicy } from './laboratory/v36/analysis';
import * as engine from './laboratory/engine';
const fwUpdate = (
  ruleId: string,
  collectionId: string,
  fields: Record<string, string> = {},
): Command => ({
  type: 'UpdateFirewallNetworkRule',
  ruleId,
  collectionId,
  source: '*',
  destination: '*',
  protocol: 'Tcp',
  destinationPort: '*',
  ...fields,
});
it.each([0, 1, 2, 3])(
  'rejects an empty unsupported key on complete lifecycle command%s without mutation',
  (index) => {
    const f = remediationWorld(),
      before = canonical(f.s.world),
      request = {
        commandId: 'empty-key',
        expectedRevision: f.s.world.revision,
        command: { ...ruleChanges(f)[index]!, '': 'forbidden' },
      };
    expect(parseRequest(request)).not.toBeNull();
    const result = execute(f.s.world, request as never, f.s.entries.length + 1);
    expect(result.receipt).toMatchObject({
      outcome: 'unsupported',
      code: 'unsupported-field',
      field: '',
    });
    expect(canonical(result.world)).toBe(before);
    expect(canonical(f.s.world)).toBe(before);
  },
);

it.each([0, 1, 2, 3, 4])(
  'keeps multiple unsupported fields deterministic across request-key permutations for operation index%s',
  (index) => {
    const f = remediationWorld(),
      item = ambiguousChanges(f)[index]!,
      before = canonical(f.s.world);
    const request = {
      commandId: 'permutation',
      expectedRevision: f.s.world.revision,
      command: { ...item.command, [item.extra]: '100', action: 'Allow' },
    };
    const reversed = {
      ...request,
      command: { ...item.command, action: 'Allow', [item.extra]: '100' },
    };
    expect(parseRequest(request)).not.toBeNull();
    expect(parseRequest(reversed)).not.toBeNull();
    const original = JSON.stringify(request),
      originalReversed = JSON.stringify(reversed);
    const a = execute(f.s.world, request as never, f.s.entries.length + 1),
      b = execute(f.s.world, reversed as never, f.s.entries.length + 1);
    expect(a.receipt).toMatchObject({
      code: 'unsupported-field',
      field: 'action',
      outcome: 'unsupported',
    });
    expect(a.receipt).toEqual(b.receipt);
    expect(canonical(f.s.world)).toBe(before);
    expect(canonical(a.world)).toBe(before);
    expect(JSON.stringify(request)).toBe(original);
    expect(JSON.stringify(reversed)).toBe(originalReversed);
  },
);

it.each([
  [{ source: 'Internet' }, 'invalid-firewall-rule'],
  [{ destination: '10.20.1.1/24' }, 'invalid-firewall-rule'],
  [{ protocol: '*' }, 'invalid-firewall-rule'],
  [{ destinationPort: '0' }, 'invalid-firewall-rule'],
  [{ destinationPort: '65536' }, 'invalid-firewall-rule'],
  [{ destinationPort: '80-443' }, 'invalid-firewall-rule'],
] as const)(
  'rejects unsupported Firewall rule replacement %j without changing configuration',
  (fields, code) => {
    const f = remediationWorld(),
      before = canonical(f.s.world),
      r = f.s.run(fwUpdate(f.rule, f.collection, fields));
    expect(r.code).toBe(code);
    expect(canonical(f.s.world)).toBe(before);
    expect(r.change).toBeUndefined();
  },
);

it('can replace rules at the full existing NSG and Firewall rule budgets without creating a temporary persisted resource', () => {
  const f = remediationWorld();
  for (const nsgId of [f.appNsg, f.dataNsg])
    for (let i = 0; i < 15; i++)
      f.s.create({
        type: 'CreateSecurityRule',
        nsgId,
        name: 'capacity-' + i,
        direction: 'Outbound',
        priority: String(100 + i),
        protocol: 'Tcp',
        source: '*',
        sourcePort: '*',
        destination: '*',
        destinationPort: '*',
        access: 'Deny',
      });
  expect(f.s.world.securityRules).toHaveLength(32);
  const n = f.s.world.nextId;
  expect(f.s.updateNsg(f.appRule, { priority: '250' }).outcome).toBe('accepted');
  expect(f.s.world.nextId).toBe(n);
  const g = remediationWorld();
  for (let i = 0; i < 47; i++)
    g.s.create({
      type: 'CreateFirewallNetworkRule',
      collectionId: g.collection,
      name: 'capacity-' + i,
      source: '*',
      destination: '*',
      protocol: 'Udp',
      destinationPort: '123',
    });
  expect(g.s.world.firewallRules).toHaveLength(48);
  const nextId = g.s.world.nextId;
  expect(g.s.run(fwUpdate(g.rule, g.collection)).outcome).toBe('accepted');
  expect(g.s.world.nextId).toBe(nextId);
  expect(g.s.world.firewallRules).toHaveLength(48);
});
it('updates a complete NSG rule in place, preserves original Create evidence and before/after replay without consuming identity', () => {
  const f = remediationWorld(),
    before = structuredClone(f.s.world),
    history = structuredClone(f.s.entries),
    old = before.securityRules.find((r) => r.id === f.appRule)!;
  const r = f.s.updateNsg(f.appRule, {
    priority: '101',
    direction: 'Inbound',
    protocol: 'Udp',
    source: '10.10.1.10',
    sourcePort: '50000',
    destination: '10.20.1.10',
    destinationPort: '1433',
    access: 'Deny',
  });
  expect(r.outcome).toBe('accepted');
  expect(r.updatedIds).toEqual([old.id]);
  expect(r.addedIds).toEqual([]);
  expect(f.s.world.nextId).toBe(before.nextId);
  expect(f.s.world.revision).toBe(before.revision + 1);
  expect(f.s.world.securityRules.find((x) => x.id === old.id)).toMatchObject({
    id: old.id,
    origin: old.origin,
    name: old.name,
    nsgId: old.nsgId,
    priority: 101,
    direction: 'Inbound',
    protocol: 'Udp',
    access: 'Deny',
  });
  expect(r.change).toMatchObject({
    id: old.id,
    createOrigin: old.origin,
    before: { priority: 200 },
    after: { priority: 101 },
  });
  expect(f.s.entries.slice(0, history.length)).toEqual(history);
  expect(replay(f.s.entries, history.length)).toEqual(before);
  expect(replay(f.s.entries)).toEqual(f.s.world);
});
it.each([
  [{ priority: '99' }, 'invalid-priority'],
  [{ priority: '4097' }, 'invalid-priority'],
  [{ priority: '0100' }, 'invalid-priority'],
  [{ protocol: 'Icmp' }, 'invalid-rule'],
  [{ source: 'VirtualNetwork' }, 'invalid-rule'],
  [{ destination: '10.0.0.1/24' }, 'invalid-rule'],
  [{ sourcePort: '65536' }, 'invalid-rule'],
  [{ destinationPort: '80,443' }, 'invalid-rule'],
  [{ access: 'Audit' }, 'invalid-rule'],
  [{ direction: 'Both' }, 'invalid-rule'],
] as const)('rejects a complete invalid NSG configuration %j atomically', (changes, code) => {
  const f = remediationWorld(),
    before = canonical(f.s.world),
    r = f.s.updateNsg(f.appRule, changes);
  expect(r.code).toBe(code);
  expect(canonical(f.s.world)).toBe(before);
  expect(r.updatedIds).toEqual([]);
  expect(r.change).toBeUndefined();
});
it('validates priorities within direction and exact parent, unknown fields, default identities and no-op', () => {
  const f = remediationWorld();
  const rule = f.s.world.securityRules.find((r) => r.id === f.appRule)!;
  f.s.create({
    type: 'CreateSecurityRule',
    nsgId: f.appNsg,
    name: 'other',
    direction: 'Outbound',
    priority: '101',
    protocol: 'Tcp',
    source: '*',
    sourcePort: '*',
    destination: '*',
    destinationPort: '*',
    access: 'Deny',
  });
  expect(f.s.updateNsg(f.appRule, { priority: '101' }).code).toBe('priority-conflict');
  expect(f.s.updateNsg(f.appRule, { priority: '101', direction: 'Inbound' }).outcome).toBe(
    'accepted',
  );
  const command = f.s.entries.at(-1)!.request.command;
  const before = canonical(f.s.world);
  for (const [c, code] of [
    [{ ...command, nsgId: f.dataNsg }, 'incompatible-association'],
    [{ ...command, name: 'renamed' }, 'unsupported-field'],
    [
      {
        type: 'DeleteSecurityRule',
        ruleId: `default:${f.appNsg}:AllowVnetInBound`,
        nsgId: f.appNsg,
      },
      'read-only-rule',
    ],
    [
      {
        type: 'UpdateSecurityRule',
        ruleId: `default:${f.appNsg}:DenyAllInBound`,
        nsgId: f.appNsg,
        ...Object.fromEntries(
          Object.entries(rule)
            .filter(([k]) => !['id', 'name', 'nsgId', 'origin'].includes(k))
            .map(([k, v]) => [k, String(v)]),
        ),
      },
      'read-only-rule',
    ],
    [{ type: 'DeleteSecurityRule', ruleId: 'rule-expired', nsgId: f.appNsg }, 'invalid-parent'],
    [command, 'no-change'],
  ] as const) {
    const r = f.s.run(c as Command);
    expect(r.code).toBe(code);
    expect(canonical(f.s.world)).toBe(before);
  }
});
it('narrows an actual broad Allow and uses an explicit fallback Deny instead of inventing a service-tag conclusion', () => {
  const f = remediationWorld();
  f.s.updateNsg(f.appRule, { source: '*', destination: '*', destinationPort: '*' });
  f.s.updateNsg(f.dataRule, { destinationPort: '*' });
  f.s.run(fwUpdate(f.rule, f.collection));
  const deny = f.s.create({
    type: 'CreateSecurityRule',
    nsgId: f.appNsg,
    name: 'deny-other',
    direction: 'Outbound',
    priority: '300',
    protocol: '*',
    source: '*',
    sourcePort: '*',
    destination: '*',
    destinationPort: '*',
    access: 'Deny',
  });
  for (const p of ['1433', '3389'])
    expect(analysePolicy(f.s.world, { ...f.input, destinationPort: p })).toMatchObject({
      ok: true,
      analysis: { status: 'allowed-by-modeled-network-policy' },
    });
  const before = f.s.entries.length;
  f.s.updateNsg(f.appRule, {
    source: '10.10.1.10',
    destination: '10.20.1.10',
    destinationPort: '1433',
  });
  expect(analysePolicy(f.s.world, f.input)).toMatchObject({
    ok: true,
    analysis: {
      model: laboratoryModel,
      status: 'allowed-by-modeled-network-policy',
      firewallPath: { decision: { status: 'allow', matchedRuleId: f.rule } },
    },
  });
  const denied = analysePolicy(f.s.world, { ...f.input, destinationPort: '3389' });
  expect(denied).toMatchObject({
    ok: true,
    analysis: { status: 'denied-by-modeled-network-policy' },
  });
  expect(denied.ok && denied.analysis.layers.some((l) => l.matchedRuleId === deny)).toBe(true);
  expect(
    analysePolicy(replay(f.s.entries, before)!, { ...f.input, destinationPort: '3389' }),
  ).toMatchObject({ ok: true, analysis: { status: 'allowed-by-modeled-network-policy' } });
});
it('edits only nested Firewall rule fields, preserves hierarchy and evaluates another collection before default deny', () => {
  const f = remediationWorld();
  f.s.updateNsg(f.dataRule, { destinationPort: '*' });
  expect(f.s.run(fwUpdate(f.rule, f.collection)).outcome).toBe('accepted');
  const before = structuredClone(f.s.world);
  expect(analysePolicy(before, { ...f.input, destinationPort: '3389' })).toMatchObject({
    ok: true,
    analysis: { firewallPath: { decision: { status: 'allow', matchedRuleId: f.rule } } },
  });
  f.s.run(
    fwUpdate(f.rule, f.collection, {
      source: '10.10.1.10',
      destination: '10.20.1.10',
      destinationPort: '1433',
    }),
  );
  expect(f.s.world.firewallCollections).toEqual(before.firewallCollections);
  expect(f.s.world.firewallGroups).toEqual(before.firewallGroups);
  expect(f.s.world.firewallPolicies).toEqual(before.firewallPolicies);
  expect(f.s.world.firewallRules.find((r) => r.id === f.rule)?.origin).toBe(
    before.firewallRules.find((r) => r.id === f.rule)?.origin,
  );
  expect(analysePolicy(f.s.world, { ...f.input, destinationPort: '3389' })).toMatchObject({
    ok: true,
    analysis: { firewallPath: { decision: { status: 'deny', reason: 'default-deny' } } },
  });
  const collection = f.s.create({
    type: 'CreateFirewallNetworkCollection',
    collectionGroupId: f.collectionGroup,
    name: 'other-allow',
    priority: '300',
    action: 'Allow',
  });
  const other = f.s.create({
    type: 'CreateFirewallNetworkRule',
    collectionId: collection,
    name: 'other-port',
    source: '*',
    destination: '*',
    protocol: 'Tcp',
    destinationPort: '3389',
  });
  expect(analysePolicy(f.s.world, { ...f.input, destinationPort: '3389' })).toMatchObject({
    ok: true,
    analysis: {
      firewallPath: {
        decision: { status: 'allow', matchedRuleId: other, collectionId: collection },
      },
    },
  });
  for (const fields of [
    { action: 'Deny' },
    { priority: '100' },
    { name: 'new' },
    { collectionGroupId: f.collectionGroup },
    { description: 'not-supported' },
  ])
    expect(f.s.run({ ...fwUpdate(f.rule, f.collection), ...fields } as Command).code).toBe(
      'unsupported-field',
    );
});
it.each([
  ['DeleteSecurityRule', 'nsgId'],
  ['DeleteFirewallNetworkRule', 'collectionId'],
] as const)(
  'deletes only the exact custom target with %s, preserves Create, through and never reuses the removed ID',
  (type, parent) => {
    const f = remediationWorld(),
      nsg = type === 'DeleteSecurityRule',
      ruleId = nsg ? f.appRule : f.rule,
      parentId = nsg ? f.appNsg : f.collection;
    const old = structuredClone(f.s.world),
      through = f.s.entries.length,
      createOrigin = (nsg ? old.securityRules : old.firewallRules).find(
        (r) => r.id === ruleId,
      )!.origin;
    expect(f.s.run({ type, ruleId, [parent]: parentId } as Command, old.revision - 1).code).toBe(
      'stale-revision',
    );
    expect(f.s.world).toEqual(old);
    const r = f.s.run({ type, ruleId, [parent]: parentId } as Command);
    expect(r.outcome).toBe('accepted');
    expect(r.removedIds).toEqual([ruleId]);
    expect(r.change).toMatchObject({ id: ruleId, parentId, createOrigin, after: null });
    const only = {
      ...old,
      revision: old.revision + 1,
      ...(nsg
        ? { securityRules: old.securityRules.filter((r) => r.id !== ruleId) }
        : { firewallRules: old.firewallRules.filter((r) => r.id !== ruleId) }),
    };
    expect(f.s.world).toEqual(only);
    expect(replay(f.s.entries, through)).toEqual(old);
    expect(replay(f.s.entries)).toEqual(only);
    const create = f.s.entries.find((e) => e.request.commandId === createOrigin)!;
    expect(create.receipt.addedIds).toContain(ruleId);
    expect(f.s.run({ type, ruleId, [parent]: parentId } as Command).code).toBe('invalid-parent');
    const oldCreate = f.s.entries.find((e) => e.receipt.addedIds.includes(ruleId))!.request.command;
    expect(f.s.create(oldCreate)).not.toBe(ruleId);
    expect(f.s.world.nextId).toBe(old.nextId + 1);
    f.s.run({ type: 'ResetWorkspace' });
    expect(f.s.world.securityRules).toEqual([]);
    expect(f.s.world.firewallRules).toEqual([]);
    expect(replay(f.s.entries, through)).toEqual(old);
    expect(replay(f.s.entries)).toEqual(f.s.world);
  },
);
it('deleting a concrete NSG Deny activates the remaining explicit Allow without evaluating the removed rule or borrowing service-tag certainty', () => {
  const f = remediationWorld();
  f.s.updateNsg(f.appRule, { access: 'Deny' });
  const next = f.s.create({
    type: 'CreateSecurityRule',
    nsgId: f.appNsg,
    name: 'next-sql',
    direction: 'Outbound',
    priority: '300',
    protocol: 'Tcp',
    source: '10.10.1.10',
    sourcePort: '*',
    destination: '10.20.1.10',
    destinationPort: '1433',
    access: 'Allow',
  });
  const through = f.s.entries.length;
  expect(analysePolicy(f.s.world, f.input)).toMatchObject({
    ok: true,
    analysis: { status: 'denied-by-modeled-network-policy' },
  });
  f.s.run({ type: 'DeleteSecurityRule', ruleId: f.appRule, nsgId: f.appNsg });
  const result = analysePolicy(f.s.world, f.input);
  expect(result).toMatchObject({
    ok: true,
    analysis: { status: 'allowed-by-modeled-network-policy' },
  });
  expect(result.ok && result.analysis.layers.some((l) => l.matchedRuleId === next)).toBe(true);
  expect(result.ok && result.analysis.layers.some((l) => l.matchedRuleId === f.appRule)).toBe(
    false,
  );
  expect(analysePolicy(replay(f.s.entries, through)!, f.input)).toMatchObject({
    ok: true,
    analysis: { status: 'denied-by-modeled-network-policy' },
  });
});
it('rejects stale writes before validation, preserves original replay receipts and fails tampered change evidence', () => {
  const f = remediationWorld(),
    revision = f.s.world.revision;
  f.s.updateNsg(f.appRule, { destinationPort: '443' });
  const before = canonical(f.s.world);
  expect(f.s.run(fwUpdate(f.rule, f.collection), revision).code).toBe('stale-revision');
  expect(canonical(f.s.world)).toBe(before);
  const altered = structuredClone(f.s.entries);
  altered.find((e) => e.receipt.change)!.receipt.change!.createOrigin = 'forged';
  expect(replay(altered)).toBeNull();
  for (const model of engine.models.filter((m) => m !== laboratoryModel)) {
    const old = engine.freshWorld(model),
      r = engine.execute(
        old,
        { commandId: 'new-command-old-model', expectedRevision: 0, command: fwUpdate('x', 'y') },
        1,
      );
    expect(r.world).toEqual(old);
    expect(r.receipt.outcome).toBe('unsupported');
    expect(r.receipt.code).toBe('unsupported-capability');
  }
  expect(
    execute(
      f.s.world,
      {
        commandId: 'noop',
        expectedRevision: f.s.world.revision,
        command: {
          type: 'DeleteFirewallNetworkRule',
          ruleId: f.rule,
          collectionId: 'wrong-parent',
        },
      },
      1,
    ).receipt.code,
  ).toBe('incompatible-association');
});
