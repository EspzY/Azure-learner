import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { execute, freshWorld, parseRequest, replay, canonical } from './laboratory/v3/domain';
import {
  laboratoryModel,
  limits,
  type Request,
  type Entry,
  type Command,
  type World,
} from './laboratory/v3/contract';
const request = (command: unknown, revision = 0, id = 'case'): Request =>
  ({ commandId: id, expectedRevision: revision, command }) as Request;
function chain() {
  let w = freshWorld();
  const entries: Entry[] = [];
  const send = (command: Command) => {
    const r = request(command, w.revision, `case-${entries.length}`);
    const result = execute(w, r, entries.length + 1);
    entries.push({
      model: laboratoryModel,
      attempt: w.attempt,
      request: r,
      receipt: result.receipt,
    });
    w = result.world;
    return result;
  };
  send({
    type: 'CreateGroup',
    subscriptionId: 'sub-shared',
    name: 'rg-storage',
    metadataRegion: 'norwayeast',
  });
  send({
    type: 'CreateStorageAccount',
    groupId: 'group-1',
    name: 'labstorage123',
    region: 'westeurope',
    kind: 'StorageV2',
    sku: 'Standard_LRS',
  });
  send({
    type: 'CreateBlobContainer',
    accountId: 'storage-2',
    name: 'private-reports',
    access: 'private',
  });
  return {
    get world() {
      return w;
    },
    entries,
    send,
  };
}
describe('isolated server Laboratory3 finite deterministic domain', () => {
  it('creates actual RG/account/private container/escaped-text data with derived metadata and original receipts', () => {
    const f = chain(),
      text = '<script>alert(1)</script> ÆØÅ 😀';
    const result = f.send({
      type: 'CreateTextBlob',
      containerId: 'container-3',
      name: 'report.txt',
      text,
      contentType: 'text/plain',
    });
    expect(result.receipt.outcome).toBe('accepted');
    expect(f.world.blobs[0]).toMatchObject({
      id: 'blob-4',
      containerId: 'container-3',
      byteLength: Buffer.byteLength(text),
      sha256: createHash('sha256').update(text).digest('hex'),
      text,
      origin: 'case-3',
    });
    for (let n = 0; n <= f.entries.length; n++) expect(replay(f.entries, n)?.revision).toBe(n);
    expect(replay(f.entries)).toEqual(f.world);
  });
  it.each(['ab', 'a'.repeat(25), 'Abc', 'abc-xyz', ' abc', 'abc.'])(
    'rejects account name %s atomically',
    (name) => {
      const f = chain(),
        before = structuredClone(f.world),
        r = execute(
          before,
          request(
            {
              type: 'CreateStorageAccount',
              groupId: 'group-1',
              name,
              region: 'norwayeast',
              kind: 'StorageV2',
              sku: 'Standard_LRS',
            },
            before.revision,
          ),
          4,
        );
      expect(r.receipt.code).toBe('invalid-name');
      expect(r.world).toBe(before);
    },
  );
  it.each(['abc', 'a'.repeat(24), '123'])('accepts account boundary %s', (name) => {
    const f = chain();
    expect(
      f.send({
        type: 'CreateStorageAccount',
        groupId: 'group-1',
        name,
        region: 'norwayeast',
        kind: 'StorageV2',
        sku: 'Standard_LRS',
      }).receipt.code,
    ).toBe('created');
  });
  it.each(['ab', 'a'.repeat(64), '-abc', 'abc-', 'a--b', 'Aaa', '$root'])(
    'rejects container name %s',
    (name) => {
      const f = chain();
      expect(
        f.send({ type: 'CreateBlobContainer', accountId: 'storage-2', name, access: 'private' })
          .receipt.code,
      ).toBe('invalid-name');
    },
  );
  it.each(['abc', 'a'.repeat(63)])('accepts container boundary %s', (name) => {
    const f = chain();
    expect(
      f.send({ type: 'CreateBlobContainer', accountId: 'storage-2', name, access: 'private' })
        .receipt.outcome,
    ).toBe('accepted');
  });
  it.each([
    {
      type: 'CreateStorageAccount',
      groupId: 'container-3',
      name: 'other',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
    },
    { type: 'CreateBlobContainer', accountId: 'group-1', name: 'container', access: 'private' },
    {
      type: 'CreateTextBlob',
      containerId: 'storage-2',
      name: 'a',
      text: 'text',
      contentType: 'text/plain',
    },
  ])('checks actual parent type for $type', (command) => {
    const f = chain();
    expect(f.send(command as Command).receipt.code).toBe('invalid-parent');
  });
  it('rejects unknown fields/operations, public access, wrong region/profile and stale revision', () => {
    const f = chain();
    const bad = [
      [
        {
          type: 'CreateBlobContainer',
          accountId: 'storage-2',
          name: 'container',
          access: 'public',
        },
        'unsupported-profile',
      ],
      [
        {
          type: 'CreateStorageAccount',
          groupId: 'group-1',
          name: 'regionbad',
          region: 'mars',
          kind: 'StorageV2',
          sku: 'Standard_LRS',
        },
        'invalid-region',
      ],
      [
        {
          type: 'CreateStorageAccount',
          groupId: 'group-1',
          name: 'skubad',
          region: 'norwayeast',
          kind: 'StorageV2',
          sku: 'Premium_LRS',
        },
        'unsupported-profile',
      ],
      [
        {
          type: 'CreateGroup',
          name: 'another',
          subscriptionId: 'sub-shared',
          metadataRegion: 'norwayeast',
          extra: 'ignored',
        },
        'unsupported-field',
      ],
      [{ type: 'constructor' }, 'unsupported-capability'],
      [{ type: 'OverwriteBlob' }, 'unsupported-capability'],
    ] as const;
    for (const [c, code] of bad) {
      const r = execute(f.world, request(c, f.world.revision), 4);
      expect(r.receipt.code).toBe(code);
      expect(r.world).toBe(f.world);
    }
    expect(execute(f.world, request({ type: 'ResetWorkspace' }, 0), 4).receipt.code).toBe(
      'stale-revision',
    );
  });
  it('rejects duplicate namespaces but permits distinct namespaces/case-sensitive Blob names', () => {
    const f = chain();
    expect(
      f.send({
        type: 'CreateBlobContainer',
        accountId: 'storage-2',
        name: 'private-reports',
        access: 'private',
      }).receipt.code,
    ).toBe('duplicate-name');
    for (const name of ['Report', 'report'])
      expect(
        f.send({
          type: 'CreateTextBlob',
          containerId: 'container-3',
          name,
          text: 'text',
          contentType: 'text/plain',
        }).receipt.outcome,
      ).toBe('accepted');
    expect(
      f.send({
        type: 'CreateTextBlob',
        containerId: 'container-3',
        name: 'report',
        text: 'replace',
        contentType: 'text/plain',
      }).receipt.code,
    ).toBe('duplicate-name');
  });
  it('enforces text/byte/entity budgets without partial objects', () => {
    const f = chain();
    expect(
      f.send({
        type: 'CreateTextBlob',
        containerId: 'container-3',
        name: 'large',
        text: 'a'.repeat(121),
        contentType: 'text/plain',
      }).receipt.code,
    ).toBe('capacity');
    for (let n = 0; n < 22; n++)
      expect(
        f.send({
          type: 'CreateTextBlob',
          containerId: 'container-3',
          name: `b-${n}`,
          text: '界'.repeat(120),
          contentType: 'text/plain',
        }).receipt.outcome,
      ).toBe('accepted');
    const before = structuredClone(f.world);
    expect(
      f.send({
        type: 'CreateTextBlob',
        containerId: 'container-3',
        name: 'byte-over',
        text: '界'.repeat(120),
        contentType: 'text/plain',
      }).receipt.code,
    ).toBe('capacity');
    expect(f.world).toEqual(before);
    const full = {
      ...before,
      groups: Array.from({ length: 96 }, (_, n) => ({ ...before.groups[0]!, id: `full-${n}` })),
    };
    expect(
      execute(
        full,
        request(
          {
            type: 'CreateBlobContainer',
            accountId: 'storage-2',
            name: 'another',
            access: 'private',
          },
          full.revision,
        ),
        1,
      ).receipt.code,
    ).toBe('capacity');
    expect(limits.events).toBe(512);
  });
  it('explicit reset retains prior original evidence and monotonic revision/IDs', () => {
    const f = chain(),
      prior = structuredClone(f.world);
    f.send({ type: 'ResetWorkspace' });
    expect(f.world).toMatchObject({
      revision: 4,
      nextId: 4,
      attempt: 2,
      groups: [],
      accounts: [],
      containers: [],
      blobs: [],
    });
    expect(replay(f.entries, 3)).toEqual(prior);
    expect(replay(f.entries)).toEqual(f.world);
  });
  it('fails closed on malformed/oversize/surrogate input and altered/missing/unknown historical records', () => {
    for (const value of [
      null,
      { ...request({ type: 'ResetWorkspace' }), world: {} },
      request({ type: 'CreateTextBlob', text: '\ud800' }),
      request({ type: 'CreateTextBlob', text: '\0' }),
      request({ type: 'CreateTextBlob', text: 'x'.repeat(121) }),
    ])
      expect(parseRequest(value)).toBeNull();
    const f = chain(),
      bad = structuredClone(f.entries);
    bad[0]!.receipt.afterRevision = 77;
    expect(replay(bad)).toBeNull();
    expect(replay(f.entries.slice(1))).toBeNull();
    expect(replay(f.entries, 99)).toBeNull();
    expect(canonical({ a: undefined, b: 1 })).toBe(canonical({ b: 1 }));
    expect((freshWorld() as World).model).toBe(laboratoryModel);
  });
});
