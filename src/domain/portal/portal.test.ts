import { describe, it, expect } from 'vitest';
import { execute, freshEngine, type Command, type Engine } from '../chapter01/model';
import {
  filterInventory,
  inventory,
  parseLocation,
  portalHref,
  projectArchitecture,
  requestFor,
  reviewCommand,
  creationContext,
  resourceInventory,
} from './model';
import {
  applyModuleEvent,
  evaluateCase,
  evaluateSubmission,
  freshServices,
  restoreServices,
  serviceFacts,
  serviceModule,
} from './learning';
import { ServiceStore } from './store';
import { nb } from '@/content/nb';
import { validateServiceContent, serviceObjectives } from './content';
function commit(engine: Engine, command: Command) {
  return execute(engine, requestFor(engine, command, engine.ledger.length + 1));
}
function build(subscription = 'sub-shared', region = 'northeurope') {
  let engine = freshEngine();
  engine = commit(engine, {
    type: 'CreateGroup',
    name: 'rg-transfer',
    subscriptionId: subscription,
    metadataRegion: 'norwayeast',
  }).engine;
  engine = commit(engine, {
    type: 'CreatePlan',
    name: 'plan-transfer',
    groupId: 'group-1',
    region,
    profile: 'linux-learning-v1',
  }).engine;
  if (engine.world.resources.length)
    engine = commit(engine, {
      type: 'CreateWebApp',
      name: 'app-transfer',
      groupId: 'group-1',
      planId: 'plan-2',
    }).engine;
  return engine;
}
describe('Portal domain adapters preserve the shared technical truth', () => {
  it('keeps service resources separate from management containers in operational lists', () => {
    const world = build().world;
    expect(resourceInventory(world).map((row) => row.id)).toEqual(['plan-2', 'app-3']);
    expect(inventory(world).filter((row) => row.kind === 'group')).toHaveLength(1);
  });
  it('inherits context from a group or plan in the non-default subscription', () => {
    const world = build().world;
    expect(creationContext(world, 'group-1')).toEqual({
      subscription: 'sub-shared',
      group: 'group-1',
      plan: '',
    });
    expect(creationContext(world, 'plan-2')).toEqual({
      subscription: 'sub-shared',
      group: 'group-1',
      plan: 'plan-2',
    });
    expect(creationContext(world, 'sub-app').group).toBe('');
  });
  it('reviews without committing, then creates typed inventory and deterministic receipts', () => {
    const engine = freshEngine(),
      command: Command = {
        type: 'CreateGroup',
        name: 'rg-team',
        subscriptionId: 'sub-app',
        metadataRegion: 'norwayeast',
      };
    const a = reviewCommand(engine, command, 1),
      b = reviewCommand(engine, command, 1);
    expect(a).toEqual(b);
    expect(a.outcome).toBe('accepted');
    expect(engine.world.groups).toHaveLength(0);
    expect(engine.ledger).toHaveLength(0);
    const result = commit(engine, command);
    expect(inventory(result.engine.world).filter((r) => r.kind === 'group')).toHaveLength(1);
    const repeat = execute(result.engine, result.engine.ledger[0]!.request);
    expect(repeat.engine).toBe(result.engine);
  });
  it('does not turn a denied request into an inventory or graph resource', () => {
    const engine = build('sub-app', 'northeurope');
    expect(engine.ledger.at(-1)!.receipt.code).toBe('policy-location-denied');
    expect(engine.world.revision).toBe(1);
    expect(engine.world.resources).toHaveLength(0);
    expect(projectArchitecture(engine.world).nodes.some((n) => n.kind === 'plan')).toBe(false);
    expect(engine.ledger.at(-1)!.receipt.policy?.assignmentScope).toBe('sub-app');
  });
  it('projects membership, identity, management, hosting and policy without geographic parents', () => {
    const engine = build(),
      projection = projectArchitecture(engine.world);
    expect(new Set(projection.nodes.map((n) => n.id)).size).toBe(projection.nodes.length);
    expect(projection.edges).toContainEqual(
      expect.objectContaining({ from: 'app-3', to: 'plan-2', kind: 'depends-on' }),
    );
    expect(projection.edges).toContainEqual(
      expect.objectContaining({ from: 'app-3', to: 'group-1', kind: 'resource-member' }),
    );
    expect(projectArchitecture(engine.world, 'hierarchy').edges).toContainEqual(
      expect.objectContaining({ from: 'sub-app', to: 'tenant-lab', kind: 'identity-authority' }),
    );
    expect(projection.edges).toContainEqual(
      expect.objectContaining({ from: 'policy-web-location', to: 'sub-app', kind: 'policy-scope' }),
    );
    expect(projection.nodes.some((n) => ['norwayeast', 'northeurope'].includes(n.id))).toBe(false);
    expect(engine.world.groups[0]!.metadataLocation).not.toBe(engine.world.resources[0]!.location);
  });
  it('keeps missing dependencies and unsupported fields as real model rejections', () => {
    const group = commit(freshEngine(), {
      type: 'CreateGroup',
      name: 'rg-team',
      subscriptionId: 'sub-app',
      metadataRegion: 'norwayeast',
    }).engine;
    expect(
      commit(group, {
        type: 'CreateWebApp',
        name: 'app-team',
        groupId: 'group-1',
        planId: 'missing',
      }).receipt.code,
    ).toBe('missing-plan');
    expect(
      execute(group, {
        commandId: 'unknown',
        expectedWorldRevision: 1,
        command: {
          type: 'CreateGroup',
          name: 'rg-tags',
          subscriptionId: 'sub-app',
          metadataRegion: 'norwayeast',
          tags: 'discard-me',
        },
      }).receipt.outcome,
    ).toBe('unsupported');
    expect(group.world.resources).toHaveLength(0);
  });
  it('allowlists history/context and filters actual inventory', () => {
    expect(parseLocation(new URLSearchParams('area=challenge&mode=guided')).mode).toBe(
      'independent',
    );
    const context = parseLocation(
      new URLSearchParams('area=learn&module=services&topic=paas&mode=guided'),
    );
    const next = portalHref(context, 'create', { kind: 'plan', id: 'group-1' });
    expect(next).toContain('/portal?');
    expect(parseLocation(new URLSearchParams(next.split('?')[1]))).toMatchObject({
      topic: 'paas',
      module: 'services',
      mode: 'guided',
      kind: 'plan',
    });
    expect(
      parseLocation(new URLSearchParams('area=javascript:alert(1)&mode=completed&id=<script>')),
    ).toMatchObject({ area: 'home', mode: 'learn', id: '' });
    const rows = inventory(build().world);
    expect(filterInventory(rows, 'TRANSFER', 'sub-shared', 'app').map((r) => r.id)).toEqual([
      'app-3',
    ]);
    expect(filterInventory(rows, 'TRANSFER', 'sub-app')).toHaveLength(0);
  });
});
describe('service-types content/evidence is explicit and versioned', () => {
  it('rejects missing objectives, explanations, sources and orphaned teaching', () => {
    expect(validateServiceContent()).toEqual([]);
    expect(validateServiceContent(serviceObjectives.slice(1))).toContain('Missing objective ST01');
    expect(
      validateServiceContent(serviceObjectives, {
        ...nb.portal.lesson.sections,
        iaas: { ...nb.portal.lesson.sections.iaas, mechanism: '' },
      }),
    ).toContain('iaas: missing mechanism');
    expect(validateServiceContent(serviceObjectives, nb.portal.lesson.sections, {})).toContain(
      'ST01: source',
    );
    expect(
      validateServiceContent(serviceObjectives, { ...nb.portal.lesson.sections, orphan: {} }),
    ).toContain('Orphan section orphan');
  });
  it('binds all four objectives to full original sections, practice and changed criteria', () => {
    expect(nb.official.serviceUnits).toHaveLength(6);
    expect(nb.official.serviceUnits).not.toContain('What is cloud computing');
    expect(serviceModule.objectives).toEqual(['ST01', 'ST02', 'ST03', 'ST04']);
    expect(serviceModule.humanSme).toBeNull();
    for (const section of Object.values(nb.portal.lesson.sections))
      for (const key of [
        'title',
        'intro',
        'mechanism',
        'example',
        'misconception',
        'limits',
      ] as const)
        expect(section[key].trim()).not.toBe('');
    for (const id of ['legacy', 'custom', 'ready'] as const) {
      expect(nb.portal.lesson.cases[id]).toBeTruthy();
      expect(nb.portal.lesson.feedback[id]).toBeTruthy();
    }
    expect(evaluateCase('custom', 'paas', 'managed-platform')).toBe(true);
    expect(evaluateCase('custom', 'paas', 'ready-service')).toBe(false);
    expect(nb.portal.lesson.sections.paas.mechanism).toContain('container');
    expect(nb.portal.lesson.sections.saas.mechanism).toContain('rettigheter');
  });
  it('does not complete practice from read/view flags or passive model display', () => {
    expect(serviceFacts(freshServices()).guidedComplete).toBe(false);
    expect(applyModuleEvent(freshServices(), { kind: 'complete', score: 100 })).toBeNull();
    let save = freshServices();
    for (const model of ['iaas', 'paas', 'saas'])
      save = applyModuleEvent(save, { kind: 'compare', model })!;
    expect(serviceFacts(save).guidedComplete).toBe(false);
  });
  it('evaluates a first unaided changed build from actual replayed receipts', () => {
    const engine = build();
    let save = freshServices();
    for (const e of [
      { kind: 'begin', boundary: null, attemptNumber: 1 },
      {
        kind: 'draft',
        answers: {
          osModel: 'iaas',
          webModel: 'paas',
          readyModel: 'saas',
          reason: 'managed-platform',
          locationCause: 'plan',
          groupId: 'group-1',
          planId: 'plan-2',
          appId: 'app-3',
        },
      },
      { kind: 'submit', through: 'portal-3' },
    ])
      save = applyModuleEvent(save, e)!;
    const submission = serviceFacts(save).submissions[0]!;
    expect(submission.assisted).toBe(false);
    expect(evaluateSubmission(submission, engine, 1).correct).toBe(true);
    expect(evaluateSubmission(submission, engine, 2).verifiable).toBe(false);
    expect(evaluateSubmission(submission, freshEngine(), 1).correct).toBe(false);
    const older = { ...submission, boundary: 'portal-3' };
    expect(evaluateSubmission(older, engine, 1).criteria.hosting).toBe(false);
    const wrongScope = build('sub-app', 'westeurope');
    expect(evaluateSubmission(submission, wrongScope, 1).correct).toBe(false);
  });
  it('retains first errors, assistance and retry classification without importing success', () => {
    let save = freshServices();
    for (const e of [
      { kind: 'begin', boundary: null, attemptNumber: 1 },
      { kind: 'aid' },
      { kind: 'draft', answers: { webModel: 'iaas' } },
      { kind: 'submit', through: 'portal-3' },
      { kind: 'begin', boundary: 'portal-3', attemptNumber: 1 },
      { kind: 'draft', answers: { webModel: 'paas' } },
      { kind: 'submit', through: 'portal-4' },
    ])
      save = applyModuleEvent(save, e)!;
    const facts = serviceFacts(save);
    expect(facts.submissions).toHaveLength(2);
    expect(facts.submissions[0]!.assisted).toBe(true);
    expect(facts.submissions[0]!.answers.webModel).toBe('iaas');
    expect(restoreServices(JSON.stringify({ ...save, correct: true })).issue).toBe('corrupt');
    expect(restoreServices(JSON.stringify(save)).save).toEqual(save);
    expect(restoreServices(JSON.stringify({ ...save, content: '2.0.0' })).issue).toBe(
      'unsupported',
    );
    expect(restoreServices('{')).toMatchObject({ issue: 'corrupt' });
  });
  it('retains an abandoned attempt without inventing success or replacing the first record', () => {
    let save = applyModuleEvent(freshServices(), {
      kind: 'begin',
      boundary: null,
      attemptNumber: 1,
    })!;
    save = applyModuleEvent(save, { kind: 'abandon' })!;
    const facts = serviceFacts(save);
    expect(facts.active).toBe(false);
    expect(facts.submissions[0]!.abandoned).toBe(true);
    expect(evaluateSubmission(facts.submissions[0]!, build(), 1).correct).toBe(false);
    expect(
      applyModuleEvent(save, { kind: 'begin', boundary: null, attemptNumber: 2 }),
    ).not.toBeNull();
    expect(restoreServices(JSON.stringify(save)).save).toEqual(save);
    expect(
      applyModuleEvent(freshServices(), { kind: 'begin', boundary: null, attemptNumber: 0 }),
    ).toBeNull();
  });
  it('persists only validated observations and stops stale writes without touching old keys', () => {
    const memory = new Map<string, string>([['azurelab.progress.v1', 'prior-awards']]);
    const storage = {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => {
        memory.set(k, v);
      },
      removeItem: (k: string) => {
        memory.delete(k);
      },
    };
    const a = new ServiceStore(storage),
      b = new ServiceStore(storage);
    a.load();
    b.load();
    expect(a.event({ kind: 'compare', model: 'iaas' })).toBe(true);
    expect(b.event({ kind: 'compare', model: 'paas' })).toBe(false);
    expect(b.getSnapshot().issue).toBe('conflict');
    expect(memory.get('azurelab.progress.v1')).toBe('prior-awards');
    const denied = new ServiceStore({
      ...storage,
      getItem: () => {
        throw Error('denied');
      },
      setItem: () => {
        throw Error('denied');
      },
    });
    denied.load();
    expect(denied.event({ kind: 'begin', boundary: null, attemptNumber: 1 })).toBe(true);
    expect(denied.getSnapshot().issue).toBe('unsaved');
    expect(serviceFacts(denied.getSnapshot().save).submissions).toHaveLength(0);
  });
});
