'use client';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import type { Snapshot, Request, Receipt, Command } from '@/laboratory/engine';
import type { World } from '@/laboratory/v39/contract';
import { PropertyList } from '@/features/portal/shared';
import { PortalCreateLayout, PortalCreateActions } from '@/features/portal/presentation';
import { portalResourceContextNb as copy } from '@/content/portal-resource-context-nb';
import {
  PortalResourceEssentials,
  PortalHumanProperties,
  PortalTechnicalEvidence,
  portalDisplayValue,
  portalOptionLabel,
} from '@/features/portal/resource-details';
import {
  portalContextCollections,
  portalContextRows,
  portalContextParents,
  portalContextParentField,
  portalResourceSections,
  type PortalContextResource,
} from '@/features/portal/resource-context';

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
  section?: string;
  resources?: readonly PortalContextResource[];
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
const boundary = copy.boundary;

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
  const allResources = props.resources ?? families.flatMap((f) => f.resources(world));
  const collection = portalContextCollections(props.view).find(
    (item) => props.section === `context:${item.key}`,
  );
  const collectionFamily =
    collection && families.find((item) => collection.views.includes(item.view));
  if (!family && !collectionFamily) return null;
  const rows = family?.resources(world) ?? [];
  const external = allResources.find((item) => item.id === props.id && item.view === props.view);
  const resource =
    rows.find((r) => r.id === props.id) ??
    (external
      ? {
          ...external,
          source: { ...external.source } as Record<string, unknown>,
          type: '',
          origin: '',
          region: '',
        }
      : undefined);
  const contextualOperations =
    collectionFamily && resource
      ? collectionFamily.operations
          .filter((operation) => operation.type.startsWith('Create'))
          .map((operation) => {
            const parentField =
                collection?.relationship === 'association'
                  ? 'wafPolicyId'
                  : portalContextParentField(collectionFamily.view),
              parents =
                collection?.relationship === 'association'
                  ? [resource]
                  : portalContextParents(allResources, resource, collectionFamily.view),
              pinned = parents.some((parent) => parent.id === resource.id);
            return {
              ...operation,
              lockedFields: [
                ...(operation.lockedFields ?? []),
                ...(pinned && parentField ? [parentField] : []),
              ],
              defaults: (currentWorld: World) => {
                const defaults =
                  typeof operation.defaults === 'function'
                    ? operation.defaults(currentWorld)
                    : (operation.defaults ?? {});
                const values = {
                  ...defaults,
                  ...(parentField ? { [parentField]: parents[0]?.id ?? '' } : {}),
                };
                return parentField
                  ? (operation.change?.(
                      parentField,
                      values[parentField] ?? '',
                      values,
                      currentWorld,
                    ) ?? values)
                  : values;
              },
              options: (
                field: string,
                currentWorld: World,
                currentResource?: IntegratedResource,
                values?: Record<string, string>,
              ) => {
                if (pinned && field === parentField) return [[resource.id, resource.name]] as const;
                const options = operation.options?.(field, currentWorld, currentResource, values);
                return field === parentField && options
                  ? options.filter(([id]) => parents.some((parent) => parent.id === id))
                  : options;
              },
              change: (
                field: string,
                value: string,
                values: Record<string, string>,
                currentWorld: World,
              ) => {
                const next = operation.change?.(field, value, values, currentWorld) ?? values;
                return pinned && parentField ? { ...next, [parentField]: resource.id } : next;
              },
            } satisfies IntegratedOperation;
          })
      : [];
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
    const reviewLabel = deleting
      ? copy.reviewDelete
      : creating
        ? copy.reviewCreate
        : copy.reviewSave;
    return (
      <PortalCreateLayout
        className="lab-form lab-integrated-form"
        title={
          <h2 ref={heading} tabIndex={-1}>
            {editor.operation.label}
          </h2>
        }
      >
        <ol className="portal-create-steps" aria-label={editor.operation.label}>
          <li aria-current={!preview ? 'step' : undefined}>{copy.basics}</li>
          <li aria-current={preview ? 'step' : undefined}>{reviewLabel}</li>
        </ol>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void inspect();
          }}
        >
          <fieldset hidden={!!preview} disabled={busy || props.disabled || stale}>
            <legend>{creating ? copy.project : copy.configurationDetails}</legend>
            {collection && <p className="portal-context-note">{copy.parentPinned}</p>}
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
                <Fragment key={field}>
                  {field === 'name' && <h3 className="portal-form-section">{copy.instance}</h3>}
                  <label>
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
                            {portalOptionLabel(id, name, allResources)}
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
                </Fragment>
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
                {reviewLabel}
              </h3>
              <p
                role="status"
                className={
                  preview.receipt.outcome === 'accepted'
                    ? 'portal-validation-passed'
                    : 'portal-validation-failed'
                }
              >
                {preview.receipt.outcome === 'accepted'
                  ? copy.validationPassed
                  : `${copy.validationFailed}: ${preview.receipt.code}`}
                {preview.receipt.field
                  ? ` · ${editor.operation.fieldLabels?.[preview.receipt.field] ?? humanize(preview.receipt.field)}`
                  : ''}
              </p>
              <PropertyList
                items={editor.operation.fields.map((field) => {
                  const value = editor.values[field] ?? '';
                  const target = allResources.find((item) => item.id === value);
                  const option = editor.operation
                    .options?.(field, world, resource, editor.values)
                    ?.find(([id]) => id === value);
                  return [
                    editor.operation.fieldLabels?.[field] ?? humanize(field),
                    target
                      ? portalOptionLabel(target.id, target.name, allResources)
                      : option
                        ? portalOptionLabel(value, option[1], allResources)
                        : portalDisplayValue(value, field),
                  ];
                })}
              />
              <p>{copy.validationNote}</p>
              <details className="portal-technical-evidence">
                <summary>{copy.technical}</summary>
                <p>
                  Workspace {editor.workspace} · {editor.model} · revision {editor.revision}
                </p>
                <p>{preview.receipt.code}</p>
                <pre>{JSON.stringify(preview.request.command, null, 2)}</pre>
              </details>
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
            <button type="submit" hidden={!!preview} disabled={busy || props.disabled || stale}>
              {reviewLabel}
            </button>
            <button
              type="button"
              hidden={!preview}
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
            {preview && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setPreview(null);
                  setConfirmed(false);
                  requestAnimationFrame(() => heading.current?.focus());
                }}
              >
                {copy.previous}
              </button>
            )}
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
  const operations = collection
    ? [
        ...contextualOperations,
        ...(collection.key === 'networking'
          ? (family?.operations.filter((operation) => operation.type.startsWith('Update')) ?? [])
          : []),
      ]
    : family!.operations.filter((operation) => {
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
  if (collection && resource && collectionFamily) {
    const children = portalContextRows(allResources, resource, collection);
    return (
      <section aria-label={collection.label} className="portal-context-collection">
        <h2>{collection.label}</h2>
        <p className="portal-context-note">{copy.scopeNote}</p>
        <div className="portal-commandbar">
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
        {props.section === 'context:networking' && (
          <PortalHumanProperties
            resource={resource}
            resources={allResources}
            href={props.href}
            fields={['publicNetworkAccess', 'minimumTls']}
          />
        )}
        {children.length ? (
          props.list(
            collectionFamily.view,
            children.map((item) => ({
              id: item.id,
              name: item.name,
              origin: String((item.source as Record<string, unknown>).origin ?? ''),
            })),
          )
        ) : (
          <p>{copy.empty}</p>
        )}
      </section>
    );
  }
  if (!family) return null;
  const resourceSection = portalResourceSections(props.view).find(
    (item) => item.key === props.section,
  );
  if (resourceSection && resource)
    return (
      <section aria-label={resourceSection.label}>
        <h2>{resourceSection.label}</h2>
        <div className="portal-commandbar">
          {operations
            .filter((operation) => operation.type.startsWith('Update'))
            .map((operation) => (
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
        <PortalHumanProperties
          resource={resource}
          resources={allResources}
          href={props.href}
          fields={resourceSection.fields}
        />
        <PortalTechnicalEvidence resource={resource}>
          <p>{boundary}</p>
        </PortalTechnicalEvidence>
      </section>
    );
  return (
    <section aria-label={family.label}>
      {!resource && <h2>{family.label}</h2>}
      <div className="portal-commandbar">
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
            <PortalResourceEssentials
              resource={resource}
              resources={allResources}
              href={props.href}
            />
            <h2>{copy.configurationDetails}</h2>
            <PortalHumanProperties resource={resource} resources={allResources} href={props.href} />
            {resource.view === 'functionApp' && (
              <p className="portal-context-note">{copy.functionsBoundary}</p>
            )}
            {resource.view === 'applicationGateway' && (
              <p className="portal-context-note">{copy.gatewayBoundary}</p>
            )}
            {portalContextCollections(resource.view).length > 0 && (
              <div className="portal-context-links">
                {portalContextCollections(resource.view).map((item) => (
                  <Link
                    key={item.key}
                    href={`${props.href(resource.view, resource.id)}&section=${encodeURIComponent(`context:${item.key}`)}`}
                  >
                    {item.label}{' '}
                    <span>{portalContextRows(allResources, resource, item).length}</span>
                  </Link>
                ))}
              </div>
            )}
            <PortalTechnicalEvidence resource={resource}>
              <p>{boundary}</p>
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
            </PortalTechnicalEvidence>
            {family.analysis?.(world, props.snapshot.workspace, resource)}
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
