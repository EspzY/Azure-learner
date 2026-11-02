import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import { requestFor } from '../../src/domain/portal/model';
import { infrastructure, type Command } from '../../src/domain/sandbox/model';
/** All fixture resources/receipts are produced by the original versioned command store. */
export function inspectionFixture() {
  const data = new Map<string, string>();
  const store = new SandboxStore({
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v);
    },
    removeItem: (k) => {
      data.delete(k);
    },
  });
  store.load();
  let seq = 0;
  const command = (c: Command) => {
    const engine = store.getSnapshot().attempt.engine;
    if (!store.dispatch({ kind: 'command', request: requestFor(engine, c, ++seq) }))
      throw Error('Fixture storage');
    return store.getSnapshot().attempt.engine.ledger.at(-1)!;
  };
  command({
    type: 'CreateGroup',
    name: 'rg-pr48',
    subscriptionId: 'sub-app',
    metadataRegion: 'norwayeast',
  });
  const group = store.getSnapshot().attempt.engine.world.groups[0]!;
  const denied = command({
    type: 'CreatePlan',
    groupId: group.id,
    name: 'plan-denied',
    region: 'northeurope',
    profile: 'linux-learning-v1',
  });
  command({
    type: 'CreatePlan',
    groupId: group.id,
    name: 'plan-pr48',
    region: 'westeurope',
    profile: 'linux-learning-v1',
  });
  const plan = store.getSnapshot().attempt.engine.world.resources[0]!;
  command({ type: 'CreateWebApp', groupId: group.id, name: 'app-pr48', planId: plan.id });
  const app = store
    .getSnapshot()
    .attempt.engine.world.resources.find((r) => r.name === 'app-pr48')!;
  command({
    type: 'CreateVmBundle',
    groupId: group.id,
    name: 'vm-pr48',
    region: 'norwayeast',
    image: 'ubuntu-22-04',
    profile: 'small',
    dataDiskGiB: '32',
    subnetId: '',
  });
  command({
    type: 'SetAppSettings',
    appId: app.id,
    environment: 'staging',
    catalogMode: 'read-only',
  });
  const changed = command({
    type: 'SetAppSettings',
    appId: app.id,
    environment: 'production',
    catalogMode: 'standard',
  });
  command({
    type: 'CreateGroup',
    name: 'rg-other',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  });
  const engine = store.getSnapshot().attempt.engine,
    vm = infrastructure(engine.world).find((r) => r.kind === 'vm')!;
  if (vm.kind !== 'vm') throw Error('Fixture VM');
  return {
    store,
    command,
    engine,
    vm,
    app,
    plan,
    group,
    denied,
    changed,
    get raw() {
      return data.get(sandboxKey)!;
    },
  };
}
