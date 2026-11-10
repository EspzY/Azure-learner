'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { nb, regionLabels } from '@/content/nb';
import { portalWorkspaceNb } from '@/content/portal-workspace-nb';
import { portalResourceContextNb as copy } from '@/content/portal-resource-context-nb';
import { PropertyList } from './shared';
import {
  portalResourceFamilies,
  portalResourceParent,
  portalSourceValue,
  portalResourceScopeLabel,
  type PortalContextResource,
} from './resource-context';
import './resource-context.css';

type Resource = PortalContextResource & {
  readonly type?: string;
  readonly region?: string;
  readonly location?: string;
  readonly origin?: string;
};
type Props = {
  resource: Resource;
  resources: readonly PortalContextResource[];
  href: (view: string, id?: string) => string;
};
export function PortalCreateStages({
  review,
  reviewLabel = copy.reviewCreate,
  label,
}: {
  review: boolean;
  reviewLabel?: string;
  label: string;
}) {
  return (
    <ol className="portal-create-steps" aria-label={label}>
      <li aria-current={!review ? 'step' : undefined}>{copy.basics}</li>
      <li aria-current={review ? 'step' : undefined}>{reviewLabel}</li>
    </ol>
  );
}
const label = (key: string) =>
  copy.fields[key as keyof typeof copy.fields] ??
  key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (value) => value.toUpperCase());
export function portalDisplayValue(value: unknown, field = ''): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean')
    return field === 'enabled'
      ? value
        ? copy.enabled
        : copy.disabled
      : value
        ? copy.yes
        : copy.no;
  if (typeof value === 'string')
    return (
      regionLabels[value as keyof typeof regionLabels] ?? (value === 'global' ? copy.global : value)
    );
  return typeof value === 'number' ? String(value) : '—';
}
export function portalOptionLabel(
  id: string,
  title: string,
  resources: readonly PortalContextResource[],
): string {
  if (Object.hasOwn(regionLabels, id)) return regionLabels[id as keyof typeof regionLabels];
  if (id === 'Microsoft.Sql/servers/databases') return portalWorkspaceNb.resourceKinds.sqlDatabase;
  if (id === 'Microsoft.DBforPostgreSQL/flexibleServers/databases')
    return portalWorkspaceNb.resourceKinds.postgresDatabase;
  if (id === 'node22') return copy.node22;
  const record = resources.find((resource) => resource.id === id);
  const readable = title.endsWith(` · ${id}`) ? title.slice(0, -id.length - 3) : title;
  if (
    !record ||
    resources.filter((resource) => resource.name === record.name && resource.view === record.view)
      .length < 2
  )
    return readable;
  return [readable, portalResourceScopeLabel(record, resources, false)].filter(Boolean).join(' · ');
}
export function PortalHumanProperties({
  resource,
  resources,
  href,
  fields = portalResourceFamilies[resource.view]?.properties ?? [],
}: Props & { fields?: readonly string[] }) {
  const items = fields.flatMap((field): [string, ReactNode][] => {
    const value = portalSourceValue(resource.source, field);
    if (value === undefined) return [];
    const target =
      typeof value === 'string' ? resources.find((row) => row.id === value) : undefined;
    return [
      [
        label(field),
        target ? (
          <Link key={field} href={href(target.view, target.id)}>
            {portalOptionLabel(target.id, target.name, resources)}
          </Link>
        ) : (
          portalDisplayValue(value, field)
        ),
      ],
    ];
  });
  return <PropertyList items={items} />;
}
export function PortalResourceEssentials({ resource, resources, href }: Props) {
  const group = resources.find((row) => row.id === resource.groupId),
    parentId = portalResourceParent(resource),
    parent = resources.find((row) => row.id === parentId),
    subscriptionId = group ? portalSourceValue(group.source, 'subscriptionId') : undefined;
  return (
    <section className="portal-context-essentials" data-portal-component="essentials">
      <h2>{copy.essentials}</h2>
      <PropertyList
        items={[
          [
            nb.portal.group,
            group ? (
              <Link key="group" href={href(group.view, group.id)}>
                {portalOptionLabel(group.id, group.name, resources)}
              </Link>
            ) : (
              '—'
            ),
          ],
          [
            nb.portal.subscription,
            subscriptionId === 'sub-shared'
              ? 'Shared Sandbox'
              : subscriptionId === 'sub-app'
                ? 'App Sandbox'
                : '—',
          ],
          [nb.portalUi.location, portalDisplayValue(resource.region ?? resource.location)],
          [copy.configured, copy.localState],
          ...(parent && parent.id !== group?.id
            ? [
                [
                  copy.parent,
                  <Link key="parent" href={href(parent.view, parent.id)}>
                    {portalOptionLabel(parent.id, parent.name, resources)}
                  </Link>,
                ] as [string, ReactNode],
              ]
            : []),
        ]}
      />
      <p className="portal-context-note">{copy.localStateNote}</p>
    </section>
  );
}
export function PortalTechnicalEvidence({
  resource,
  children,
}: {
  resource: Resource;
  children?: ReactNode;
}) {
  return (
    <details className="portal-technical-evidence" data-portal-component="technical-evidence">
      <summary>{copy.technical}</summary>
      <p>{copy.technicalNote}</p>
      <PropertyList
        items={[
          [copy.resourceId, resource.id],
          ...(resource.type ? [[copy.resourceType, resource.type] as [string, ReactNode]] : []),
          ...(resource.origin ? [[copy.origin, resource.origin] as [string, ReactNode]] : []),
        ]}
      />
      {children}
      <pre>{JSON.stringify(resource.source, null, 2)}</pre>
    </details>
  );
}
