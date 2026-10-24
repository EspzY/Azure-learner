'use client';
import { useRef, useState } from 'react';
import { nb, regionLabels } from '@/content/nb';
import { regions } from '@/domain/simulation';
import { types, type Command, type Engine } from '@/domain/chapter01/model';
import {
  commandFor,
  creationContext,
  reviewCommand,
  type PortalLocation,
} from '@/domain/portal/model';
import { PropertyList, type Navigate } from './shared';
const p = nb.portal;
export function CreateResource({
  engine,
  location,
  sequence,
  disabled,
  onCreate,
  navigate,
}: {
  engine: Engine;
  location: PortalLocation;
  sequence: number;
  disabled: boolean;
  onCreate: (command: Command) => void;
  navigate: Navigate;
}) {
  const { world } = engine,
    kind = location.kind;
  const prior = engine.ledger.find((e) => e.request.commandId === location.edit)?.request.command;
  const context = creationContext(world, location.id, prior);
  const [name, setName] = useState(typeof prior?.name === 'string' ? prior.name : '');
  const [subscription, setSubscription] = useState(context.subscription);
  const [group, setGroup] = useState(context.group);
  const [region, setRegion] = useState(
    typeof prior?.region === 'string'
      ? prior.region
      : typeof prior?.metadataRegion === 'string'
        ? prior.metadataRegion
        : 'norwayeast',
  );
  const [plan, setPlan] = useState(context.plan);
  const [step, setStep] = useState<'basics' | 'tags' | 'review'>('basics');
  const submitted = useRef(false);
  const command = commandFor(kind, { name, subscription, group, region, plan });
  const preview = step === 'review' ? reviewCommand(engine, command, sequence) : null;
  const preflightReady =
    preview?.outcome === 'accepted' || preview?.code === 'policy-location-denied';
  const chosenGroup = world.groups.find((g) => g.id === group),
    chosenPlan = world.resources.find((r) => r.id === plan && r.type === types.plan);
  return (
    <div className="portal-create">
      <p>{p.createNote}</p>
      <nav className="portal-create-tabs" aria-label={p.review}>
        {(['basics', ...(kind === 'group' ? ['tags' as const] : []), 'review'] as const).map(
          (s) => (
            <button
              type="button"
              key={s}
              aria-current={step === s ? 'step' : undefined}
              onClick={() => setStep(s)}
            >
              {p[s]}
            </button>
          ),
        )}
      </nav>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 'basics') {
            setStep(kind === 'group' ? 'tags' : 'review');
            return;
          }
          if (step === 'tags') {
            setStep('review');
            return;
          }
          if (!disabled && preflightReady && !submitted.current) {
            submitted.current = true;
            onCreate(command);
          }
        }}
      >
        {step === 'basics' ? (
          <>
            <h2>{p.projectDetails}</h2>
            <div className="portal-fields">
              <label>
                {p.subscription}
                <select
                  value={
                    kind === 'group' ? subscription : (chosenGroup?.subscriptionId ?? subscription)
                  }
                  onChange={(e) => {
                    setSubscription(e.target.value);
                    if (kind !== 'group') {
                      setGroup('');
                      setPlan('');
                    }
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
              {kind !== 'group' && (
                <label>
                  {p.group}
                  <select
                    value={group}
                    onChange={(e) => {
                      setGroup(e.target.value);
                      setPlan('');
                    }}
                  >
                    <option value="">{p.noGroup}</option>
                    {world.groups
                      .filter(
                        (g) => g.subscriptionId === (chosenGroup?.subscriptionId ?? subscription),
                      )
                      .map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                  </select>
                </label>
              )}
            </div>
            <h2>{p.instanceDetails}</h2>
            <div className="portal-fields">
              <label>
                {kind === 'group' ? p.groupName : p.name}
                <input
                  autoComplete="off"
                  required
                  maxLength={90}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <p className="portal-field-hint">{p.nameNote}</p>
              {kind !== 'app' ? (
                <label>
                  {p.region}
                  <select value={region} onChange={(e) => setRegion(e.target.value)}>
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
                    {p.plan}
                    <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                      <option value="">{p.noPlan}</option>
                      {world.resources
                        .filter((r) => r.type === types.plan)
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name} · {regionLabels[r.location]}
                          </option>
                        ))}
                    </select>
                  </label>
                  <PropertyList
                    items={[
                      [p.resourceLocation, chosenPlan ? regionLabels[chosenPlan.location] : '—'],
                      [p.os, chosenPlan?.os ?? '—'],
                    ]}
                  />
                </>
              )}
            </div>
            <p className="portal-inline-info">
              {kind === 'group' ? p.locationNote : kind === 'plan' ? p.planNote : p.appNote}
            </p>
            {kind === 'plan' && (
              <PropertyList
                items={[
                  [p.os, 'Linux'],
                  [p.profile, 'linux-learning-v1'],
                ]}
              />
            )}
          </>
        ) : step === 'tags' ? (
          <section>
            <h2>{p.tags}</h2>
            <p>{p.tagsUnsupported}</p>
          </section>
        ) : (
          <section className="portal-review">
            <h2>{p.review}</h2>
            <div
              role="status"
              className={preflightReady ? 'portal-validation-valid' : 'portal-validation-error'}
            >
              <strong>{p.validation}</strong>
              <p>{preflightReady ? p.valid : p.invalid}</p>
              {!preflightReady && preview && <p>{nb.chapter.errors[preview.code]}</p>}
            </div>
            <PropertyList
              items={[
                [p.name, name],
                [
                  p.subscription,
                  world.scopes.find(
                    (s) => s.id === (kind === 'group' ? subscription : chosenGroup?.subscriptionId),
                  )?.name,
                ],
                [p.group, kind === 'group' ? name : chosenGroup?.name],
                [
                  kind === 'group' ? p.metadata : p.resourceLocation,
                  kind === 'app'
                    ? chosenPlan
                      ? regionLabels[chosenPlan.location]
                      : '—'
                    : regionLabels[region as keyof typeof regionLabels],
                ],
                [p.os, kind === 'group' ? '—' : 'Linux'],
                [p.plan, kind === 'app' ? chosenPlan?.name : '—'],
              ]}
            />
            <p>{kind === 'group' ? p.locationNote : kind === 'plan' ? p.planNote : p.appNote}</p>
          </section>
        )}
        <footer className="portal-create-footer">
          {step !== 'basics' && (
            <button type="button" onClick={() => setStep('basics')}>
              {p.previous}
            </button>
          )}
          <button
            type="submit"
            className="primary"
            disabled={disabled || (step === 'review' && !preflightReady)}
          >
            {step === 'review' ? p.create : step === 'tags' ? p.review : p.next}
          </button>
          {step !== 'review' && (
            <button type="button" onClick={() => setStep('review')}>
              {p.review}
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              navigate(kind === 'group' ? 'groups' : kind === 'plan' ? 'plans' : 'apps')
            }
          >
            {p.close}
          </button>
        </footer>
      </form>
    </div>
  );
}
