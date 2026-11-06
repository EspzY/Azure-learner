'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { laboratoryV3Nb as c } from '@/content/nb';
import type { Snapshot, Request as LabRequest, Command, Receipt } from '@/laboratory/v3/contract';
import { PropertyList, PortalDialog } from '@/features/portal/shared';
import { ServiceIcon } from '@/features/portal/service-icon';
import '@/features/portal/portal.css';
import './laboratory.css';
const base = '/labs/laboratory';
const href = (view: string, id?: string, receipt?: string) =>
  base +
  '?' +
  new URLSearchParams({ view, ...(id ? { id } : {}), ...(receipt ? { receipt } : {}) });
const message = (code: string) =>
  Object.hasOwn(c.codes, code) ? c.codes[code as keyof typeof c.codes] : c.unavailable;
const label = (key: string) =>
  Object.hasOwn(c.fields, key) ? c.fields[key as keyof typeof c.fields] : key;
const operation = (key: string) =>
  Object.hasOwn(c.operations, key) ? c.operations[key as keyof typeof c.operations] : key;
async function api(action: string, request?: unknown, workspace?: string) {
  let response: Response, value;
  try {
    response = await fetch('/api/laboratory/' + action, {
      method: request === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      ...(request === undefined
        ? {}
        : {
            headers: {
              'Content-Type': 'application/json',
              ...(workspace ? { 'If-Laboratory-Workspace': workspace } : {}),
            },
            body: JSON.stringify(request),
          }),
    });
    value = await response.json();
  } catch {
    throw Error('server-result-unavailable');
  }
  if (value.error) throw Error(value.error);
  return value;
}
export function Laboratory() {
  const query = useSearchParams(),
    router = useRouter();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [form, setForm] = useState<Command['type'] | null>(null),
    [values, setValues] = useState<Record<string, string>>({}),
    [preview, setPreview] = useState<{
      receipt: Receipt;
      request: LabRequest;
      workspace: string;
    } | null>(null),
    [reset, setReset] = useState<{ workspace: string; revision: number } | null>(null),
    [pendingView, setPendingView] = useState<{ request: LabRequest; workspace: string } | null>(
      null,
    );
  const pending = useRef<{ request: LabRequest; workspace: string } | null>(null),
    channel = useRef<BroadcastChannel | null>(null),
    version = useRef(0),
    snapshotRef = useRef(snapshot),
    resultRef = useRef<HTMLHeadingElement>(null);
  const updatePending = useCallback((value: { request: LabRequest; workspace: string } | null) => {
    pending.current = value;
    setPendingView(value);
  }, []);
  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);
  useEffect(() => {
    // Route commit, not a guessed timer after push. Background refreshes retain focus.
    if (query.has('id') || query.get('view') === 'history')
      resultRef.current?.focus({ preventScroll: true });
  }, [query]);
  const accept = useCallback(
    (incoming: Snapshot) =>
      setSnapshot((previous) =>
        previous &&
        previous.workspace === incoming.workspace &&
        previous.entries.length > incoming.entries.length
          ? previous
          : incoming,
      ),
    [],
  );
  const load = useCallback(async () => {
    const v = ++version.current;
    try {
      const incoming = await api('state');
      if (v === version.current) {
        accept(incoming);
        const changed = snapshotRef.current && snapshotRef.current.workspace !== incoming.workspace;
        if (changed) {
          updatePending(null);
          setForm(null);
          setPreview(null);
          setReset(null);
          setError('workspace-changed');
        } else setError('');
        const id = pending.current?.request.commandId;
        if (id && pending.current) {
          if (pending.current.workspace !== incoming.workspace) {
            updatePending(null);
            setError('workspace-changed');
          } else if (
            incoming.entries.some(
              (e: { request: { commandId: string } }) => e.request.commandId === id,
            )
          ) {
            updatePending(null);
          } else setError('server-result-unavailable');
        }
      }
    } catch (e) {
      if (v === version.current) {
        const code = e instanceof Error ? e.message : 'server-result-unavailable';
        setError(code);
        if (code === 'session-required') {
          setSnapshot(null);
          updatePending(null);
          setForm(null);
          setPreview(null);
          setReset(null);
        }
      }
    } finally {
      if (v === version.current) setLoading(false);
    }
  }, [accept, updatePending]);
  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
    const refresh = () => {
      if (document.visibilityState === 'visible') void load();
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('azurelab.laboratory.v3.invalidate');
      channel.current = bc;
      bc.onmessage = () => {
        void load();
      };
    }
    return () => {
      version.current = -1;
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      channel.current?.close();
    };
  }, [load]);
  const run = async (request: LabRequest, workspace: string) => {
    if (snapshotRef.current?.workspace !== workspace) {
      setError('workspace-changed');
      setForm(null);
      setPreview(null);
      setReset(null);
      updatePending(null);
      return;
    }
    setBusy(true);
    updatePending({ request, workspace });
    try {
      const result = await api('command', request, workspace);
      if (snapshotRef.current?.workspace === workspace && result.workspace === workspace) {
        accept(result);
        updatePending(null);
        setError('');
        setForm(null);
        setPreview(null);
        setReset(null);
        const target = result.receipt.addedIds[0];
        const kind =
          request.command.type === 'CreateGroup'
            ? 'group'
            : request.command.type === 'CreateStorageAccount'
              ? 'account'
              : request.command.type === 'CreateBlobContainer'
                ? 'container'
                : 'blob';
        router.push(
          target && result.receipt.outcome === 'accepted'
            ? href(kind, target)
            : href('history', undefined, result.receipt.commandId),
        );
        channel.current?.postMessage('changed');
      } else {
        updatePending(null);
        setForm(null);
        setPreview(null);
        setReset(null);
        setError('workspace-changed');
      }
    } catch (e) {
      const code = e instanceof Error ? e.message : 'server-result-unavailable';
      if (
        ['command-id-conflict', 'workspace-changed', 'session-required', 'history-limit'].includes(
          code,
        )
      ) {
        updatePending(null);
        setPreview(null);
        if (code === 'workspace-changed' || code === 'session-required') {
          setForm(null);
          setReset(null);
        }
      }
      setError(code);
    } finally {
      setBusy(false);
    }
  };
  const start = async () => {
    setBusy(true);
    try {
      if (!navigator.locks) throw Error('backend-unavailable');
      await navigator.locks.request('azurelab.laboratory.v3.session', async () => {
        const incoming = await api('session', {});
        updatePending(null);
        setForm(null);
        setPreview(null);
        setReset(null);
        ++version.current;
        accept(incoming);
        setError('');
        channel.current?.postMessage('changed');
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'server-result-unavailable');
    } finally {
      setBusy(false);
      setLoading(false);
    }
  };
  const world = snapshot?.world,
    view = query.get('view') ?? 'groups',
    id = query.get('id'),
    selectedReceipt = snapshot?.entries.find((e) => e.receipt.commandId === query.get('receipt'));
  const group = world?.groups.find((r) => r.id === id),
    account = world?.accounts.find((r) => r.id === id),
    container = world?.containers.find((r) => r.id === id),
    blob = world?.blobs.find((r) => r.id === id);
  const begin = (type: Command['type']) => {
    setForm(type);
    setPreview(null);
    setValues({
      name: '',
      subscriptionId: 'sub-shared',
      metadataRegion: 'norwayeast',
      groupId: group?.id ?? world?.groups[0]?.id ?? '',
      region: 'norwayeast',
      kind: 'StorageV2',
      sku: 'Standard_LRS',
      accountId: account?.id ?? world?.accounts[0]?.id ?? '',
      access: 'private',
      containerId: container?.id ?? world?.containers[0]?.id ?? '',
      text: '',
      contentType: 'text/plain',
    });
  };
  const receiptLink = (origin: string) => (
    <Link href={href('history', undefined, origin)}>{c.receipt}</Link>
  );
  const links = (type: string, rows: { id: string; name: string; origin: string }[]) => (
    <table className="lab-table">
      <caption>
        {type === 'group'
          ? c.groups
          : type === 'account'
            ? c.accounts
            : type === 'container'
              ? c.containers
              : c.blobs}
      </caption>
      <thead>
        <tr>
          <th>{c.name}</th>
          <th>{c.id}</th>
          <th>{c.receipt}</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((r) => (
            <tr key={r.id}>
              <td>
                <Link href={href(type, r.id)}>{r.name}</Link>
              </td>
              <td>{r.id}</td>
              <td>{receiptLink(r.origin)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>{c.empty}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
  const field = (key: string, label: string, options?: [string, string][], note?: string) => (
    <label key={key}>
      {label}
      {options ? (
        <select
          value={values[key] ?? ''}
          onChange={(e) => {
            setValues({ ...values, [key]: e.target.value });
            setPreview(null);
          }}
          required
        >
          <option value="" disabled>
            —
          </option>
          {options.map(([value, title]) => (
            <option key={value} value={value}>
              {title}
            </option>
          ))}
        </select>
      ) : key === 'text' ? (
        <textarea
          maxLength={120}
          required
          value={values[key] ?? ''}
          onChange={(e) => {
            setValues({ ...values, [key]: e.target.value });
            setPreview(null);
          }}
        />
      ) : (
        <input
          required
          maxLength={key === 'name' ? 90 : 120}
          value={values[key] ?? ''}
          onChange={(e) => {
            setValues({ ...values, [key]: e.target.value });
            setPreview(null);
          }}
        />
      )}
      {note && <small>{note}</small>}
    </label>
  );
  const regions: [string, string][] = [
    ['norwayeast', 'Norway East'],
    ['westeurope', 'West Europe'],
    ['northeurope', 'North Europe'],
  ];
  const review = async () => {
    if (!world || !form || !snapshot) return;
    setBusy(true);
    const keys =
      form === 'CreateGroup'
        ? ['subscriptionId', 'name', 'metadataRegion']
        : form === 'CreateStorageAccount'
          ? ['groupId', 'name', 'region', 'kind', 'sku']
          : form === 'CreateBlobContainer'
            ? ['accountId', 'name', 'access']
            : ['containerId', 'name', 'text', 'contentType'];
    const request: LabRequest = {
      commandId: crypto.randomUUID(),
      expectedRevision: world.revision,
      command: {
        type: form,
        ...Object.fromEntries(keys.map((k) => [k, values[k] ?? ''])),
      } as Command,
    };
    try {
      const result = await api('review', request, snapshot.workspace);
      if (
        result.workspace !== snapshot.workspace ||
        snapshotRef.current?.workspace !== snapshot.workspace
      )
        throw Error('workspace-changed');
      setPreview({ receipt: result.preview, request, workspace: result.workspace });
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'server-result-unavailable');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="portal laboratory-v3">
      <a className="portal-skip" href="#lab-main">
        {c.title}
      </a>
      <header className="portal-header">
        <Link className="lab-brand" href={base}>
          AzureLab · {c.title}
        </Link>
        <span>{c.subtitle}</span>
        <Link href="/portal">{c.oldPortal}</Link>
        <Link href="/learn">{c.course}</Link>
      </header>
      <div className="portal-body">
        <aside className="portal-nav">
          <nav aria-label={c.navigation}>
            {[
              ['groups', c.groups],
              ['accounts', c.accounts],
              ['history', c.history],
            ].map(([v, label]) => (
              <Link key={v} href={href(v!)} aria-current={view === v ? 'page' : undefined}>
                {v === 'groups' && <ServiceIcon kind="groups" />}
                {label}
              </Link>
            ))}
          </nav>
          <small>{c.limits}</small>
        </aside>
        <main id="lab-main" className="portal-working">
          <div className="portal-title">
            <h1>{c.title}</h1>
            <p>{c.separation}</p>
          </div>
          <div className="portal-commandbar">
            <button
              onClick={() => {
                void load();
              }}
              disabled={busy}
            >
              {c.refresh}
            </button>
            {world && (
              <>
                <span>
                  {c.revision}: {world.revision} · {c.attempt}: {world.attempt}
                </span>
                <button
                  disabled={busy || !!error}
                  onClick={() =>
                    setReset({ workspace: snapshot!.workspace, revision: world.revision })
                  }
                >
                  {c.reset}
                </button>
              </>
            )}
          </div>
          {loading && <p role="status">{c.loading}</p>}
          {error && (
            <div role="alert" className="lab-alert">
              <p>{message(error)}</p>
              {pendingView && (
                <button
                  disabled={busy}
                  onClick={() => {
                    const action = pending.current;
                    if (action) void run(action.request, action.workspace);
                  }}
                >
                  {c.retry}
                </button>
              )}
            </div>
          )}
          {!snapshot && !loading && (
            <section>
              <p>
                {error === 'backend-unavailable' || error === 'server-result-unavailable'
                  ? c.unavailable
                  : c.startNote}
              </p>
              <button
                disabled={busy || error === 'backend-unavailable'}
                onClick={() => {
                  void start();
                }}
              >
                {c.start}
              </button>
            </section>
          )}
          {snapshot && world && (
            <>
              {form ? (
                <section className="lab-form">
                  <h2>{c.operations[form]}</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void review();
                    }}
                  >
                    <fieldset disabled={busy || !!pendingView}>
                      {field(
                        'name',
                        c.name,
                        undefined,
                        form === 'CreateStorageAccount'
                          ? c.accountLimit
                          : form === 'CreateBlobContainer'
                            ? c.containerLimit
                            : form === 'CreateTextBlob'
                              ? c.blobLimit
                              : undefined,
                      )}
                      {form === 'CreateGroup' && (
                        <>
                          {field('subscriptionId', c.subscription, [
                            ['sub-shared', 'Shared Sandbox'],
                            ['sub-app', 'App Sandbox'],
                          ])}
                          {field('metadataRegion', c.region, regions)}
                        </>
                      )}
                      {form === 'CreateStorageAccount' && (
                        <>
                          {field(
                            'groupId',
                            c.group,
                            world.groups.map((g) => [g.id, g.name]),
                          )}
                          {field('region', c.region, regions)}
                          {field('kind', c.kind, [['StorageV2', 'StorageV2']])}
                          {field('sku', c.sku, [['Standard_LRS', 'Standard_LRS']])}
                        </>
                      )}
                      {form === 'CreateBlobContainer' && (
                        <>
                          {field(
                            'accountId',
                            c.account,
                            world.accounts.map((a) => [a.id, a.name]),
                          )}
                          {field('access', c.access, [['private', 'Private']])}
                        </>
                      )}
                      {form === 'CreateTextBlob' && (
                        <>
                          {field(
                            'containerId',
                            c.container,
                            world.containers.map((a) => [a.id, a.name]),
                          )}
                          {field('text', c.text, undefined, c.textLimit)}
                          {field('contentType', c.contentType, [['text/plain', 'text/plain']])}
                        </>
                      )}
                      <button type="submit" disabled={busy}>
                        {c.review}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setForm(null);
                          setPreview(null);
                        }}
                      >
                        {c.cancel}
                      </button>
                    </fieldset>
                  </form>
                  {preview && (
                    <section className="lab-review" aria-label={c.review}>
                      <h3>{c.review}</h3>
                      <p>{c.reviewNote}</p>
                      <p>
                        {message(preview.receipt.code)}{' '}
                        {preview.receipt.field && label(preview.receipt.field)}
                      </p>
                      <PropertyList
                        items={Object.entries(preview.request.command).map(([k, v]) => [
                          label(k),
                          v,
                        ])}
                      />
                      <button
                        disabled={busy || preview.receipt.outcome !== 'accepted' || !!error}
                        onClick={() => {
                          void run(preview.request, preview.workspace);
                        }}
                      >
                        {c.create}
                      </button>
                    </section>
                  )}
                </section>
              ) : (
                <>
                  {view === 'groups' && (
                    <>
                      <button disabled={busy || !!error} onClick={() => begin('CreateGroup')}>
                        {c.newGroup}
                      </button>
                      {links('group', world.groups)}
                    </>
                  )}
                  {view === 'accounts' && (
                    <>
                      <button
                        disabled={busy || !!error || !world.groups.length}
                        onClick={() => begin('CreateStorageAccount')}
                      >
                        {c.newAccount}
                      </button>
                      {links('account', world.accounts)}
                    </>
                  )}
                  {view === 'group' && group && (
                    <>
                      <h2 ref={resultRef} tabIndex={-1}>
                        {group.name}
                      </h2>
                      <PropertyList
                        items={[
                          [c.id, group.id],
                          [c.subscription, group.subscriptionId],
                          [c.region, group.metadataRegion],
                        ]}
                      />
                      {receiptLink(group.origin)}
                      <button
                        disabled={busy || !!error}
                        onClick={() => begin('CreateStorageAccount')}
                      >
                        {c.newAccount}
                      </button>
                      {links(
                        'account',
                        world.accounts.filter((a) => a.groupId === group.id),
                      )}
                    </>
                  )}
                  {view === 'account' && account && (
                    <>
                      <h2 ref={resultRef} tabIndex={-1}>
                        {account.name}
                      </h2>
                      <PropertyList
                        items={[
                          [c.id, account.id],
                          [c.kind, account.kind],
                          [c.sku, account.sku],
                          [c.region, account.region],
                          [
                            c.group,
                            <Link href={href('group', account.groupId)} key="group">
                              {world.groups.find((g) => g.id === account.groupId)?.name}
                            </Link>,
                          ],
                          [
                            c.subscription,
                            world.groups.find((g) => g.id === account.groupId)?.subscriptionId,
                          ],
                        ]}
                      />
                      {receiptLink(account.origin)}
                      <button
                        disabled={busy || !!error}
                        onClick={() => begin('CreateBlobContainer')}
                      >
                        {c.newContainer}
                      </button>
                      {links(
                        'container',
                        world.containers.filter((x) => x.accountId === account.id),
                      )}
                    </>
                  )}
                  {view === 'container' && container && (
                    <>
                      <h2 ref={resultRef} tabIndex={-1}>
                        {container.name}
                      </h2>
                      <PropertyList
                        items={[
                          [c.id, container.id],
                          [c.access, container.access],
                          [
                            c.account,
                            <Link href={href('account', container.accountId)} key="parent">
                              {world.accounts.find((a) => a.id === container.accountId)?.name}
                            </Link>,
                          ],
                        ]}
                      />
                      {receiptLink(container.origin)}
                      <button disabled={busy || !!error} onClick={() => begin('CreateTextBlob')}>
                        {c.newBlob}
                      </button>
                      {links(
                        'blob',
                        world.blobs.filter((b) => b.containerId === container.id),
                      )}
                    </>
                  )}
                  {view === 'blob' && blob && (
                    <>
                      <h2 ref={resultRef} tabIndex={-1}>
                        {blob.name}
                      </h2>
                      <PropertyList
                        items={[
                          [c.id, blob.id],
                          [c.contentType, blob.contentType],
                          [c.bytes, blob.byteLength],
                          [c.hash, <code key="hash">{blob.sha256}</code>],
                          [
                            c.container,
                            <Link href={href('container', blob.containerId)} key="parent">
                              {world.containers.find((x) => x.id === blob.containerId)?.name}
                            </Link>,
                          ],
                        ]}
                      />
                      <pre className="lab-blob" aria-label={c.text}>
                        {blob.text}
                      </pre>
                      {receiptLink(blob.origin)}
                    </>
                  )}
                  {view === 'history' && (
                    <>
                      <h2 ref={resultRef} tabIndex={-1}>
                        {c.history}
                      </h2>
                      {selectedReceipt ? (
                        <section className="lab-result" aria-live="polite">
                          <h3>
                            {c.result} · {selectedReceipt.receipt.sequence}
                          </h3>
                          <p>
                            {selectedReceipt.receipt.outcome === 'accepted'
                              ? c.committed
                              : c.rejected}
                          </p>
                          <p>{message(selectedReceipt.receipt.code)}</p>
                          <PropertyList
                            items={[
                              [c.attempt, selectedReceipt.attempt],
                              [
                                c.revision,
                                `${selectedReceipt.receipt.beforeRevision} → ${selectedReceipt.receipt.afterRevision}`,
                              ],
                              ['commandId', selectedReceipt.receipt.commandId],
                            ]}
                          />
                          <details>
                            <summary>{c.details}</summary>
                            <pre>{JSON.stringify(selectedReceipt, null, 2)}</pre>
                          </details>
                        </section>
                      ) : query.has('receipt') ? (
                        <p role="status">{c.missing}</p>
                      ) : null}
                      <table className="lab-table">
                        <caption>{c.history}</caption>
                        <thead>
                          <tr>
                            <th>commandId</th>
                            <th>{c.result}</th>
                            <th>{c.revision}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapshot.entries.map((e) => (
                            <tr key={e.request.commandId}>
                              <td>
                                <Link href={href('history', undefined, e.request.commandId)}>
                                  {e.request.commandId}
                                </Link>
                              </td>
                              <td>
                                {operation(e.receipt.operation)} · {e.receipt.outcome}
                              </td>
                              <td>
                                {e.receipt.beforeRevision} → {e.receipt.afterRevision}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                  {(![
                    'groups',
                    'group',
                    'accounts',
                    'account',
                    'container',
                    'blob',
                    'history',
                  ].includes(view) ||
                    (view === 'group' && !group) ||
                    (view === 'account' && !account) ||
                    (view === 'container' && !container) ||
                    (view === 'blob' && !blob)) && <p role="status">{c.missing}</p>}
                </>
              )}
            </>
          )}
          {busy && <p role="status">{c.busy}</p>}
        </main>
      </div>
      {reset && world && (
        <PortalDialog title={c.resetTitle} onClose={() => setReset(null)}>
          <p>{c.resetNote}</p>
          <button
            disabled={busy}
            onClick={() => {
              void run(
                {
                  commandId: crypto.randomUUID(),
                  expectedRevision: reset.revision,
                  command: { type: 'ResetWorkspace' },
                },
                reset.workspace,
              );
            }}
          >
            {c.confirmReset}
          </button>
          <button onClick={() => setReset(null)}>{c.cancel}</button>
        </PortalDialog>
      )}
    </div>
  );
}
