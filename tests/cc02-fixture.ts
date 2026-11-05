// Synthetic replay fixtures only; real creation/inspection journey is exercised separately.
import { SandboxStore, sandboxKey } from '../src/domain/sandbox/store';
import {
  applyMission,
  freshMissions,
  missionFacts,
  missionEvaluation,
  missionAnswerIds,
  infrastructureRequirements,
  type MissionEvent,
  type MissionSession,
} from '../src/domain/sandbox/missions';
import type { Command } from '../src/domain/sandbox/model';
export function diagnosticFixture(
  options: {
    mode?: MissionSession['mode'];
    profile?: string;
    inspected?: boolean;
    active?: boolean;
    archive?: 'valid' | 'missing' | 'corrupt';
    deleted?: boolean;
  } = {},
) {
  const mode = options.mode ?? 'guided',
    required = infrastructureRequirements(mode),
    values = new Map<string, string>();
  const store = new SandboxStore({
    getItem: (k) => values.get(k) ?? null,
    setItem: (k, v) => {
      values.set(k, v);
    },
    removeItem: (k) => {
      values.delete(k);
    },
  });
  store.load();
  const send = (command: Command) => {
    const engine = store.getSnapshot().attempt.engine;
    if (
      !store.dispatch({
        kind: 'command',
        request: {
          commandId: `fixture-${engine.ledger.length + 1}`,
          expectedWorldRevision: engine.world.revision,
          command,
        },
        bindResult: false,
      })
    )
      throw Error('fixture command denied');
    return store.getSnapshot().attempt.engine.ledger.at(-1)!.receipt;
  };
  let save = freshMissions();
  const event = (e: MissionEvent) => {
    const next = applyMission(save, e);
    if (!next) throw Error('invalid fixture');
    save = next;
  };
  event({ type: 'start', mission: 'infrastructure', mode, attempt: 1, boundary: null });
  const group = send({
    type: 'CreateGroup',
    name: 'rg-history',
    subscriptionId: required.subscriptionId,
    metadataRegion: 'norwayeast',
  }).addedIds[0]!;
  const receipt = send({
    type: 'CreateVmBundle',
    groupId: group,
    name: 'vm-history',
    region: 'northeurope',
    image: required.image,
    profile: options.profile ?? required.profile,
    dataDiskGiB: '32',
    subnetId: '',
  });
  const vm = receipt.addedIds[0]!;
  event({ type: 'select', target: vm });
  if (options.inspected !== false) {
    for (const id of missionEvaluation(
      missionFacts(save).current!,
      store.getSnapshot().attempt.engine,
      1,
    ).refs)
      event({ type: 'inspect', ref: `resource:${id}` });
    event({ type: 'inspect', ref: `receipt:${receipt.commandId}` });
  }
  for (const field of ['decision', 'reason'] as const)
    event({
      type: 'answer',
      field,
      value: missionAnswerIds({ mission: 'infrastructure', mode })[field][0]!,
    });
  if (!options.active) event({ type: 'submit', through: receipt.commandId });
  if (options.deleted) send({ type: 'DeleteVmBundle', vmId: vm });
  if (options.archive) {
    store.restart();
    if (options.archive === 'missing') store.restart();
  }
  let raw = values.get(sandboxKey)!;
  if (options.archive === 'corrupt') {
    const parsed = JSON.parse(raw);
    parsed.archive[0].commands = [{ invalid: true }];
    raw = JSON.stringify(parsed);
  }
  return { missions: JSON.stringify(save), sandbox: raw, vm, receipt: receipt.commandId };
}
