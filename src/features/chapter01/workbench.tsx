'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  FileText,
  Layers3,
  List,
  Network,
  RotateCcw,
  Shield,
  X,
} from 'lucide-react';
import { nb, regionLabels } from '@/content/nb';
import { types, type Command } from '@/domain/chapter01/model';
import {
  currentStage,
  findings,
  roleEntities,
  type Role,
  type StageId,
} from '@/domain/chapter01/scenario';
import { ScopeGraph } from '@/features/organization/scope-graph';
import { CommandDialog } from '@/components/command-dialog';
import { useExpedition } from '@/features/journey/expedition-provider';
import { useChapter } from './provider';
import { projectWorld } from './projection';
import { ChapterScene } from './chapter-scene';
import { CommandPanel } from './command-panel';
import { ReceiptPanel } from './receipt-panel';
import {
  LocationDecisions,
  LocationsPanel,
  ResponsibilityPanel,
  TechnicalDepth,
} from './learning-panels';

type Panel =
  | 'brief'
  | 'inspect'
  | 'responsibility'
  | 'prediction'
  | 'policy'
  | 'receipt'
  | 'locations'
  | 'explain'
  | 'CreateGroup'
  | 'CreatePlan'
  | 'CreateWebApp';
export function ChapterWorkbench() {
  const params = useSearchParams();
  const fromGame = params.get('from') === 'rpg-g1';
  const fromJourney = params.get('journey') === '1';
  const { attempt, ready, issue, attemptNumber, store } = useChapter();
  const { state: expedition, update: updateExpedition } = useExpedition();
  const { world } = attempt.engine;
  const projection = useMemo(() => projectWorld(world), [world]);
  const [selected, setSelected] = useState('sub-app');
  const [view, setView] = useState<'spatial' | 'diagram' | 'list'>('spatial');
  const [panel, setPanel] = useState<Panel>('brief');
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [lastCommand, setLastCommand] = useState<Command>();
  const [dialog, setDialog] = useState<'reset' | 'delete' | null>(null);
  const consoleRef = useRef<HTMLElement>(null);
  const previousPanel = useRef(panel);
  const t = nb.chapter;
  const stage = currentStage(attempt);
  const goals = findings(attempt);
  const bound = roleEntities(attempt);
  const selectedScope = projection.scopes.find((s) => s.id === selected);
  const selectedGroup = world.groups.find((g) => g.id === selected);
  const selectedResource = world.resources.find((r) => r.id === selected);
  const groupId = selectedGroup?.id ?? selectedResource?.groupId ?? bound.group?.id;
  const receipt =
    attempt.responses.findLast((r) => r.commandId === receiptId) ?? attempt.responses.at(-1);
  const canAct = ready && !['corrupt', 'unsupported', 'conflict', 'limit'].includes(issue ?? '');
  const labels = Object.fromEntries(
    projection.scopes.map((s) => [
      s.id,
      s.kind === 'resource'
        ? projection.models[s.id] === 'plan'
          ? t.kindLabels.plan
          : t.kindLabels.app
        : t.kindLabels[s.kind],
    ]),
  );
  useEffect(() => {
    if (previousPanel.current !== panel && consoleRef.current) {
      consoleRef.current.scrollTop = 0;
      consoleRef.current.focus({ preventScroll: true });
    }
    previousPanel.current = panel;
  }, [panel]);
  function select(id: string) {
    setSelected(id);
    setPanel('inspect');
  }
  function inspectReceipt(id?: string) {
    const target = id ?? attempt.responses.at(-1)?.commandId;
    if (target) store.dispatch({ kind: 'inspect-receipt', commandId: target });
    setReceiptId(target ?? null);
    setPanel('receipt');
  }
  function inspectPolicy() {
    store.dispatch({ kind: 'inspect-policy' });
    setSelected('sub-app');
    setPanel('policy');
  }
  function create(command: Command) {
    const before = store.getSnapshot();
    const ok = store.dispatch({
      kind: 'command',
      request: {
        commandId: `attempt-${attemptNumber}-event-${before.attempt.events.length + 1}`,
        expectedWorldRevision: before.attempt.engine.world.revision,
        command,
      },
      bindResult: true,
    });
    if (!ok) return;
    setLastCommand(command);
    const result = store.getSnapshot().attempt.responses.at(-1)!;
    setReceiptId(result.commandId);
    if (result.outcome === 'accepted') {
      const id = result.addedIds[0];
      if (id) {
        setSelected(id);
        requestAnimationFrame(() =>
          document.getElementById(`scene-node-${id}`)?.focus({ preventScroll: true }),
        );
      }
      setPanel('inspect');
    } else {
      store.dispatch({ kind: 'inspect-receipt', commandId: result.commandId });
      setPanel('receipt');
    }
  }
  function openCommand(kind: 'CreateGroup' | 'CreatePlan' | 'CreateWebApp') {
    if (kind !== 'CreateGroup' && !groupId) return;
    if (kind === 'CreatePlan' && !attempt.prediction) {
      setPanel('prediction');
      return;
    }
    setPanel(kind);
  }
  function openStage(id: StageId) {
    if (id === 'organize' || id === 'construct') {
      setSelected(bound.group?.id ?? 'sub-app');
      setPanel('inspect');
    } else if (id === 'investigate') inspectPolicy();
    else if (id === 'guided-built') setPanel('explain');
    else setPanel(id === 'predict' ? 'prediction' : id);
  }
  function bind(role: Role) {
    store.dispatch({ kind: 'bind', role, id: selected });
  }
  function exportWork() {
    const url = URL.createObjectURL(
      new Blob([store.exportSnapshot()], { type: 'application/json' }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `azurelab-guided-${attemptNumber}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const topic = selectedResource ? 'hosting' : 'scope';
  return (
    <section className={`chapter-world chapter-view-${view}`} aria-labelledby="chapter-title">
      <header className="chapter-heading">
        <div>
          <p className="eyebrow">{t.sector}</p>
          <h1 id="chapter-title">{t.title}</h1>
        </div>
        <Link
          href={
            fromGame
              ? '/legacy/rpg?return=chapter01'
              : fromJourney
                ? '/legacy-expedition?at=gateway'
                : '/portal'
          }
          onClick={() =>
            fromJourney &&
            updateExpedition((old) => ({
              ...old,
              stop: 'gateway',
              visited: [...new Set([...old.visited, 'gateway' as const])],
            }))
          }
        >
          {fromGame ? nb.rpg.returnToWorld : t.return}
          <ArrowRight size={15} />
        </Link>
      </header>
      <nav className="chapter-objectives" aria-label={t.objective}>
        {goals.map((goal) => (
          <button
            type="button"
            key={goal.id}
            className={`${goal.met ? 'met' : ''} ${goal.id === stage ? 'current' : ''}`}
            aria-current={goal.id === stage ? 'step' : undefined}
            onClick={() => openStage(goal.id)}
          >
            <span>{goal.met ? <Check size={12} /> : '○'}</span>
            {t.stages[goal.id]}
          </button>
        ))}
      </nav>
      <div className="chapter-scene">
        {view === 'spatial' ? (
          <ChapterScene
            projection={projection}
            selected={selected}
            onSelect={select}
            receipt={receipt}
            policyActive={panel === 'policy'}
            comparison={panel === 'locations'}
            onPolicy={inspectPolicy}
            onReceipt={() => inspectReceipt(receipt?.commandId)}
            labels={labels}
          />
        ) : view === 'diagram' ? (
          <ScopeGraph
            scopes={projection.scopes}
            selected={selected}
            onSelect={select}
            layout={projection.layout}
            labels={labels}
            dependencies={projection.dependencies}
          />
        ) : (
          <div className="chapter-inventory" role="region" aria-label={t.list}>
            {projection.scopes.map((s) => (
              <button
                type="button"
                aria-pressed={selected === s.id}
                key={s.id}
                onClick={() => select(s.id)}
              >
                <small>{labels[s.id]}</small>
                <strong>{s.label}</strong>
                {s.region && <span>{regionLabels[s.region]}</span>}
              </button>
            ))}
          </div>
        )}
        <div className="chapter-view-switch" role="group" aria-label={t.views}>
          {(
            [
              { id: 'spatial', label: t.spatial, icon: Layers3 },
              { id: 'diagram', label: t.diagram, icon: Network },
              { id: 'list', label: t.list, icon: List },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button type="button" key={id} aria-pressed={view === id} onClick={() => setView(id)}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
        <div className="chapter-relation-key">
          <span className="key-identity">{t.relationLabels['identity-authority']}</span>
          <span className="key-management">{t.relationLabels['management-parent']}</span>
          <span className="key-membership">{t.relationLabels['resource-member']}</span>
          <span className="key-hosting">{t.relationLabels['depends-on']}</span>
        </div>
        <div className="chapter-event-tray" role="group" aria-label={t.receipts}>
          {attempt.responses.slice(-4).map((r, i) => (
            <button
              type="button"
              key={`${r.commandId}-${i}`}
              className={`tray-${r.outcome}`}
              onClick={() => inspectReceipt(r.commandId)}
            >
              <FileText size={15} />
              <span>
                {t.outcomes[r.outcome]}
                <small>{r.code}</small>
              </span>
              <code>
                {r.beforeRevision} → {r.afterRevision}
              </code>
            </button>
          ))}
        </div>
      </div>
      <aside className="chapter-console" ref={consoleRef} tabIndex={-1} aria-label={t.inspect}>
        <div className="chapter-attempt-line">
          <span>
            {t.attempt} {attemptNumber} · r{world.revision}
          </span>
          <button type="button" className="text-control" onClick={() => setPanel('brief')}>
            {t.brief}
          </button>
        </div>
        <div className="chapter-current-goal">
          <small>{t.objective}</small>
          <strong>{t.stages[stage]}</strong>
          <p>{t.goals[stage]}</p>
        </div>
        {issue && (
          <div className="chapter-storage-issue" role="alert">
            <p>{t.storage[issue]}</p>
            <div>
              <button type="button" className="text-control" onClick={exportWork}>
                {t.export}
              </button>
              <button type="button" className="text-control" onClick={() => store.load()}>
                {t.loadSaved}
              </button>
              {issue !== 'conflict' && (
                <button type="button" className="text-control" onClick={() => setDialog('reset')}>
                  {t.recovered}
                </button>
              )}
            </div>
          </div>
        )}
        <div className="chapter-tools" role="group" aria-label={t.tools}>
          <button type="button" onClick={() => openCommand('CreateGroup')} disabled={!canAct}>
            {t.newGroup}
          </button>
          <button
            type="button"
            onClick={() => openCommand('CreatePlan')}
            disabled={!canAct || !groupId}
            title={!groupId ? t.noGroup : undefined}
          >
            {t.newPlan}
          </button>
          <button
            type="button"
            onClick={() => openCommand('CreateWebApp')}
            disabled={!canAct || !groupId}
          >
            {t.newApp}
          </button>
          <button type="button" onClick={inspectPolicy}>
            <Shield size={13} />
            {t.policy}
          </button>
          <button type="button" onClick={() => setPanel('locations')}>
            {t.locations}
          </button>
          <button type="button" onClick={() => inspectReceipt()}>
            {t.receipts}
          </button>
        </div>
        <div className="chapter-active-panel">
          {panel === 'brief' && (
            <div className="chapter-brief">
              <h2>{t.brief}</h2>
              <p>{t.bridge}</p>
              <p>{nb.orientation.handoff}</p>
              <p>{t.requirements}</p>
              <p>{t.boundary}</p>
              <button
                type="button"
                className="button button-primary"
                onClick={() => setPanel('responsibility')}
              >
                {t.stages.responsibility}
                <ArrowRight size={16} />
              </button>
              <p className="chapter-evidence-note">{t.guidedOnly}</p>
              <Link href="/explore">
                {t.legacy}
                <ArrowRight size={13} />
              </Link>
            </div>
          )}
          {panel === 'responsibility' && (
            <ResponsibilityPanel
              key={attemptNumber}
              attempt={attempt}
              initialModel={expedition.model}
              disabled={!canAct}
              dispatch={store.dispatch}
            />
          )}
          {panel === 'prediction' && (
            <LocationDecisions
              key={`prediction-${attemptNumber}`}
              kind="prediction"
              attempt={attempt}
              disabled={!canAct}
              dispatch={store.dispatch}
              onPrediction={() => setPanel('CreatePlan')}
            />
          )}
          {panel === 'explain' && (
            <>
              <LocationDecisions
                key={`explain-${attemptNumber}`}
                kind="explain"
                attempt={attempt}
                disabled={!canAct}
                dispatch={store.dispatch}
                onPrediction={() => {}}
              />
              {stage === 'guided-built' && (
                <div className="guided-build-result" role="status">
                  <Check size={24} />
                  <h2>{t.guidedBuilt}</h2>
                  <p>{t.transferPending}</p>
                  <p>{t.guidedOnly}</p>
                </div>
              )}
            </>
          )}
          {(panel === 'CreateGroup' || panel === 'CreatePlan' || panel === 'CreateWebApp') && (
            <CommandPanel
              key={`${panel}-${groupId}-${attemptNumber}`}
              kind={panel}
              world={world}
              scopeId={
                panel === 'CreateGroup'
                  ? selected
                  : panel === 'CreateWebApp' && selectedResource?.type === types.plan
                    ? selected
                    : (groupId ?? '')
              }
              last={lastCommand}
              disabled={!canAct}
              onSubmit={create}
            />
          )}
          {panel === 'receipt' && (
            <ReceiptPanel
              receipt={receipt}
              onPolicy={inspectPolicy}
              onEdit={() =>
                setPanel(
                  lastCommand?.type === 'CreatePlan'
                    ? 'CreatePlan'
                    : lastCommand?.type === 'CreateWebApp'
                      ? 'CreateWebApp'
                      : 'inspect',
                )
              }
            />
          )}
          {panel === 'locations' && <LocationsPanel attempt={attempt} groupId={groupId} />}
          {panel === 'policy' && (
            <div className="chapter-policy-panel">
              <p className="eyebrow">{t.customPolicy}</p>
              <h2>{t.policy}</h2>
              {world.policies.map((policy) => (
                <div key={policy.id}>
                  <code>{policy.id}</code>
                  <dl className="technical-properties">
                    <div>
                      <dt>{t.policyScope}</dt>
                      <dd>
                        {world.scopes.find((s) => s.id === policy.scopeId)?.name} · {policy.scopeId}
                      </dd>
                    </div>
                    <div>
                      <dt>{t.policyTypes}</dt>
                      <dd>{policy.targetTypes.join(', ')}</dd>
                    </div>
                    <div>
                      <dt>{t.policyAllowed}</dt>
                      <dd>{policy.allowedLocations.map((r) => regionLabels[r]).join(', ')}</dd>
                    </div>
                  </dl>
                  <p>{t.policyMode}</p>
                  <p className="policy-expression">{t.policyExpression}</p>
                </div>
              ))}
              <p>{t.policyExcluded}</p>
              <p>{t.policyNuance}</p>
              <p>{t.policyExisting}</p>
              {bound.group?.subscriptionId === 'sub-app' &&
                bound.group.metadataLocation === 'norwayeast' && (
                  <>
                    <button
                      type="button"
                      className="button button-secondary"
                      disabled={!canAct}
                      onClick={() => {
                        if (store.dispatch({ kind: 'probe', groupId: bound.group!.id }))
                          inspectReceipt(store.getSnapshot().attempt.responses.at(-1)?.commandId);
                      }}
                    >
                      {t.probe}
                    </button>
                    <small>{t.probeNote}</small>
                  </>
                )}
              <TechnicalDepth topic="policy" />
            </div>
          )}
          {panel === 'inspect' && (
            <div className="chapter-inspector">
              <p className="eyebrow">{selectedScope ? labels[selected] : t.inspect}</p>
              <h2>{selectedScope?.label ?? t.choose}</h2>
              {selectedScope && (
                <>
                  <dl className="technical-properties">
                    {projection.relations
                      .filter((edge) => edge.from === selected)
                      .map((edge) => (
                        <div key={`${edge.kind}-${edge.to}`}>
                          <dt>{t.relationLabels[edge.kind]}</dt>
                          <dd>
                            <button type="button" onClick={() => select(edge.to)}>
                              {projection.scopes.find((s) => s.id === edge.to)?.label ?? edge.to}
                              <ArrowRight size={12} />
                            </button>
                          </dd>
                        </div>
                      ))}
                    {selectedScope.region && (
                      <div>
                        <dt>{selectedGroup ? t.metadataValue : t.resourceValue}</dt>
                        <dd>{regionLabels[selectedScope.region]}</dd>
                      </div>
                    )}
                  </dl>
                  {selectedGroup && (
                    <>
                      <p>{t.topics.scope.purpose}</p>
                      {(selectedGroup.subscriptionId !== 'sub-app' ||
                        selectedGroup.metadataLocation !== 'norwayeast') && (
                        <p className="requirement-mismatch">{t.mismatch}</p>
                      )}
                      <button
                        type="button"
                        className="button button-secondary"
                        disabled={!canAct}
                        onClick={() => bind('group')}
                      >
                        {t.bindGroup}
                      </button>
                      <button
                        type="button"
                        className="text-control"
                        onClick={() => setDialog('delete')}
                        disabled={!canAct}
                      >
                        {t.deleteGroup}
                      </button>
                    </>
                  )}
                  {selectedResource && (
                    <>
                      <p>{t.topics.hosting.purpose}</p>
                      <p>{t.health}</p>
                      <button
                        type="button"
                        className="button button-secondary"
                        disabled={!canAct}
                        onClick={() => bind(selectedResource.type === types.plan ? 'plan' : 'app')}
                      >
                        {selectedResource.type === types.plan ? t.bindPlan : t.bindApp}
                      </button>
                    </>
                  )}
                  <TechnicalDepth topic={topic} />
                </>
              )}
            </div>
          )}
        </div>
        <footer className="chapter-console-footer">
          <button type="button" className="text-control" onClick={() => setPanel('explain')}>
            {t.explanation}
          </button>
          <button
            type="button"
            className="text-control"
            disabled={!ready}
            onClick={() => setDialog('reset')}
          >
            <RotateCcw size={13} />
            {t.reset}
          </button>
          <p>{issue ? t.storage[issue] : t.saved}</p>
        </footer>
      </aside>
      <div className="chapter-live" role="status" aria-live="polite">
        {attempt.responses.at(-1) && (
          <span>
            {t.outcomes[attempt.responses.at(-1)!.outcome]} ·{' '}
            {t.errors[attempt.responses.at(-1)!.code]}
          </span>
        )}
      </div>
      {dialog && (
        <CommandDialog
          title={dialog === 'reset' ? t.reset : t.deleteGroup}
          onClose={() => setDialog(null)}
        >
          <p>{dialog === 'reset' ? t.resetText : t.deleteText}</p>
          <div className="dialog-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => {
                if (dialog === 'reset') {
                  store.restart();
                  setSelected('sub-app');
                  setPanel('brief');
                  setReceiptId(null);
                } else if (selectedGroup)
                  create({ type: 'DeleteEmptyGroup', groupId: selectedGroup.id });
                setDialog(null);
              }}
            >
              {dialog === 'reset' ? t.resetConfirm : t.deleteConfirm}
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setDialog(null)}
            >
              <X size={13} />
              {nb.universe.cancel}
            </button>
          </div>
        </CommandDialog>
      )}
    </section>
  );
}
