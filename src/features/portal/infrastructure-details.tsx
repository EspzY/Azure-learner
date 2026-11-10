'use client';
import { labsNb as t, nb } from '@/content/nb';
import { inventory } from '@/domain/portal/model';
import type { World, Receipt } from '@/domain/chapter01/model';
import {
  infrastructure,
  infrastructureRelations,
  appSettings,
  type Command,
} from '@/domain/sandbox/model';
import { usePractical } from '@/features/course/practical-provider';
import { PropertyList, type Navigate } from './shared';
import { ServiceIcon } from './service-icon';
export function InfrastructureDetails({
  world,
  view = 'all',
  id,
  navigate,
  onCreate,
  receipt,
}: {
  world: World;
  view?: import('./inventory').ResourceView;
  id: string;
  navigate: Navigate;
  onCreate: (c: Command) => void;
  receipt?: Receipt;
}) {
  const practical = usePractical(),
    r = infrastructure(world).find((r) => r.id === id),
    settings = appSettings(world).find((s) => s.appId === id);
  const allRelated = infrastructureRelations(world).filter(
    (e) => e.from === id && e.kind !== 'resource-member',
  );
  const related = allRelated.filter(
    (e) =>
      view === 'all' ||
      (view === 'disks' ? e.kind === 'disk-attachment' : e.kind === 'nic-attachment'),
  );
  return (
    <section className="portal-infrastructure" data-guide="vm-details">
      {receipt && (
        <p className="portal-inline-info">
          <strong>
            {receipt.outcome} · {receipt.commandId}
          </strong>{' '}
          · {receipt.beforeRevision} → {receipt.afterRevision}{' '}
          <button type="button" onClick={() => navigate('activity', { id: receipt.commandId })}>
            {t.receipt}
          </button>
        </p>
      )}
      {r && (
        <>
          <h2>{t.vm.dependencies}</h2>
          <p>
            {r.kind === 'vm'
              ? t.vm.accepted
              : r.kind === 'disk'
                ? r.role === 'os'
                  ? t.vm.osNote
                  : t.vm.dataNote
                : t.vm.networkNote}
          </p>
          <PropertyList
            items={Object.entries(r)
              .filter(
                ([k, v]) =>
                  !['id', 'name', 'groupId', 'location', 'origin', 'kind'].includes(k) &&
                  !allRelated.some((e) => e.to === v),
              )
              .map(([key, value]) => [
                t.fields[key as keyof typeof t.fields] ?? key,
                key === 'profile' ? (
                  t.vm.profiles[value as keyof typeof t.vm.profiles]
                ) : key === 'image' ? (
                  t.vm.images[value as keyof typeof t.vm.images]
                ) : key.endsWith('Id') &&
                  typeof value === 'string' &&
                  inventory(world).some((r) => r.id === value) ? (
                  <button type="button" onClick={() => navigate('resource', { id: value })}>
                    <ServiceIcon kind={inventory(world).find((r) => r.id === value)!.kind} />{' '}
                    {inventory(world).find((r) => r.id === value)?.name}
                  </button>
                ) : (
                  String(value ?? '—')
                ),
              ])}
          />
          <ul>
            {related.map((e) => (
              <li key={`${e.kind}-${e.to}`}>
                <strong>{nb.portal.graph.relations[e.kind]}</strong>{' '}
                <button type="button" onClick={() => navigate('resource', { id: e.to })}>
                  <ServiceIcon kind={infrastructure(world).find((r) => r.id === e.to)!.kind} />{' '}
                  {infrastructure(world).find((r) => r.id === e.to)?.name}
                </button>
                <p>{nb.portal.graph.explanations[e.kind]}</p>
              </li>
            ))}
          </ul>
        </>
      )}
      {settings && (
        <>
          <h2>{t.settings.saved}</h2>
          <PropertyList
            items={[
              [t.settings.environment, settings.environment],
              [t.settings.catalog, settings.catalogMode],
            ]}
          />
          <p>{t.settings.mechanism}</p>
        </>
      )}
      {(!!r || world.resources.some((r) => r.id === id)) &&
        practical.current?.status === 'active' && (
          <button
            type="button"
            data-guide="inspect-practical"
            onClick={() => practical.store.event({ type: 'inspect', id })}
          >
            {t.inspect}
          </button>
        )}
      {r?.kind === 'vm' && (
        <details>
          <summary>{t.vm.cleanup}</summary>
          <p>{t.vm.cleanupNote}</p>
          <button type="button" onClick={() => onCreate({ type: 'DeleteVmBundle', vmId: id })}>
            {t.vm.cleanup}
          </button>
        </details>
      )}
    </section>
  );
}
