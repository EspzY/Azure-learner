'use client';
import { useState } from 'react';
import { nb, regionLabels } from '@/content/nb';
import { regions } from '@/domain/simulation';
import { types, type Command, type World } from '@/domain/chapter01/model';
export function CommandPanel({
  kind,
  world,
  scopeId,
  last,
  disabled,
  onSubmit,
}: {
  kind: 'CreateGroup' | 'CreatePlan' | 'CreateWebApp';
  world: World;
  scopeId: string;
  last?: Command;
  disabled: boolean;
  onSubmit: (command: Command) => void;
}) {
  const t = nb.chapter;
  const [name, setName] = useState(last && 'name' in last && last.type === kind ? last.name : '');
  const [subscription, setSubscription] = useState(
    scopeId.startsWith('sub-') ? scopeId : 'sub-app',
  );
  const [groupId, setGroupId] = useState(
    world.groups.some((g) => g.id === scopeId)
      ? scopeId
      : (world.resources.find((r) => r.id === scopeId)?.groupId ?? world.groups[0]?.id ?? ''),
  );
  const [region, setRegion] = useState(
    last?.type === 'CreatePlan' && kind === 'CreatePlan'
      ? last.region
      : kind === 'CreateGroup'
        ? 'norwayeast'
        : 'northeurope',
  );
  const [planId, setPlanId] = useState(
    world.resources.some((r) => r.id === scopeId && r.type === types.plan) ? scopeId : '',
  );
  const plan = world.resources.find((r) => r.id === planId && r.type === types.plan);
  return (
    <form
      className="chapter-command"
      onSubmit={(event) => {
        event.preventDefault();
        const command: Command =
          kind === 'CreateGroup'
            ? { type: kind, name, subscriptionId: subscription, metadataRegion: region }
            : kind === 'CreatePlan'
              ? { type: kind, name, groupId, region, profile: 'linux-learning-v1' }
              : { type: kind, name, groupId, planId };
        onSubmit(command);
      }}
    >
      <p className="eyebrow">{t.supported}</p>
      <h2>{kind === 'CreateGroup' ? t.newGroup : kind === 'CreatePlan' ? t.newPlan : t.newApp}</h2>
      <label>
        {t.name}
        <input
          name="resource-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={90}
          autoComplete="off"
          aria-describedby="chapter-name-hint"
        />
      </label>
      <p id="chapter-name-hint" className="field-note">
        {kind === 'CreateGroup' ? nb.mission.simulationNote : t.nameNote}
      </p>
      {kind === 'CreateGroup' ? (
        <label>
          {t.subscription}
          <select value={subscription} onChange={(event) => setSubscription(event.target.value)}>
            {world.scopes
              .filter((s) => s.kind === 'subscription')
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
          </select>
        </label>
      ) : (
        <label>
          {t.group}
          <select value={groupId} onChange={(event) => setGroupId(event.target.value)}>
            {world.groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
      )}
      {kind !== 'CreateWebApp' ? (
        <label>
          {kind === 'CreateGroup' ? t.metadata : t.planRegion}
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            {regions.map((r) => (
              <option value={r} key={r}>
                {regionLabels[r]}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <>
          <label>
            {t.hostingPlan}
            <select value={planId} onChange={(event) => setPlanId(event.target.value)}>
              <option value="">{t.noPlan}</option>
              {world.resources
                .filter((r) => r.type === types.plan)
                .map((p) => (
                  <option value={p.id} key={p.id}>
                    {p.name} · {regionLabels[p.location]}
                  </option>
                ))}
            </select>
          </label>
          <div className="derived-location">
            <small>{t.derivedLocation}</small>
            <strong>{plan ? regionLabels[plan.location] : '—'}</strong>
          </div>
        </>
      )}
      {kind === 'CreatePlan' && (
        <div className="supported-profile">
          <strong>{t.profile}</strong>
          <p>{t.profileNote}</p>
        </div>
      )}
      <button
        type="submit"
        className="button button-primary"
        disabled={disabled || (kind !== 'CreateGroup' && !groupId)}
      >
        {t.create}
      </button>
      <p className="field-note">{t.boundary}</p>
    </form>
  );
}
