'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import type { Snapshot, Request, Receipt, Entry, Command } from '@/laboratory/engine';
import {
  laboratoryModel,
  nsgEditable,
  firewallEditable,
  type RuleChange,
} from '@/laboratory/v36/contract';
import { laboratoryRemediationNb as t } from '@/content/laboratory-remediation-nb';
import { laboratoryNetworkNb as n } from '@/content/laboratory-networking-nb';
import { laboratoryFirewallNb as f } from '@/content/laboratory-firewall-nb';
import { PortalDialog, PropertyList } from '@/features/portal/shared';
import {
  PortalCreateLayout,
  PortalCreateActions,
  PortalTable,
} from '@/features/portal/presentation';
import './rule-lifecycle.css';
type Href = (view: string, id?: string, receipt?: string) => string;
type Review = { workspace: string; revision: number; preview: Receipt };
type Editor = {
  mode: 'edit' | 'delete';
  workspace: string;
  model: string;
  revision: number;
  id: string;
  name: string;
  parentId: string;
  nsg: boolean;
};
const fieldLabel = (key: string) => n.fields[key as keyof typeof n.fields] ?? key;
export const lifecycleMessage = (code: string) =>
  code === 'read-only-rule'
    ? t.readonly
    : code === 'no-change'
      ? t.noChange
      : code === 'stale-revision' || code === 'workspace-changed'
        ? t.stale
        : code === 'incompatible-association'
          ? t.parentMismatch
          : code === 'invalid-parent'
            ? t.missingRule
            : Object.hasOwn(n.codes, code)
              ? n.codes[code as keyof typeof n.codes]
              : Object.hasOwn(f.codes, code)
                ? f.codes[code as keyof typeof f.codes]
                : t.invalid;
export function RuleDiff({ change }: { change: RuleChange }) {
  return (
    <PortalTable
      caption={t.diff}
      rows={Object.entries(change.before).map(([id, before]) => ({
        id,
        before,
        after: change.after?.[id],
      }))}
      columns={[
        { key: 'field', label: t.field, cell: (r) => fieldLabel(r.id) },
        { key: 'before', label: t.before, cell: (r) => String(r.before) },
        {
          key: 'after',
          label: t.after,
          cell: (r) => (change.after === null ? t.removed : String(r.after)),
        },
      ]}
    />
  );
}
/** Presentation state only. All Review and Save requests use the parent's original API/command path. */
export function RuleLifecycle({
  snapshot,
  view,
  id,
  href,
  disabled,
  review,
  commit,
}: {
  snapshot: Snapshot;
  view: string;
  id: string;
  href: Href;
  disabled: boolean;
  review: (request: Request, workspace: string) => Promise<Review>;
  commit: (request: Request, workspace: string) => Promise<void>;
}) {
  const [editor, setEditor] = useState<Editor | null>(null),
    [values, setValues] = useState<Record<string, string>>({}),
    [preview, setPreview] = useState<{ request: Request; receipt: Receipt } | null>(null),
    [confirm, setConfirm] = useState(false),
    [working, setWorking] = useState(false),
    [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null),
    fields = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    if (preview) heading.current?.focus();
    else if (editor?.mode === 'edit')
      fields.current?.querySelector<HTMLInputElement | HTMLSelectElement>('input, select')?.focus();
  }, [preview, editor]);
  if (snapshot.world.model !== laboratoryModel) return null;
  const world = snapshot.world,
    nsg = view === 'rule',
    rule = nsg
      ? world.securityRules.find((r) => r.id === id)
      : world.firewallRules.find((r) => r.id === id);
  const latest = snapshot.entries.findLast(
    (e) => e.receipt.outcome === 'accepted' && e.receipt.change?.id === id,
  );
  const stale =
    !!editor &&
    (editor.workspace !== snapshot.workspace ||
      editor.model !== world.model ||
      editor.revision !== world.revision ||
      !rule);
  const open = (mode: Editor['mode']) => {
    if (!rule) return;
    setEditor({
      mode,
      workspace: snapshot.workspace,
      model: world.model,
      revision: world.revision,
      id: rule.id,
      name: rule.name,
      parentId: 'nsgId' in rule ? rule.nsgId : rule.collectionId,
      nsg,
    });
    setValues(
      Object.fromEntries(
        (nsg ? nsgEditable : firewallEditable).map((k) => [
          k,
          String((rule as unknown as Record<string, unknown>)[k]),
        ]),
      ),
    );
    setPreview(null);
    setConfirm(false);
    setError('');
  };
  const inspect = async () => {
    if (!editor) return;
    setWorking(true);
    setError('');
    const type = editor.nsg
      ? editor.mode === 'edit'
        ? 'UpdateSecurityRule'
        : 'DeleteSecurityRule'
      : editor.mode === 'edit'
        ? 'UpdateFirewallNetworkRule'
        : 'DeleteFirewallNetworkRule';
    const request: Request = {
      commandId: crypto.randomUUID(),
      expectedRevision: editor.revision,
      command: {
        type,
        ruleId: editor.id,
        ...(editor.nsg ? { nsgId: editor.parentId } : { collectionId: editor.parentId }),
        ...(editor.mode === 'edit' ? values : {}),
      } as Command,
    };
    try {
      const r = await review(request, editor.workspace);
      if (r.workspace !== editor.workspace) throw Error(t.stale);
      if (
        r.preview.outcome === 'accepted' &&
        (r.revision !== editor.revision ||
          r.preview.change?.id !== editor.id ||
          r.preview.change.parentId !== editor.parentId)
      )
        throw Error(t.unavailable);
      setPreview({ request, receipt: r.preview });
    } catch (e) {
      setError(e instanceof Error && e.message === t.stale ? t.stale : t.unavailable);
      setPreview(null);
    } finally {
      setWorking(false);
    }
  };
  const options = (k: string): string[] | undefined =>
    (
      ({
        direction: ['Inbound', 'Outbound'],
        protocol: nsg ? ['Tcp', 'Udp', '*'] : ['Tcp', 'Udp'],
        access: ['Allow', 'Deny'],
      }) as Record<string, string[]>
    )[k];
  return (
    <section className="lab-rule-lifecycle" aria-label={t.edit}>
      {rule && (
        <>
          <div className="portal-toolbar">
            <button disabled={disabled} onClick={() => open('edit')}>
              {t.edit}
            </button>
            <button disabled={disabled} onClick={() => open('delete')}>
              {t.remove}
            </button>
            {latest && (
              <Link href={href('history', undefined, latest.receipt.commandId)}>{t.latest}</Link>
            )}
          </div>
          {!nsg && <p>{t.nested}</p>}
        </>
      )}
      {editor && (
        <PortalDialog
          title={editor.mode === 'edit' ? t.editing : t.deleting}
          onClose={() => {
            if (!working) setEditor(null);
          }}
        >
          <PortalCreateLayout
            className="lab-rule-editor"
            intro={editor.mode === 'edit' ? t.immutable : t.deleteNote}
          >
            <PropertyList
              items={[
                [t.name, editor.name],
                [t.identity, editor.id],
                [t.scope, editor.parentId],
                [t.workspace, editor.workspace],
                [t.model, editor.model],
                [t.revision, editor.revision],
              ]}
            />
            {stale && <p role="alert">{t.stale}</p>}
            {error && <p role="alert">{error}</p>}
            <form
              hidden={preview?.receipt.outcome === 'accepted'}
              onSubmit={(e) => {
                e.preventDefault();
                void inspect();
              }}
            >
              {editor.mode === 'edit' && (
                <fieldset ref={fields} disabled={working || disabled} className="lab-rule-fields">
                  <legend>{t.editing}</legend>
                  {(editor.nsg ? nsgEditable : firewallEditable).map((k) => (
                    <label key={k}>
                      {fieldLabel(k)}
                      {options(k) ? (
                        <select
                          aria-label={fieldLabel(k)}
                          value={values[k] ?? ''}
                          onChange={(e) => {
                            setValues({ ...values, [k]: e.target.value });
                            setPreview(null);
                          }}
                        >
                          {options(k)!.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          required
                          maxLength={120}
                          aria-label={fieldLabel(k)}
                          value={values[k] ?? ''}
                          onChange={(e) => {
                            setValues({ ...values, [k]: e.target.value });
                            setPreview(null);
                          }}
                        />
                      )}
                    </label>
                  ))}
                </fieldset>
              )}
              <button type="submit" disabled={working || disabled || stale}>
                {t.review}
              </button>
            </form>
            <p>{t.reviewNote}</p>
            {preview && (
              <section className="lab-rule-review">
                <h3 tabIndex={-1} ref={heading}>
                  {t.review}
                </h3>
                {preview.receipt.outcome === 'accepted' && preview.receipt.change ? (
                  <RuleDiff change={preview.receipt.change} />
                ) : (
                  <p role="alert">
                    {lifecycleMessage(preview.receipt.code)}{' '}
                    {preview.receipt.field && fieldLabel(preview.receipt.field)}
                  </p>
                )}
                {editor.mode === 'delete' && (
                  <label className="lab-rule-confirm">
                    <input
                      type="checkbox"
                      checked={confirm}
                      onChange={(e) => setConfirm(e.target.checked)}
                    />{' '}
                    <span>
                      {t.confirm} {editor.name} · {editor.id}
                    </span>
                  </label>
                )}
                {preview.receipt.outcome === 'accepted' && editor.mode === 'edit' && (
                  <button disabled={working || disabled} onClick={() => setPreview(null)}>
                    {t.backEdit}
                  </button>
                )}
              </section>
            )}
            <PortalCreateActions>
              <button
                disabled={
                  working ||
                  disabled ||
                  stale ||
                  preview?.receipt.outcome !== 'accepted' ||
                  (editor.mode === 'delete' && !confirm)
                }
                onClick={() => {
                  if (preview) {
                    setWorking(true);
                    void commit(preview.request, editor.workspace).finally(() => {
                      setWorking(false);
                      setEditor(null);
                    });
                  }
                }}
              >
                {editor.mode === 'edit' ? t.save : t.remove}
              </button>
              <button disabled={working} onClick={() => setEditor(null)}>
                {t.cancel}
              </button>
            </PortalCreateActions>
          </PortalCreateLayout>
        </PortalDialog>
      )}
    </section>
  );
}
export function RuleHistory({
  entry,
  snapshot,
  href,
  read,
}: {
  entry: Entry;
  snapshot: Snapshot;
  href: Href;
  read: (through: number) => Promise<Snapshot>;
}) {
  const [pair, setPair] = useState<[Snapshot, Snapshot] | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const change = entry.receipt.change;
  if (!change) return null;
  const verify = async () => {
    setBusy(true);
    setError('');
    setPair(null);
    try {
      const [a, b] = await Promise.all([
        read(entry.receipt.sequence - 1),
        read(entry.receipt.sequence),
      ]);
      if (
        a.workspace !== snapshot.workspace ||
        b.workspace !== snapshot.workspace ||
        a.world.model !== snapshot.world.model ||
        b.world.model !== snapshot.world.model ||
        a.entries.length !== entry.receipt.sequence - 1 ||
        b.entries.length !== entry.receipt.sequence ||
        a.world.revision !== entry.receipt.beforeRevision ||
        b.world.revision !== entry.receipt.afterRevision
      )
        throw Error('unverifiable');
      setPair([a, b]);
    } catch {
      setError(t.historyUnavailable);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="lab-rule-history">
      <h3>{t.operations[entry.receipt.operation as keyof typeof t.operations]}</h3>
      <PropertyList
        items={[
          [t.name, change.name],
          [t.identity, change.id],
          [t.scope, change.parentId],
          [t.workspace, snapshot.workspace],
          [t.model, entry.model],
        ]}
      />
      <RuleDiff change={change} />
      <p>
        <Link href={href('history', undefined, change.createOrigin)}>{t.original}</Link> ·{' '}
        <Link
          href={href(
            entry.receipt.operation.includes('Firewall') ? 'firewallCollection' : 'nsg',
            change.parentId,
          )}
        >
          {t.parent} · {change.parentId}
        </Link>
      </p>
      <button disabled={busy} onClick={() => void verify()}>
        {t.verify}
      </button>
      {error && <p role="status">{error}</p>}
      {pair && (
        <>
          <p role="status">{t.verified}</p>
          {pair.map((s, i) => {
            const row =
              s.world.model === laboratoryModel
                ? [...s.world.securityRules, ...s.world.firewallRules].find(
                    (r) => r.id === change.id,
                  )
                : undefined;
            return (
              <details key={i}>
                <summary>
                  {i === 0 ? t.beforeState : t.afterState} · {s.entries.length} · {s.world.model} ·{' '}
                  {s.world.revision}
                </summary>
                {row ? <pre>{JSON.stringify(row, null, 2)}</pre> : <p>{t.missingHistoricalRule}</p>}
              </details>
            );
          })}
        </>
      )}
    </section>
  );
}
