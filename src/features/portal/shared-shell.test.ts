import { describe, expect, it } from 'vitest';
import { portalServices, portalServiceDefinitions } from './service-catalog';
import { resolvePortalIcon } from './service-icon';
import { laboratoryInventory } from '@/features/laboratory/portal-adapter';
import { laboratorySubscriptions } from '@/features/laboratory/scope-projection';
import { courseSubscriptions } from './scope-projection';
import { freshWorld, execute, models, type Model, type Command } from '@/laboratory/engine';
import { freshEngine, execute as executeV2 } from '@/domain/sandbox/model';
const destination = (view: string, id: string) => ({ href: `/${view}/${id}`, onSelect: () => {} });
describe('shared Portal catalogue reflects actual versioned capabilities without upgrading engines', () => {
  for (const model of models)
    it(`catalogue is explicit and icon-complete for ${model}`, () => {
      const rows = portalServices('laboratory', model);
      expect(new Set(rows.map((r) => r.view)).size).toBe(rows.length);
      expect(rows.map((r) => r.id)).toEqual(
        expect.arrayContaining([
          'subscriptions',
          'groups',
          'resources',
          'accounts',
          'studio',
          'activity',
        ]),
      );
      if (model === 'laboratory@3.8.0') {
        expect(rows.filter((r) => r.id === 'apps' || r.id === 'plans').map((r) => r.id)).toEqual([
          'apps',
          'plans',
        ]);
        expect(rows.some((r) => r.id === 'azurePolicy')).toBe(false);
      } else {
        expect(
          rows.some((r) => r.id === 'apps' || r.id === 'plans' || r.id === 'azurePolicy'),
        ).toBe(false);
      }
      expect(rows.some((r) => r.id === 'vms')).toBe(models.indexOf(model) >= 4);
      expect(rows.some((r) => r.id === 'policyAnalysis')).toBe(models.indexOf(model) >= 3);
      for (const row of rows) expect(resolvePortalIcon(row.icon), row.id).toBeDefined();
    });
  it('fails closed for unknown or absent Laboratory model; course never advertises unsupported v3 operations', () => {
    expect(portalServices('laboratory')).toEqual([]);
    expect(portalServices('laboratory', 'laboratory@3.99.0' as Model)).toEqual([]);
    expect(portalServices('course').map((r) => r.id)).toEqual([
      'subscriptions',
      'groups',
      'resources',
      'apps',
      'plans',
      'vms',
      'activity',
      'azurePolicy',
      'architecture',
    ]);
    expect(new Set(portalServiceDefinitions.map((r) => r.id)).size).toBe(
      portalServiceDefinitions.length,
    );
  });
});
it('projects exact subscription membership/locations from real accepted commands without changing World, revision or receipts', () => {
  let world = freshWorld('laboratory@3.7.0'),
    sequence = 0;
  const send = (command: Command) => {
    const r = execute(
      world,
      { commandId: `scope-${++sequence}`, expectedRevision: world.revision, command },
      sequence,
    );
    expect(r.receipt.outcome).toBe('accepted');
    world = r.world;
    return r.receipt.addedIds[0]!;
  };
  const shared = send({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'same-name',
    metadataRegion: 'norwayeast',
  });
  const app = send({
    type: 'CreateGroup',
    subscriptionId: 'sub-app',
    name: 'same-name',
    metadataRegion: 'northeurope',
  });
  send({
    type: 'CreateStorageAccount',
    groupId: shared,
    name: 'sharedscope72',
    region: 'westeurope',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  send({
    type: 'CreateStorageAccount',
    groupId: app,
    name: 'appscope72',
    region: 'northeurope',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  const before = JSON.stringify(world),
    rows = laboratoryInventory(world);
  const scopes = laboratorySubscriptions(world, rows, destination);
  expect(scopes[0]!.groups[0]!.id).toBe(shared);
  expect(scopes[1]!.groups[0]!.id).toBe(app);
  expect(scopes[0]!.resources.map((r) => r.name)).toEqual(['sharedscope72']);
  expect(scopes[0]!.resourceLocations).toEqual(['westeurope']);
  expect(scopes[0]!.metadataLocations).toEqual(['norwayeast']);
  expect(scopes[0]!.groups[0]!.destination.href).not.toBe(scopes[1]!.groups[0]!.destination.href);
  expect(JSON.stringify(world)).toBe(before);
  expect(JSON.stringify(laboratorySubscriptions(world, rows, destination))).toBe(
    JSON.stringify(scopes),
  );
});
it('uses actual historical course scope identity and technical inventory without manufacturing v3 data', () => {
  let engine = freshEngine();
  engine = executeV2(engine, {
    commandId: 'scope-course',
    expectedWorldRevision: engine.world.revision,
    command: {
      type: 'CreateGroup',
      subscriptionId: 'sub-app',
      name: 'rg-course-scope',
      metadataRegion: 'norwayeast',
    },
  }).engine;
  const before = JSON.stringify(engine);
  const scopes = courseSubscriptions(engine.world, (id) => destination('resource', id));
  expect(scopes.find((s) => s.id === 'sub-app')!.groups.map((r) => r.name)).toEqual([
    'rg-course-scope',
  ]);
  expect(scopes.find((s) => s.id === 'sub-shared')!.groups).toHaveLength(0);
  expect(JSON.stringify(engine)).toBe(before);
});
