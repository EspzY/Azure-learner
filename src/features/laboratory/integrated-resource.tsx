'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import type { Snapshot, Request, Receipt, Command } from '@/laboratory/engine';
import type { World } from '@/laboratory/v39/contract';
import { PropertyList } from '@/features/portal/shared';
import { PortalCreateLayout, PortalCreateActions } from '@/features/portal/presentation';

export type IntegratedResource = {
  id: string;
  name: string;
  type: string;
  origin: string;
  parentId?: string;
  groupId: string;
  region: string;
  source: Record<string, unknown>;
  view: string;
};
export type IntegratedOperation = {
  type: string;
  label: string;
  fields: readonly string[];
  defaults?:
    | Record<string, string>
    | ((world: World, resource?: IntegratedResource) => Record<string, string>);
  options?: (
    field: string,
    world: World,
    resource?: IntegratedResource,
    values?: Record<string, string>,
  ) => readonly [string, string][] | undefined;
  availableIn?: 'list' | 'resource' | 'both';
  optionalFields?: readonly string[];
  lockedFields?: readonly string[];
  fieldLabels?: Record<string, string>;
  change?: (
    field: string,
    value: string,
    values: Record<string, string>,
    world: World,
  ) => Record<string, string>;
};
export type IntegratedFamily = {
  view: string;
  label: string;
  type: string;
  resources: (world: World) => IntegratedResource[];
  operations: IntegratedOperation[];
  analysis?: (world: World, workspace: string, resource: IntegratedResource) => ReactNode;
};
export type IntegratedViewsProps = {
  snapshot: Snapshot;
  view: string;
  id: string | null;
  disabled: boolean;
  list: (kind: string, rows: { id: string; name: string; origin: string }[]) => ReactNode;
  receipt: (id: string) => ReactNode;
  href: (view: string, id?: string, receipt?: string) => string;
  review: (
    request: Request,
    workspace: string,
  ) => Promise<{ workspace: string; revision: number; preview: Receipt }>;
  commit: (request: Request, workspace: string) => Promise<boolean>;
};
type Editor = {
  operation: IntegratedOperation;
  workspace: string;
  revision: number;
  model: string;
  values: Record<string, string>;
};
const humanize = (text: string) =>
  text.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (s) => s.toUpperCase());
const boundary =
  'Konfigurasjon i AzureLab-simulatoren. Ingen Azure-utrulling, HTTP-kall, DNS-oppslag, databaseautentisering eller faktisk kjøring.';

/** Presentation only. Review and Save use the existing single Laboratory transport. */
export function IntegratedResourceViews({
  families,
  actionsOnly = false,
  ...props
}: IntegratedViewsProps & { families: IntegratedFamily[]; actionsOnly?: boolean }) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [preview, setPreview] = useState<{ request: Request; receipt: Receipt } | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [confirmed, setConfirmed] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null),
    reviewHeading = useRef<HTMLHeadingElement>(null);
  const focusKey = editor ? `${editor.workspace}:${editor.revision}:${editor.operation.type}` : '';
  useEffect(() => {
    if (focusKey) heading.current?.focus();
  }, [focusKey]);
  const reviewedId = preview?.request.commandId;
  useEffect(() => {
    if (reviewedId) {
      reviewHeading.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
      reviewHeading.current?.focus({ preventScroll: true });
    }
  }, [reviewedId]);
  if ((props.snapshot.world.model as string) !== 'laboratory@3.9.0') return null;
  const world = props.snapshot.world as unknown as World;
  const family = families.find((f) => f.view === props.view);
  if (!family) return null;
  const rows = family.resources(world),
    resource = rows.find((r) => r.id === props.id);
  const stale =
    !!editor &&
    (editor.workspace !== props.snapshot.workspace ||
      editor.model !== world.model ||
      editor.revision !== world.revision);
  const open = (operation: IntegratedOperation) => {
    const defaults =
      typeof operation.defaults === 'function'
        ? operation.defaults(world, resource)
        : (operation.defaults ?? {});
    const source = resource?.source ?? {};
    const values = Object.fromEntries(
      operation.fields.map((field) => [
        field,
        typeof source[field] === 'string' ||
        typeof source[field] === 'number' ||
        typeof source[field] === 'boolean'
          ? String(source[field])
          : '',
      ]),
    );
    setEditor({
      operation,
      workspace: props.snapshot.workspace,
      model: world.model,
      revision: world.revision,
      values: { ...values, ...defaults },
    });
    setPreview(null);
    setError('');
    setConfirmed(false);
  };
  const inspect = async () => {
    if (!editor || stale) return;
    setBusy(true);
    setError('');
    const request: Request = {
      commandId: crypto.randomUUID(),
      expectedRevision: editor.revision,
      command: {
        type: editor.operation.type,
        ...Object.fromEntries(
          editor.operation.fields.map((field) => [field, editor.values[field] ?? '']),
        ),
      } as Command,
    };
    try {
      const result = await props.review(request, editor.workspace);
      if (result.workspace !== editor.workspace || result.revision !== editor.revision)
        throw Error('Arbeidsområdet er endret. Åpne skjemaet på nytt.');
      setPreview({ request, receipt: result.preview });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Review unavailable');
    } finally {
      setBusy(false);
    }
  };
  if (editor) {
    const deleting = editor.operation.type.startsWith('Delete'),
      creating = editor.operation.type.startsWith('Create');
    return (
      <PortalCreateLayout
        className="lab-form lab-integrated-form"
        intro={boundary}
        title={
          <h2 ref={heading} tabIndex={-1}>
            {editor.operation.label}
          </h2>
        }
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void inspect();
          }}
        >
          <fieldset disabled={busy || props.disabled || stale}>
            {editor.operation.fields.map((field) => {
              const options = editor.operation.options?.(field, world, resource, editor.values);
              const label = editor.operation.fieldLabels?.[field] ?? humanize(field);
              const change = (value: string) => {
                const values = { ...editor.values, [field]: value };
                setEditor({
                  ...editor,
                  values: editor.operation.change?.(field, value, values, world) ?? values,
                });
                setPreview(null);
                setConfirmed(false);
              };
              return (
                <label key={field}>
                  {label}
                  {options ? (
                    <select
                      aria-label={label}
                      required={!editor.operation.optionalFields?.includes(field)}
                      disabled={editor.operation.lockedFields?.includes(field)}
                      value={editor.values[field] ?? ''}
                      onChange={(event) => change(event.target.value)}
                    >
                      {!options.some(([id]) => id === '') && (
                        <option value="">Velg {label.toLowerCase()}</option>
                      )}
                      {options.map(([id, name]) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      aria-label={label}
                      required={!editor.operation.optionalFields?.includes(field)}
                      readOnly={editor.operation.lockedFields?.includes(field)}
                      maxLength={120}
                      value={editor.values[field] ?? ''}
                      onChange={(event) => change(event.target.value)}
                    />
                  )}
                </label>
              );
            })}
          </fieldset>
          {stale && (
            <p role="alert">
              Arbeidsområdet eller revisjonen er endret. Avbryt og åpne en ny Review.
            </p>
          )}
          {error && <p role="alert">{error}</p>}
          {preview && (
            <section aria-label="Review result">
              <h3 ref={reviewHeading} tabIndex={-1}>
                Review
              </h3>
              <p role="status">
                {preview.receipt.outcome} · {preview.receipt.code}
                {preview.receipt.field ? ` · ${preview.receipt.field}` : ''}
              </p>
              <p>
                Workspace {editor.workspace} · {editor.model} · revision {editor.revision}
              </p>
              <pre>{JSON.stringify(preview.request.command, null, 2)}</pre>
              <p>Review lagrer ingen endring. Bare den neste bekreftede operasjonen lagrer.</p>
            </section>
          )}
          {deleting && (
            <label>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              Bekreft sletting av denne konfigurasjonen
            </label>
          )}
          <PortalCreateActions>
            <button type="submit" disabled={busy || props.disabled || stale}>
              Review
            </button>
            <button
              type="button"
              disabled={
                busy ||
                props.disabled ||
                stale ||
                preview?.receipt.outcome !== 'accepted' ||
                (deleting && !confirmed)
              }
              onClick={async () => {
                if (!preview || stale) return;
                setBusy(true);
                setError('');
                try {
                  if (await props.commit(preview.request, editor.workspace)) {
                    setEditor(null);
                    setPreview(null);
                  } else
                    setError(
                      'Endringen ble ikke bekreftet. Kontroller original operasjonskvittering.',
                    );
                } catch (cause) {
                  setError(cause instanceof Error ? cause.message : 'Save unavailable');
                } finally {
                  setBusy(false);
                }
              }}
            >
              {deleting ? 'Delete' : creating ? 'Create' : 'Save'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                const type = editor.operation.type;
                setEditor(null);
                setPreview(null);
                setError('');
                requestAnimationFrame(() =>
                  document
                    .querySelector<HTMLButtonElement>(`[data-integrated-operation="${type}"]`)
                    ?.focus(),
                );
              }}
            >
              Cancel
            </button>
          </PortalCreateActions>
        </form>
      </PortalCreateLayout>
    );
  }
  const operations = family.operations.filter((operation) => {
    const place =
      operation.availableIn ?? (operation.type.startsWith('Create') ? 'both' : 'resource');
    return resource ? place !== 'list' : !props.id && place !== 'resource';
  });
  if (actionsOnly)
    return (
      <section aria-label="Storage lifecycle">
        <div className="lab-actions">
          {operations.map((operation) => (
            <button
              type="button"
              key={operation.type}
              data-integrated-operation={operation.type}
              disabled={props.disabled}
              onClick={() => open(operation)}
            >
              {operation.label}
            </button>
          ))}
        </div>
      </section>
    );
  return (
    <section aria-label={family.label}>
      <h2>{resource?.name ?? family.label}</h2>
      <p>{boundary}</p>
      <div className="lab-actions">
        {operations.map((operation) => (
          <button
            type="button"
            key={operation.type}
            data-integrated-operation={operation.type}
            disabled={props.disabled}
            onClick={() => open(operation)}
          >
            {operation.label}
          </button>
        ))}
      </div>
      {props.id ? (
        resource ? (
          <>
            <h3>Overview</h3>
            <PropertyList
              items={[
                ['Name', resource.name],
                ['Resource ID', resource.id],
                ['Type', resource.type],
                [
                  'Resource group',
                  world.groups.find((g) => g.id === resource.groupId)?.name ?? resource.groupId,
                ],
                ['Region', resource.region],
                ['Create origin', resource.origin],
              ]}
            />
            {resource.parentId && (
              <p>
                Parent:{' '}
                <Link
                  href={props.href(
                    families
                      .flatMap((f) => f.resources(world))
                      .find((r) => r.id === resource.parentId)?.view ??
                      (world.webApps.some((a) => a.id === resource.parentId) ? 'webApp' : 'group'),
                    resource.parentId,
                  )}
                >
                  {resource.parentId}
                </Link>
              </p>
            )}
            <h3>Properties and settings</h3>
            <PropertyList
              items={Object.entries(resource.source)
                .filter(([key]) => !['id', 'name', 'origin'].includes(key))
                .map(([key, value]) => [
                  humanize(key),
                  typeof value === 'object' ? JSON.stringify(value) : String(value),
                ])}
            />
            <h3>Activity log</h3>
            {props.receipt(resource.origin)}
            <ul>
              {props.snapshot.entries
                .filter((entry) =>
                  [
                    ...entry.receipt.addedIds,
                    ...(entry.receipt.updatedIds ?? []),
                    ...entry.receipt.removedIds,
                  ].includes(resource.id),
                )
                .map((entry) => (
                  <li key={entry.request.commandId}>
                    <Link href={props.href('history', undefined, entry.request.commandId)}>
                      {entry.receipt.sequence} · {entry.receipt.operation} · {entry.receipt.code}
                    </Link>
                  </li>
                ))}
            </ul>
            {family.analysis?.(world, props.snapshot.workspace, resource)}
            <h3>Related resources</h3>
            {families.map((f) => {
              const related = f.resources(world).filter((r) => r.parentId === resource.id);
              return (
                <div key={f.view}>
                  <Link href={props.href(f.view)}>{f.label}</Link>
                  {related.length > 0 && props.list(f.view, related)}
                </div>
              );
            })}
          </>
        ) : (
          <p role="status">Ressursen finnes ikke i denne revisjonen.</p>
        )
      ) : (
        props.list(family.view, rows)
      )}
    </section>
  );
}
