'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import type { Snapshot, Request, Receipt, Command } from '@/laboratory/engine';
import {
  applicationFields,
  type ApplicationCommand,
  type ApplicationChange,
} from '@/laboratory/v38/contract';
import { analyseWebApp } from '@/laboratory/v38/analysis';
import { laboratoryApplicationNb as t } from '@/content/laboratory-application-nb';
import { PropertyList } from '@/features/portal/shared';
import {
  PortalCreateLayout,
  PortalCreateActions,
  PortalTable,
} from '@/features/portal/presentation';
type Href = (view: string, id?: string, receipt?: string) => string;
type Editor = {
  type: ApplicationCommand['type'];
  workspace: string;
  model: string;
  revision: number;
  values: Record<string, string>;
};
export function ApplicationViews({
  snapshot,
  view,
  id,
  disabled,
  list,
  receipt,
  href,
  review,
  commit,
}: {
  snapshot: Snapshot;
  view: string;
  id: string | null;
  disabled: boolean;
  list: (kind: string, rows: { id: string; name: string; origin: string }[]) => ReactNode;
  receipt: (id: string) => ReactNode;
  href: Href;
  review: (
    request: Request,
    workspace: string,
  ) => Promise<{ workspace: string; revision: number; preview: Receipt }>;
  commit: (request: Request, workspace: string) => Promise<boolean>;
}) {
  const [editor, setEditor] = useState<Editor | null>(null),
    [preview, setPreview] = useState<{ request: Request; receipt: Receipt } | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false),
    [confirmed, setConfirmed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null),
    reviewHeading = useRef<HTMLHeadingElement>(null);
  const editorIdentity = editor
    ? [editor.workspace, editor.model, editor.revision, editor.type].join(':')
    : null;
  const reviewCommandId = preview?.request.commandId;
  useEffect(() => {
    if (editorIdentity) heading.current?.focus();
  }, [editorIdentity]);
  useEffect(() => {
    if (!reviewCommandId) return;
    reviewHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    reviewHeading.current?.focus({ preventScroll: true });
  }, [reviewCommandId]);
  if (snapshot.world.model !== 'laboratory@3.8.0') return null;
  const world = snapshot.world,
    plan = world.plans.find((p) => p.id === id),
    app = world.webApps.find((a) => a.id === id),
    deployment = world.deployments.find((d) => d.id === id),
    setting = world.settings.find((s) => s.id === id);
  const owner =
    app ?? world.webApps.find((a) => a.id === (deployment?.webAppId ?? setting?.webAppId));
  const latest = snapshot.entries.findLast(
    (e) => e.receipt.outcome === 'accepted' && e.receipt.applicationChange?.id === id,
  );
  const open = (type: ApplicationCommand['type'], extra: Record<string, string> = {}) => {
    setEditor({
      type,
      workspace: snapshot.workspace,
      model: world.model,
      revision: world.revision,
      values: {
        name: '',
        groupId: world.groups[0]?.id ?? '',
        region: 'norwayeast',
        os: 'Linux',
        sku: plan?.sku ?? 'B1',
        planId: plan?.id ?? world.plans[0]?.id ?? '',
        runtime: app?.runtime ?? 'NODE|24-lts',
        httpsOnly: String(app?.httpsOnly ?? true),
        publicNetworkAccess: app?.publicNetworkAccess ?? 'Enabled',
        enabled: String(app?.enabled ?? true),
        webAppId: owner?.id ?? '',
        template: 'hello-world',
        healthPath: '/health',
        responseStatus: '200',
        value: setting?.value ?? '',
        settingId: setting?.id ?? '',
        ...extra,
      },
    });
    setError('');
    setPreview(null);
    setConfirmed(false);
  };
  const ref = (kind: string, r?: { id: string; name: string }) =>
    r ? <Link href={href(kind, r.id)}>{r.name}</Link> : '—';
  const stale =
    !!editor &&
    (editor.workspace !== snapshot.workspace ||
      editor.model !== world.model ||
      editor.revision !== world.revision);
  const options = (key: string): [string, string][] | undefined =>
    key === 'groupId'
      ? world.groups.map((g) => [g.id, `${g.name} · ${g.subscriptionId}`])
      : key === 'planId'
        ? world.plans.map((p) => [p.id, `${p.name} · ${p.region} · ${p.id}`])
        : (
            {
              region: ['norwayeast', 'westeurope', 'northeurope'],
              os: ['Linux'],
              sku: ['B1', 'P1v3'],
              runtime: ['NODE|24-lts'],
              httpsOnly: ['true', 'false'],
              enabled: ['true', 'false'],
              publicNetworkAccess: ['Enabled', 'Disabled'],
              template: ['hello-world', 'api'],
              responseStatus: ['200', '503'],
            } as Record<string, string[]>
          )[key]?.map((v) => [v, v]);
  const inspect = async () => {
    if (!editor || stale) return;
    setBusy(true);
    setError('');
    const request: Request = {
      commandId: crypto.randomUUID(),
      expectedRevision: editor.revision,
      command: {
        type: editor.type,
        ...Object.fromEntries(
          applicationFields[editor.type].map((k) => [k, editor.values[k] ?? '']),
        ),
      } as Command,
    };
    try {
      const result = await review(request, editor.workspace);
      if (result.workspace !== editor.workspace || result.revision !== editor.revision)
        throw Error(t.stale);
      setPreview({ request, receipt: result.preview });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Review unavailable');
    } finally {
      setBusy(false);
    }
  };
  if (editor)
    return (
      <PortalCreateLayout
        className="lab-form"
        intro={t.boundary}
        title={
          <h2 ref={heading} tabIndex={-1}>
            {t.operations[editor.type]}
          </h2>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void inspect();
          }}
        >
          <fieldset disabled={busy || disabled || stale}>
            {applicationFields[editor.type]
              .filter(
                (k) =>
                  !['webAppId', 'settingId', 'planId'].includes(k) ||
                  editor.type === 'CreateWebApp',
              )
              .map((key) =>
                key === 'planId' && editor.type !== 'CreateWebApp' ? null : (
                  <label key={key}>
                    {t.fields[key as keyof typeof t.fields] ?? key}
                    {options(key) ? (
                      <select
                        aria-label={t.fields[key as keyof typeof t.fields] ?? key}
                        required
                        value={editor.values[key] ?? ''}
                        onChange={(e) => {
                          setEditor({
                            ...editor,
                            values: { ...editor.values, [key]: e.target.value },
                          });
                          setPreview(null);
                        }}
                      >
                        <option value="" disabled>
                          —
                        </option>
                        {options(key)!.map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        aria-label={t.fields[key as keyof typeof t.fields] ?? key}
                        required
                        maxLength={120}
                        value={editor.values[key] ?? ''}
                        onChange={(e) => {
                          setEditor({
                            ...editor,
                            values: { ...editor.values, [key]: e.target.value },
                          });
                          setPreview(null);
                        }}
                      />
                    )}
                  </label>
                ),
              )}
            {editor.type.includes('Setting') && <p>{t.noSecrets}</p>}
            {editor.type === 'DeploySyntheticApplication' && <p>{t.deploymentBoundary}</p>}
            <button type="submit">{t.review}</button>
          </fieldset>
        </form>
        {stale && <p role="alert">{t.stale}</p>}
        {error && <p role="alert">{error}</p>}
        {preview && (
          <section className="lab-review" aria-label={t.review}>
            <h2 ref={reviewHeading} tabIndex={-1}>
              {preview.receipt.outcome === 'accepted'
                ? 'Konfigurasjonen er validert'
                : `Avvist: ${preview.receipt.code}`}
            </h2>
            <PropertyList
              items={[
                ['Workspace', editor.workspace],
                ['Model', editor.model],
                ['Revision', editor.revision],
                ['Operation', editor.type],
                ...Object.entries(preview.request.command)
                  .filter(([key]) => key !== 'type')
                  .map(
                    ([key, value]) =>
                      [t.fields[key as keyof typeof t.fields] ?? key, String(value)] as [
                        string,
                        ReactNode,
                      ],
                  ),
              ]}
            />
            {preview.receipt.applicationChange && (
              <ApplicationChangeDetails change={preview.receipt.applicationChange} />
            )}
            {editor.type.startsWith('Delete') && (
              <>
                <p>{t.deleteNote}</p>
                <label>
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                  />
                  {t.confirm}
                </label>
              </>
            )}
            <PortalCreateActions>
              <button
                className="primary"
                disabled={
                  busy ||
                  disabled ||
                  stale ||
                  preview.receipt.outcome !== 'accepted' ||
                  (editor.type.startsWith('Delete') && !confirmed)
                }
                onClick={() => {
                  if (!stale) {
                    setBusy(true);
                    void commit(preview.request, editor.workspace)
                      .then((accepted) => {
                        if (accepted) {
                          setEditor(null);
                          setPreview(null);
                        } else
                          setError(
                            'Endringen ble ikke bekreftet. Kontroller serverstatus og gjeldende revisjon.',
                          );
                      })
                      .finally(() => setBusy(false));
                  }
                }}
              >
                {editor.type.startsWith('Delete')
                  ? t.remove
                  : editor.type.startsWith('Create')
                    ? t.create
                    : t.save}
              </button>
            </PortalCreateActions>
          </section>
        )}
        <button
          disabled={busy}
          onClick={() => {
            setEditor(null);
            setPreview(null);
          }}
        >
          {t.cancel}
        </button>
      </PortalCreateLayout>
    );
  return (
    <>
      {['plans', 'apps', 'appPlan', 'webApp', 'appDeployment', 'appSetting'].includes(view) && (
        <p className="lab-network-boundary">{t.boundary}</p>
      )}
      {view === 'plans' && (
        <>
          <button
            disabled={disabled || !world.groups.length}
            onClick={() => open('CreateAppServicePlan')}
          >
            {t.operations.CreateAppServicePlan}
          </button>
          {list('appPlan', world.plans)}
        </>
      )}
      {view === 'apps' && (
        <>
          <button disabled={disabled || !world.plans.length} onClick={() => open('CreateWebApp')}>
            {t.operations.CreateWebApp}
          </button>
          <p>{t.localName}</p>
          {list('webApp', world.webApps)}
        </>
      )}
      {view === 'appPlan' && plan && (
        <>
          <div className="portal-toolbar">
            <button disabled={disabled} onClick={() => open('UpdateAppServicePlan')}>
              {t.operations.UpdateAppServicePlan}
            </button>
            <button disabled={disabled} onClick={() => open('DeleteAppServicePlan')}>
              {t.remove}
            </button>
          </div>
          <PropertyList
            items={[
              ['Type', 'Microsoft.Web/serverfarms'],
              ['Operating system', plan.os],
              ['Pricing tier', plan.sku],
            ]}
          />
          <h2>Web Apps</h2>
          {list(
            'webApp',
            world.webApps.filter((a) => a.planId === plan.id),
          )}
          {receipt(plan.origin)}
        </>
      )}
      {view === 'webApp' && app && (
        <>
          <div className="portal-toolbar">
            <button disabled={disabled} onClick={() => open('UpdateWebApp')}>
              Edit
            </button>
            <button disabled={disabled} onClick={() => open('DeploySyntheticApplication')}>
              {t.operations.DeploySyntheticApplication}
            </button>
            <button disabled={disabled} onClick={() => open('SetWebAppSetting')}>
              Add application setting
            </button>
            <button disabled={disabled} onClick={() => open('DeleteWebApp')}>
              {t.remove}
            </button>
          </div>
          <PropertyList
            items={[
              ['Type', 'Microsoft.Web/sites'],
              [
                'App Service Plan',
                ref(
                  'appPlan',
                  world.plans.find((p) => p.id === app.planId),
                ),
              ],
              ['Runtime stack', app.runtime],
              ['HTTPS only', String(app.httpsOnly)],
              ['Public network access', app.publicNetworkAccess],
              ['Configuration enabled', String(app.enabled)],
            ]}
          />
          <h2>{t.analysis}</h2>
          {(() => {
            const a = analyseWebApp(world, app.id)!;
            return (
              <>
                <p>{a.issues.length ? t.incomplete : t.configured}</p>
                <PropertyList
                  items={[
                    ['Workspace', snapshot.workspace],
                    ['Model', a.model],
                    ['Revision', a.revision],
                    ['Synthetic health path', a.application?.healthPath ?? '—'],
                    ['Configured response', a.application?.responseStatus ?? '—'],
                  ]}
                />
                {a.issues.length > 0 && (
                  <ul>
                    {a.issues.map((i) => (
                      <li key={i}>{t.issues[i as keyof typeof t.issues]}</li>
                    ))}
                  </ul>
                )}
                {a.syntheticResponse && (
                  <pre aria-label="Configured synthetic response text">
                    {a.syntheticResponse.text}
                  </pre>
                )}
                <p>{t.deploymentBoundary}</p>
              </>
            );
          })()}
          <h2>{t.deployments}</h2>
          {list(
            'appDeployment',
            world.deployments.filter((d) => d.webAppId === app.id),
          )}
          <h2>{t.settings}</h2>
          {list(
            'appSetting',
            world.settings.filter((s) => s.webAppId === app.id),
          )}
          {receipt(app.origin)}
        </>
      )}
      {view === 'appDeployment' && deployment && (
        <>
          <p>{t.deploymentBoundary}</p>
          <PropertyList
            items={[
              ['Web App', ref('webApp', owner)],
              ['Template', deployment.template],
              ['Health path', deployment.healthPath],
              ['Configured response', deployment.responseStatus],
            ]}
          />
          {receipt(deployment.origin)}
        </>
      )}
      {view === 'appSetting' && setting && (
        <>
          <div className="portal-toolbar">
            <button
              disabled={disabled}
              onClick={() => open('SetWebAppSetting', { name: setting.name })}
            >
              Edit
            </button>
            <button disabled={disabled} onClick={() => open('DeleteWebAppSetting')}>
              {t.remove}
            </button>
          </div>
          <p>{t.noSecrets}</p>
          <PropertyList
            items={[
              ['Web App', ref('webApp', owner)],
              ['Name', setting.name],
              ['Synthetic value', <pre key="v">{setting.value}</pre>],
            ]}
          />
          {receipt(setting.origin)}
        </>
      )}
      {latest && (
        <p>
          <Link href={href('history', undefined, latest.receipt.commandId)}>{t.latest}</Link>
        </p>
      )}
      {['appPlan', 'webApp', 'appDeployment', 'appSetting'].includes(view) &&
        !plan &&
        !app &&
        !deployment &&
        !setting && <p role="status">{t.missing}</p>}
    </>
  );
}

/** Immutable receipt projection shared by Review and original committed Activity details. */
export function ApplicationChangeDetails({ change }: { change: ApplicationChange }) {
  return (
    <section aria-label="Application configuration change">
      <PropertyList
        items={[
          ['Resource ID', change.id],
          ['Name', change.name],
          ['Parent', change.parentId],
          ['Original create command', change.createOrigin],
        ]}
      />
      <PortalTable
        caption={t.changes}
        rows={[...new Set([...Object.keys(change.before), ...Object.keys(change.after ?? {})])].map(
          (id) => ({ id, before: change.before[id], after: change.after?.[id] }),
        )}
        columns={[
          { key: 'field', label: 'Felt', cell: (r) => r.id },
          {
            key: 'before',
            label: t.before,
            cell: (r) => (r.before === undefined ? '—' : String(r.before)),
          },
          {
            key: 'after',
            label: t.after,
            cell: (r) =>
              change.after === null ? 'Slettet' : r.after === undefined ? '—' : String(r.after),
          },
        ]}
      />
    </section>
  );
}
