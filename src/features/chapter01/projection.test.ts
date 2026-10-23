import { expect, it } from 'vitest';
import { execute, freshEngine, type Command } from '@/domain/chapter01/model';
import { projectWorld } from './projection';

it('projects actual membership and hosting separately; geographic properties do not alter scene geometry', () => {
  let engine = freshEngine();
  const commands: Command[] = [
    {
      type: 'CreateGroup',
      name: 'rg-app',
      subscriptionId: 'sub-app',
      metadataRegion: 'norwayeast',
    },
    {
      type: 'CreatePlan',
      name: 'plan-app',
      groupId: 'group-1',
      region: 'westeurope',
      profile: 'linux-learning-v1',
    },
    { type: 'CreateWebApp', name: 'web-app', groupId: 'group-1', planId: 'plan-2' },
  ];
  commands.forEach((command, i) => {
    engine = execute(engine, {
      commandId: `c-${i}`,
      expectedWorldRevision: engine.world.revision,
      command,
    }).engine;
  });
  const original = structuredClone(engine.world);
  const view = projectWorld(engine.world);
  expect(engine.world).toEqual(original);
  expect(view.models).toEqual({ 'plan-2': 'plan', 'app-3': 'webapp' });
  expect(view.dependencies).toEqual([{ from: 'app-3', to: 'plan-2' }]);
  expect(view.relations).toContainEqual({ kind: 'resource-member', from: 'app-3', to: 'group-1' });
  expect(view.scopes.find((s) => s.id === 'app-3')).toMatchObject({
    parentId: 'group-1',
    region: 'westeurope',
  });
  expect(view.scopes.find((s) => s.id === 'group-1')?.region).toBe('norwayeast');
  const otherMetadata = projectWorld({
    ...engine.world,
    groups: engine.world.groups.map((g) => ({ ...g, metadataLocation: 'northeurope' })),
  });
  expect(otherMetadata.positions).toEqual(view.positions);
  expect(otherMetadata.dependencies).toEqual(view.dependencies);
  expect(view.scopes.some((s) => s.id === 'westeurope')).toBe(false);
});
