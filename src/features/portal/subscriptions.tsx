'use client';
import { useState, type ReactNode } from 'react';
import { nb, regionLabels } from '@/content/nb';
import { sharedPortalNb as copy } from '@/content/shared-portal-nb';
import { PortalTable, PortalResourceLayout, PortalResourceMenu } from './presentation';
import { PropertyList } from './shared';
import {
  PortalDestinationLink,
  PortalRecentResources,
  type PortalResourceLink,
  type PortalDestination,
} from './home';

export type PortalSubscription = {
  id: string;
  name: string;
  groups: readonly PortalResourceLink[];
  resources: readonly PortalResourceLink[];
  resourceLocations: readonly string[];
  metadataLocations: readonly string[];
};
export const scopeLocations = (regions: readonly string[]) =>
  [...new Set(regions.filter(Boolean))].sort();
const locations = (regions: readonly string[]) =>
  regions.map((region) => regionLabels[region as keyof typeof regionLabels] ?? region).join(', ') ||
  '—';
export function PortalSubscriptions({
  subscriptions,
  destination,
}: {
  subscriptions: readonly PortalSubscription[];
  destination: (id: string) => PortalDestination;
}) {
  const [query, setQuery] = useState('');
  return (
    <section data-portal-component="subscriptions">
      <p className="portal-inline-info">{copy.subscriptionsNote}</p>
      <div className="portal-list-filters">
        <label>
          {nb.portal.filter}
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>
      <PortalTable
        rows={subscriptions.filter((s) =>
          `${s.name} ${s.id}`.toLowerCase().includes(query.toLowerCase()),
        )}
        caption={nb.portal.areas.subscriptions}
        empty={nb.portal.noResource}
        columns={[
          {
            key: 'name',
            label: nb.portal.name,
            cell: (s) => (
              <PortalDestinationLink
                className="portal-resource-link"
                destination={destination(s.id)}
              >
                {s.name}
              </PortalDestinationLink>
            ),
          },
          { key: 'scope', label: copy.scope, cell: (s) => s.id },
          { key: 'groups', label: copy.groups, cell: (s) => s.groups.length },
          { key: 'resources', label: copy.resources, cell: (s) => s.resources.length },
          { key: 'locations', label: copy.regions, cell: (s) => locations(s.resourceLocations) },
        ]}
      />
    </section>
  );
}
export function PortalSubscriptionDetails({
  subscription: s,
  section,
  onSection,
  createGroup,
}: {
  subscription: PortalSubscription;
  section: 'overview' | 'properties';
  createGroup?: ReactNode;
  onSection: (section: 'overview' | 'properties') => void;
}) {
  return (
    <PortalResourceLayout
      menu={
        <PortalResourceMenu
          name={s.name}
          icon="subscription"
          items={[
            {
              key: 'overview',
              label: nb.portal.overview,
              icon: 'subscription',
              active: section === 'overview',
              onSelect: () => onSection('overview'),
            },
            {
              key: 'properties',
              label: nb.portalUi.properties,
              icon: 'properties',
              active: section === 'properties',
              settings: true,
              onSelect: () => onSection('properties'),
            },
          ]}
        />
      }
    >
      <section data-portal-component="subscription-details">
        <h2>{section === 'properties' ? nb.portalUi.properties : nb.portalUi.essentials}</h2>
        <p className="portal-inline-info">{copy.subscriptionsNote}</p>
        <PropertyList
          items={[
            [nb.portal.name, s.name],
            [nb.portalUi.localId, s.id],
            [copy.groups, s.groups.length],
            [copy.resources, s.resources.length],
            [copy.regions, locations(s.resourceLocations)],
            [copy.metadataRegions, locations(s.metadataLocations)],
          ]}
        />
        {section === 'overview' && (
          <>
            {createGroup}
            <h2>{copy.groups}</h2>
            <PortalRecentResources rows={s.groups} caption={copy.groups} empty={copy.noMembers} />
            <h2>{copy.resources}</h2>
            {s.resources.length ? (
              <PortalRecentResources rows={s.resources} empty={copy.noMembers} />
            ) : (
              <p>{copy.noMembers}</p>
            )}
          </>
        )}
      </section>
    </PortalResourceLayout>
  );
}
