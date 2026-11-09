'use client';
import type { ReactNode, MouseEvent } from 'react';
import { nb } from '@/content/nb';
import { sharedPortalNb as copy } from '@/content/shared-portal-nb';
import { ServiceIcon } from './service-icon';
import { portalEntryServices, type PortalService } from './service-catalog';
import { PortalTable } from './presentation';

export type PortalDestination = { href: string; onSelect: () => void };
export type PortalResourceLink = {
  id: string;
  name: string;
  kind: string;
  type: string;
  group: string;
  subscription: string;
  destination: PortalDestination;
};
const select = (e: MouseEvent<HTMLAnchorElement>, destination: PortalDestination) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
    return;
  e.preventDefault();
  destination.onSelect();
};
export function PortalDestinationLink({
  destination,
  children,
  ...props
}: {
  destination: PortalDestination;
  children: ReactNode;
  className?: string;
  'aria-current'?: 'page';
  'data-guide'?: string;
}) {
  return (
    <a {...props} href={destination.href} onClick={(e) => select(e, destination)}>
      {children}
    </a>
  );
}
export function PortalServiceNavigation({
  services,
  current,
  destination,
  guideTargets,
  children,
}: {
  services: readonly PortalService[];
  current: string;
  destination: (view: string) => PortalDestination;
  children?: ReactNode;
  guideTargets?: Readonly<Record<string, string>>;
}) {
  return (
    <>
      <PortalDestinationLink destination={destination('services')}>
        <ServiceIcon kind="create" size={17} />
        {nb.portalUi.create}
      </PortalDestinationLink>
      {portalEntryServices.map((s) => (
        <PortalDestinationLink
          key={s.id}
          destination={destination(s.view)}
          aria-current={current === s.view ? 'page' : undefined}
        >
          <ServiceIcon kind={s.icon} size={17} />
          {s.title}
        </PortalDestinationLink>
      ))}
      <span className="portal-nav-category">
        <ServiceIcon kind="favorite" size={12} />
        {nb.portalUi.favorites}
      </span>
      {services.map((s) => (
        <PortalDestinationLink
          key={s.id}
          destination={destination(s.view)}
          aria-current={current === s.view ? 'page' : undefined}
          data-guide={guideTargets?.[s.id]}
        >
          <ServiceIcon kind={s.icon} size={17} />
          {s.title}
        </PortalDestinationLink>
      ))}
      {children}
    </>
  );
}
export function PortalServiceDirectory({
  services,
  destination,
}: {
  services: readonly PortalService[];
  destination: (view: string) => PortalDestination;
}) {
  return (
    <div className="portal-services-index" data-portal-component="service-directory">
      {services.map((s) => (
        <PortalDestinationLink key={s.id} destination={destination(s.view)}>
          <ServiceIcon kind={s.icon} size={22} />
          <span>{s.title}</span>
          <ServiceIcon kind="next" size={14} />
        </PortalDestinationLink>
      ))}
    </div>
  );
}
export function PortalRecentResources({
  rows,
  caption = nb.portal.resources,
  empty = copy.noRecent,
}: {
  rows: readonly PortalResourceLink[];
  caption?: ReactNode;
  empty?: ReactNode;
}) {
  return (
    <PortalTable
      rows={rows}
      caption={caption}
      empty={empty}
      columns={[
        {
          key: 'name',
          label: nb.portal.name,
          cell: (r) => (
            <PortalDestinationLink className="portal-resource-link" destination={r.destination}>
              <ServiceIcon kind={r.kind} />
              {r.name}
            </PortalDestinationLink>
          ),
        },
        { key: 'type', label: nb.portal.type, cell: (r) => r.type },
        { key: 'group', label: nb.portal.group, cell: (r) => r.group || '—' },
        { key: 'subscription', label: nb.portal.subscription, cell: (r) => r.subscription },
      ]}
    />
  );
}
/** One Home in both modes; optional learning is owned entirely by the course controller. */
export function PortalHome({
  services,
  destination,
  recent,
  learning,
  createGroup,
}: {
  services: readonly PortalService[];
  destination: (view: string) => PortalDestination;
  recent: readonly PortalResourceLink[];
  learning?: ReactNode;
  createGroup?: ReactNode;
}) {
  const preferred = [
    'subscriptions',
    'groups',
    'resources',
    'apps',
    'plans',
    'vms',
    'accounts',
    'vnets',
    'studio',
    'activity',
  ];
  const shortcuts = preferred.flatMap((id) => services.filter((s) => s.id === id)).slice(0, 7);
  return (
    <>
      <h2>{nb.portal.services}</h2>
      <div data-portal-component="home">
        <div className="portal-home-services">
          <button type="button" onClick={() => destination('services').onSelect()}>
            <ServiceIcon kind="create" size={30} />
            <span>{nb.portalUi.create}</span>
          </button>
          {shortcuts.map((s) => (
            <button key={s.id} type="button" onClick={() => destination(s.view).onSelect()}>
              <ServiceIcon kind={s.icon} size={30} />
              <span>{s.title}</span>
            </button>
          ))}
          <button type="button" onClick={() => destination('services').onSelect()}>
            <ServiceIcon kind="next" size={28} />
            <span>{nb.portalUi.moreServices}</span>
          </button>
        </div>
        {createGroup && <div className="portal-home-actions">{createGroup}</div>}
        {learning}
        <h2>{nb.portal.recent}</h2>
        <p>{nb.portal.recentHint}</p>
        <PortalRecentResources rows={recent} />
        <section className="portal-home-navigate">
          <h2>{nb.portalUi.navigate}</h2>
          <div>
            {services
              .filter((s) => ['subscriptions', 'groups', 'resources', 'studio'].includes(s.id))
              .map((s) => (
                <button key={s.id} type="button" onClick={() => destination(s.view).onSelect()}>
                  <ServiceIcon kind={s.icon} size={22} />
                  {s.title}
                </button>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
