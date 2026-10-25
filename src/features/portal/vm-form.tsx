'use client';
import { useEffect, useRef, useState } from 'react';
import { labsNb as t, nb, operationExplanation, regionLabels } from '@/content/nb';
import { regions } from '@/domain/simulation';
import type { Engine as BaseEngine } from '@/domain/chapter01/model';
import { infrastructure, type Command } from '@/domain/sandbox/model';
import { executeCurrent } from '@/domain/sandbox/replay';
import { creationContext, requestFor, type PortalLocation } from '@/domain/portal/model';
import { PropertyList, type Navigate } from './shared';
export interface VmFormView {
  tab: number;
  name: string;
  group: string;
  valid: boolean;
}
export function VmForm({
  engine,
  location,
  sequence,
  disabled,
  onCreate,
  navigate,
  onObserve,
}: {
  engine: BaseEngine;
  location: PortalLocation;
  sequence: number;
  disabled: boolean;
  onCreate: (c: Command) => boolean;
  navigate: Navigate;
  onObserve?: (view: VmFormView | null) => void;
}) {
  const world = engine.world,
    prior = engine.ledger.find((e) => e.request.commandId === location.edit)?.request.command,
    context = creationContext(world, location.id, prior);
  const submitted = useRef(false);
  const [subscription, setSubscription] = useState(context.subscription),
    [group, setGroup] = useState(context.group);
  const [name, setName] = useState(typeof prior?.name === 'string' ? prior.name : ''),
    [region, setRegion] = useState(
      typeof prior?.region === 'string' ? prior.region : 'northeurope',
    ),
    [image, setImage] = useState(typeof prior?.image === 'string' ? prior.image : 'ubuntu-22-04'),
    [profile, setProfile] = useState(typeof prior?.profile === 'string' ? prior.profile : 'small');
  const [data, setData] = useState(
      typeof prior?.dataDiskGiB === 'string' ? prior.dataDiskGiB : '0',
    ),
    [subnet, setSubnet] = useState(typeof prior?.subnetId === 'string' ? prior.subnetId : ''),
    [tab, setTab] = useState(0);
  const command: Command = {
    type: 'CreateVmBundle',
    groupId: group,
    name,
    region,
    image,
    profile,
    dataDiskGiB: data,
    subnetId: subnet,
  };
  const preview =
    tab === 3 ? executeCurrent(engine, requestFor(engine, command, sequence, true)).receipt : null;
  useEffect(() => {
    onObserve?.({ tab, name, group, valid: preview?.outcome === 'accepted' });
  }, [onObserve, tab, name, group, preview?.outcome]);
  useEffect(() => () => onObserve?.(null), [onObserve]);
  const groups = world.groups.filter((g) => g.subscriptionId === subscription);
  return (
    <div className="portal-create vm-create">
      <p>{t.vm.note}</p>
      <nav className="portal-form-tabs" aria-label={t.vm.title}>
        {t.vm.tabs.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-current={tab === i ? 'step' : undefined}
            onClick={() => setTab(i)}
          >
            {label}
          </button>
        ))}
      </nav>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (tab < 3) setTab(tab + 1);
          else if (preview?.outcome === 'accepted' && !submitted.current) {
            submitted.current = true;
            if (!onCreate(command)) submitted.current = false;
          }
        }}
      >
        {tab === 0 && (
          <>
            <h2>{nb.portal.projectDetails}</h2>
            <label>
              {nb.portal.subscription}
              <select
                data-guide="subscription"
                value={subscription}
                onChange={(e) => {
                  setSubscription(e.target.value);
                  setGroup('');
                  setSubnet('');
                }}
              >
                {world.scopes
                  .filter((s) => s.kind === 'subscription')
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              {nb.portal.group}
              <select
                data-guide="group"
                value={group}
                required
                onChange={(e) => {
                  setGroup(e.target.value);
                  setSubnet('');
                }}
              >
                <option value="">—</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </label>
            {!groups.length && (
              <p>
                {t.vm.noGroup}{' '}
                <button
                  type="button"
                  onClick={() => navigate('create', { kind: 'group', id: subscription })}
                >
                  {nb.portal.createTitles.group}
                </button>
              </p>
            )}
            <h2>{nb.portal.instanceDetails}</h2>
            <label>
              {t.vm.name}
              <input
                data-guide="name"
                value={name}
                required
                maxLength={15}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <p className="portal-inline-info">{t.vm.naming}</p>
            <label>
              {nb.portal.resourceLocation}
              <select
                data-guide="region"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setSubnet('');
                }}
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {regionLabels[r]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.vm.image}
              <select
                data-guide="vm-image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              >
                {Object.entries(t.vm.images).map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t.vm.profile}
              <select
                data-guide="vm-profile"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
              >
                {Object.entries(t.vm.profiles).map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <p>{t.vm.units}</p>
          </>
        )}
        {tab === 1 && (
          <>
            <h2>{t.vm.osDisk}</h2>
            <p>{t.vm.osNote}</p>
            <PropertyList
              items={[
                [t.vm.image, t.vm.images[image as keyof typeof t.vm.images]],
                [t.vm.osDisk, image === 'windows-2022' ? '128 GiB' : '64 GiB'],
              ]}
            />
            <label>
              {t.vm.dataDisk}
              <select data-guide="vm-disk" value={data} onChange={(e) => setData(e.target.value)}>
                <option value="0">{t.vm.noData}</option>
                <option value="32">32 GiB</option>
                <option value="64">64 GiB</option>
              </select>
            </label>
            <p>{t.vm.dataNote}</p>
          </>
        )}
        {tab === 2 && (
          <>
            <h2>{t.vm.network}</h2>
            <label>
              {t.vm.network}
              <select
                data-guide="vm-network"
                value={subnet}
                onChange={(e) => setSubnet(e.target.value)}
              >
                <option value="">{t.vm.newNetwork}</option>
                {infrastructure(world)
                  .filter(
                    (r) => r.kind === 'subnet' && r.groupId === group && r.location === region,
                  )
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </label>
            <p>{t.vm.networkNote}</p>
          </>
        )}
        {tab === 3 && (
          <>
            <h2>{t.vm.tabs[3]}</h2>
            <p>{t.vm.review}</p>
            <PropertyList
              items={[
                [nb.portal.name, name],
                [nb.portal.group, world.groups.find((g) => g.id === group)?.name],
                [nb.portal.resourceLocation, regionLabels[region as keyof typeof regionLabels]],
                [t.vm.image, t.vm.images[image as keyof typeof t.vm.images]],
                [t.vm.profile, t.vm.profiles[profile as keyof typeof t.vm.profiles]],
                [t.vm.dataDisk, data === '0' ? t.vm.noData : `${data} GiB`],
                [t.vm.network, subnet || t.vm.newNetwork],
              ]}
            />
            <div
              data-guide="validation"
              role="status"
              className={
                preview?.outcome === 'accepted' ? 'portal-validation-ok' : 'portal-validation-error'
              }
            >
              {preview && operationExplanation(preview)}{' '}
              {preview?.field && <strong>{preview.field}</strong>}
            </div>
          </>
        )}
        <footer className="portal-create-footer">
          <button type="button" onClick={() => setTab(Math.max(0, tab - 1))} disabled={tab === 0}>
            {nb.portal.previous}
          </button>
          <button
            data-guide={tab === 3 ? 'commit' : 'review'}
            type="submit"
            disabled={disabled || (tab === 3 && preview?.outcome !== 'accepted')}
          >
            {tab === 3 ? nb.portal.create : t.vm.tabs[tab + 1]}
          </button>
        </footer>
      </form>
    </div>
  );
}
