import { afterAll, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import { existsSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { Client, Pool } from 'pg';
import { Repository } from './laboratory/v3/repository';
import { handle } from './laboratory/v3/server';
import {
  canonical,
  execute,
  replay,
  type Request,
  type Snapshot,
  type Model,
} from './laboratory/engine';
import { courseModel, parseCapture, type CourseBinding } from './laboratory/course/contract';
if (existsSync('.env.local')) process.loadEnvFile('.env.local');
const url = process.env.LAB_TEST_DATABASE_URL!,
  adminUrl = process.env.LAB_TEST_ADMIN_DATABASE_URL!;
if (
  ![url, adminUrl].every(
    (s) =>
      s &&
      ['localhost', '127.0.0.1'].includes(new URL(s).hostname) &&
      /^\/azurelab_lab_test_[a-z0-9_]+$/.test(new URL(s).pathname),
  )
)
  throw Error('Isolated local PostgreSQL required, never skip');
vi.stubEnv('LAB_DATABASE_URL', url);
vi.stubEnv('LAB_ORIGIN', 'http://127.0.0.1:3000');
const pool = new Pool({ connectionString: url, max: 5 }),
  course = new Repository(pool, undefined, 'course-technical'),
  free = new Repository(pool);
afterAll(async () => {
  await pool.end();
  vi.unstubAllEnvs();
});
const request = (revision = 0, name = 'rg-course', commandId = randomUUID()): Request => ({
  commandId,
  expectedRevision: revision,
  command: {
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name,
    metadataRegion: 'norwayeast',
  },
});
const binding = (s: Snapshot) => (s as Snapshot & { courseBinding: CourseBinding }).courseBinding;
const capture = (s: Snapshot) => ({
  captureId: randomUUID(),
  expectedRevision: s.world.revision,
  through: s.entries.length,
});
it('binds a fixed server-owned course context atomically; identical free/course commands use one original engine and receipt', async () => {
  const a = await course.createSession(courseModel),
    b = await free.createSession(courseModel),
    r = request();
  expect(binding(a.snapshot)).toMatchObject({
    adapter: 'course-workspace@1',
    profile: 'az900-technical@1',
    course: 'az900',
    model: courseModel,
    workspace: a.snapshot.workspace,
    startThrough: 0,
    learningAttempt: null,
  });
  expect(binding(b.snapshot)).toBeUndefined();
  const reviewed = await course.review(a.token, r, a.snapshot.workspace);
  expect((await course.read(a.token)).entries).toEqual([]);
  const ca = await course.command(a.token, r, a.snapshot.workspace),
    fb = await free.command(b.token, r, b.snapshot.workspace);
  expect(ca.receipt).toEqual(fb.receipt);
  expect(ca.world).toEqual(fb.world);
  expect(ca.receipt).toEqual(execute(a.snapshot.world, r, 1).receipt);
  expect(reviewed.preview).toEqual(ca.receipt);
  expect(await course.read(a.token)).toMatchObject({
    world: ca.world,
    entries: ca.entries,
    courseBinding: binding(a.snapshot),
  });
  await expect(course.createSession('laboratory@3.7.0')).rejects.toMatchObject({
    code: 'unsupported-course-model',
  });
});
it('rejects cross-purpose bearer tokens and foreign workspace preconditions, including reset', async () => {
  const a = await course.createSession(courseModel),
    b = await free.createSession(courseModel),
    other = await course.createSession(courseModel);
  await expect(course.read(b.token)).rejects.toMatchObject({ code: 'session-required' });
  await expect(free.read(a.token)).rejects.toMatchObject({ code: 'session-required' });
  await expect(course.command(a.token, request(), other.snapshot.workspace)).rejects.toMatchObject({
    code: 'workspace-changed',
  });
  await expect(
    free.command(
      a.token,
      { ...request(), command: { type: 'ResetWorkspace' } },
      a.snapshot.workspace,
    ),
  ).rejects.toMatchObject({ code: 'session-required' });
  expect((await course.read(a.token)).entries).toEqual([]);
  expect((await free.read(b.token)).entries).toEqual([]);
});
it('captures only original committed evidence, preserves prefix after reset, and resolves idempotently without copying World or receipts', async () => {
  const a = await course.createSession(courseModel),
    created = await course.command(a.token, request(), a.snapshot.workspace),
    input = capture(created);
  const [one, two] = await Promise.all([
    course.captureEvidence(a.token, input, created.workspace),
    course.captureEvidence(a.token, input, created.workspace),
  ]);
  expect(one.evidence).toEqual(two.evidence);
  expect([one.redelivered, two.redelivered].sort()).toEqual([false, true]);
  expect(one.snapshot.world).toEqual(created.world);
  expect(one.snapshot.entries).toEqual(created.entries);
  const before = await course.read(a.token);
  await course.command(
    a.token,
    {
      commandId: randomUUID(),
      expectedRevision: before.world.revision,
      command: { type: 'ResetWorkspace' },
    },
    a.snapshot.workspace,
  );
  const historical = await course.readEvidence(a.token, one.evidence.id, a.snapshot.workspace);
  expect(historical.evidence).toEqual(one.evidence);
  expect(historical.snapshot.world).toEqual(created.world);
  expect(historical.snapshot.historical).toBe(true);
  expect(replay(historical.snapshot.entries, courseModel)).toEqual(created.world);
  expect((await course.read(a.token)).world.groups).toEqual([]);
  expect((await course.read(a.token)).entries).toHaveLength(2);
  expect((await course.captureEvidence(a.token, input, created.workspace)).evidence).toEqual(
    one.evidence,
  );
  await expect(
    course.captureEvidence(a.token, { ...input, through: 0 }, created.workspace),
  ).rejects.toMatchObject({ code: 'capture-id-conflict' });
  await expect(
    course.captureEvidence(a.token, { ...input, captureId: randomUUID() }, created.workspace),
  ).rejects.toMatchObject({ code: 'stale-revision' });
});
it('rejects fabricated, missing, foreign and tampered evidence; evidence read never appends technical events', async () => {
  const a = await course.createSession(courseModel),
    b = await course.createSession(courseModel),
    s = await course.command(a.token, request(), a.snapshot.workspace),
    input = capture(s);
  for (const extra of [
    { world: s.world },
    { entries: s.entries },
    { receipt: s.entries[0]!.receipt },
    { score: 100 },
    { course: 'az104' },
  ]) {
    expect(parseCapture({ ...input, ...extra })).toBeNull();
    await expect(
      course.captureEvidence(a.token, { ...input, ...extra }, s.workspace),
    ).rejects.toMatchObject({ code: 'invalid-evidence-request' });
  }
  const saved = await course.captureEvidence(a.token, input, s.workspace);
  await expect(
    course.readEvidence(b.token, saved.evidence.id, b.snapshot.workspace),
  ).rejects.toMatchObject({ code: 'evidence-not-found' });
  await expect(
    course.captureEvidence(
      b.token,
      { ...input, expectedRevision: 0, through: 0 },
      b.snapshot.workspace,
    ),
  ).rejects.toMatchObject({
    code: 'capture-id-conflict',
  });
  await expect(course.readEvidence(a.token, randomUUID(), s.workspace)).rejects.toMatchObject({
    code: 'evidence-not-found',
  });
  await expect(
    course.captureEvidence(a.token, { ...capture(s), through: 400 }, s.workspace),
  ).rejects.toMatchObject({ code: 'invalid-through' });
  const owner = new Client({ connectionString: adminUrl });
  await owner.connect();
  try {
    for (const statement of [
      'UPDATE laboratory_v3.course_bindings SET course=course WHERE workspace_id=$1',
      'DELETE FROM laboratory_v3.course_evidence WHERE workspace_id=$1',
      "UPDATE laboratory_v3.workspaces SET purpose='free' WHERE id=$1",
    ])
      await expect(owner.query(statement, [s.workspace])).rejects.toThrow();
    await expect(
      pool.query('ALTER TABLE laboratory_v3.course_evidence ADD COLUMN nope text'),
    ).rejects.toThrow();
    // Deliberate corrupt-admin fixture in an isolated session; not a positive World injection.
    await owner.query(
      "UPDATE laboratory_v3.workspaces SET world=jsonb_set(world,'{revision}','999') WHERE id=$1",
      [s.workspace],
    );
    await expect(
      course.readEvidence(a.token, saved.evidence.id, s.workspace),
    ).rejects.toMatchObject({ code: 'unverifiable-history' });
  } finally {
    await owner.end();
  }
  expect((await course.read(b.token)).entries).toEqual([]);
});
it('serializes simultaneous course writes and preserves original idempotent receipt with stale denial and rollback', async () => {
  const a = await course.createSession(courseModel),
    ra = request(0, 'one'),
    rb = request(0, 'two');
  const results = await Promise.all([
    course.command(a.token, ra, a.snapshot.workspace),
    course.command(a.token, rb, a.snapshot.workspace),
  ]);
  expect(results.map((x) => x.receipt.code).sort()).toEqual(['created', 'stale-revision']);
  const saved = await course.read(a.token);
  expect(saved.world.groups).toHaveLength(1);
  expect(saved.entries).toHaveLength(2);
  const accepted = results.find((x) => x.receipt.outcome === 'accepted')!,
    original = accepted.entries.find((x) => x.receipt.outcome === 'accepted')!.request;
  expect((await course.command(a.token, original, saved.workspace)).receipt).toEqual(
    accepted.receipt,
  );
  await expect(
    course.command(
      a.token,
      { ...original, command: { ...original.command, name: 'changed' } as Request['command'] },
      saved.workspace,
    ),
  ).rejects.toMatchObject({ code: 'command-id-conflict' });
  const fail = new Repository(
    pool,
    () => {
      throw Error('Controlled abort before commit');
    },
    'course-technical',
  );
  await expect(
    fail.command(a.token, request(saved.world.revision, 'rolled-back'), saved.workspace),
  ).rejects.toThrow('Controlled abort');
  const abortedCapture = capture(saved);
  await expect(fail.captureEvidence(a.token, abortedCapture, saved.workspace)).rejects.toThrow(
    'Controlled abort',
  );
  await expect(
    course.readEvidence(a.token, abortedCapture.captureId, saved.workspace),
  ).rejects.toMatchObject({ code: 'evidence-not-found' });
  expect(await course.read(a.token)).toEqual(saved);
  await expect(fail.createSession(courseModel)).rejects.toThrow('Controlled abort');
});
it('HTTP rejects temporary client histories, cross-origin and cross-purpose cookies and never silently falls back', async () => {
  const a = await course.createSession(courseModel),
    b = await free.createSession(courseModel);
  const call = (
    action: Parameters<typeof handle>[1],
    value?: unknown,
    cookie = a.token,
    extra: Record<string, string> = {},
  ) =>
    handle(
      new globalThis.Request('http://127.0.0.1:3000/api/course-laboratory/' + action, {
        method: value === undefined ? 'GET' : 'POST',
        headers: {
          Origin: 'http://127.0.0.1:3000',
          Cookie: 'azurelab_course_lab_v1=' + cookie,
          'Content-Type': 'application/json',
          'If-Laboratory-Workspace': a.snapshot.workspace,
          ...extra,
        },
        ...(value === undefined ? {} : { body: JSON.stringify(value) }),
      }),
      action,
      'course-technical',
    );
  const state = await call('state');
  expect(state.status).toBe(200);
  expect((await state.json()).courseBinding).toEqual(binding(a.snapshot));
  expect((await call('state', undefined, b.token)).status).toBe(401);
  expect(
    (await call('command', request(), a.token, { Origin: 'https://foreign.example' })).status,
  ).toBe(403);
  expect((await call('session', { newWorkspace: true })).status).toBe(422);
  expect((await call('session', { model: 'laboratory@3.7.0' })).status).toBe(422);
  for (const payload of [
    { ...capture(a.snapshot), world: a.snapshot.world },
    { entries: [], world: a.snapshot.world },
    { ...capture(a.snapshot), receipt: { outcome: 'accepted' } },
  ])
    expect((await call('evidence', payload)).status).toBe(400);
  const p = capture(a.snapshot),
    answer = await call('evidence', p);
  expect(answer.status).toBe(200);
  expect(answer.headers.get('Cache-Control')).toBe('no-store');
  const id = (await answer.json()).evidence.id;
  const got = await handle(
    new globalThis.Request('http://127.0.0.1:3000/api/course-laboratory/evidence?id=' + id, {
      headers: {
        Cookie: 'azurelab_course_lab_v1=' + a.token,
        'If-Laboratory-Workspace': a.snapshot.workspace,
      },
    }),
    'evidence',
    'course-technical',
  );
  expect(got.status).toBe(200);
  expect((await course.read(a.token)).entries).toEqual([]);
  vi.stubEnv('LAB_DATABASE_URL', '');
  try {
    expect((await call('state')).status).toBe(503);
  } finally {
    vi.stubEnv('LAB_DATABASE_URL', url);
  }
});
it('course route and policy reads reuse existing server dispatch and cannot append events or evidence', async () => {
  const a = await course.createSession(courseModel);
  const commands: Request['command'][] = [
    request().command,
    {
      type: 'CreateVirtualNetwork',
      groupId: 'group-1',
      name: 'vnet-course',
      region: 'norwayeast',
      addressSpace: '10.10.0.0/16',
    },
    { type: 'CreateSubnet', vnetId: 'vnet-2', name: 'snet-course', addressPrefix: '10.10.1.0/24' },
    ...['10.10.1.10', '10.10.1.11'].map((privateIpAddress, i) => ({
      type: 'CreateNetworkInterface' as const,
      groupId: 'group-1',
      region: 'norwayeast',
      vnetId: 'vnet-2',
      subnetId: 'subnet-3',
      name: 'nic-' + i,
      allocation: 'Static' as const,
      privateIpAddress,
    })),
  ];
  let s = a.snapshot;
  for (const command of commands) {
    const result = await course.command(
      a.token,
      { commandId: randomUUID(), expectedRevision: s.world.revision, command },
      s.workspace,
    );
    expect(result.receipt.outcome).toBe('accepted');
    s = result;
  }
  for (const [action, query] of [
    ['analysis', 'subnetId=subnet-3&destination=10.10.1.11'],
    [
      'policy-analysis',
      'sourceNicId=nic-4&destinationNicId=nic-5&protocol=Tcp&sourcePort=50000&destinationPort=1433',
    ],
  ] as const) {
    const response = await handle(
      new globalThis.Request(
        'http://127.0.0.1:3000/api/course-laboratory/' + action + '?' + query,
        {
          headers: {
            Cookie: 'azurelab_course_lab_v1=' + a.token,
            'If-Laboratory-Workspace': s.workspace,
          },
        },
      ),
      action,
      'course-technical',
    );
    expect(response.status).toBe(200);
    const answer = await response.json();
    expect(answer.world).toEqual(s.world);
    expect(answer.analysis.workspace).toBe(s.workspace);
    expect(answer.analysis.revision).toBe(s.world.revision);
    expect(answer.courseBinding).toEqual(binding(a.snapshot));
  }
  expect(await course.read(a.token)).toMatchObject({ world: s.world, entries: s.entries });
  expect(
    (
      await pool.query(
        'SELECT count(*)::integer AS n FROM laboratory_v3.course_evidence WHERE workspace_id=$1',
        [s.workspace],
      )
    ).rows[0].n,
  ).toBe(0);
});
it.each(['cold', 'populated3.9'] as const)(
  '011 %s/repeated setup preserves original 3.0–3.9 events and immutable course authority',
  async (kind) => {
    const admin = new Client({ connectionString: adminUrl });
    await admin.connect();
    const name = 'azurelab_lab_test_course_' + randomUUID().replaceAll('-', '').slice(0, 10);
    await admin.query(`CREATE DATABASE "${name}"`);
    const ownUrl = new URL(adminUrl),
      runUrl = new URL(url);
    ownUrl.pathname = runUrl.pathname = '/' + name;
    const owner = new Client({ connectionString: ownUrl.href }),
      runtime = new Pool({ connectionString: runUrl.href, max: 3 });
    await owner.connect();
    const apply = async (files: string[]) => {
      for (const file of files)
        await owner.query(readFileSync('database/laboratory-v3/' + file, 'utf8'));
    };
    try {
      await apply(['001.sql', '002-networking.sql', '010-integrated-application-chain.sql']);
      const localFree = new Repository(runtime),
        localCourse = new Repository(runtime, undefined, 'course-technical'),
        saved: { token: string; snapshot: Snapshot }[] = [];
      if (kind === 'populated3.9')
        for (let minor = 0; minor <= 9; minor++) {
          const a = await localFree.createSession(`laboratory@3.${minor}.0` as Model),
            r = await localFree.command(a.token, request(), a.snapshot.workspace);
          saved.push({
            token: a.token,
            snapshot: {
              workspace: r.workspace,
              world: r.world,
              entries: r.entries,
              historical: r.historical,
            },
          });
        }
      const before = (
          await owner.query(
            'SELECT id,world,sequence,model FROM laboratory_v3.workspaces ORDER BY id',
          )
        ).rows,
        events = (
          await owner.query('SELECT * FROM laboratory_v3.events ORDER BY workspace_id,sequence')
        ).rows;
      await expect(localCourse.createSession(courseModel)).rejects.toThrow();
      await apply(['011-course-workspaces.sql']);
      const created = await localCourse.createSession(courseModel),
        s = await localCourse.command(created.token, request(), created.snapshot.workspace),
        evidence = await localCourse.captureEvidence(created.token, capture(s), s.workspace);
      await apply([
        '001.sql',
        '002-networking.sql',
        '010-integrated-application-chain.sql',
        '011-course-workspaces.sql',
      ]);
      expect(
        (
          await owner.query(
            'SELECT id,world,sequence,model FROM laboratory_v3.workspaces WHERE id<>$1 ORDER BY id',
            [s.workspace],
          )
        ).rows,
      ).toEqual(before);
      expect(
        (
          await owner.query(
            'SELECT * FROM laboratory_v3.events WHERE workspace_id<>$1 ORDER BY workspace_id,sequence',
            [s.workspace],
          )
        ).rows,
      ).toEqual(events);
      for (const old of saved) expect(await localFree.read(old.token)).toEqual(old.snapshot);
      expect(
        (await localCourse.readEvidence(created.token, evidence.evidence.id, s.workspace)).evidence,
      ).toEqual(evidence.evidence);
      expect(canonical(s.world)).toBe(canonical(replay(s.entries, courseModel)));
      // Isolated corrupt-admin negative fixture, never an injected positive World.
      await owner.query(
        'ALTER TABLE laboratory_v3.course_evidence DISABLE TRIGGER immutable_course_evidence',
      );
      await owner.query('UPDATE laboratory_v3.course_evidence SET history_digest=$1 WHERE id=$2', [
        '0'.repeat(64),
        evidence.evidence.id,
      ]);
      await owner.query(
        'ALTER TABLE laboratory_v3.course_evidence ENABLE TRIGGER immutable_course_evidence',
      );
      await expect(
        localCourse.readEvidence(created.token, evidence.evidence.id, s.workspace),
      ).rejects.toMatchObject({ code: 'unverifiable-course-evidence' });
    } finally {
      await runtime.end();
      await owner.end();
      await admin.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname=$1', [
        name,
      ]);
      await admin.query(`DROP DATABASE "${name}"`);
      await admin.end();
    }
  },
);
