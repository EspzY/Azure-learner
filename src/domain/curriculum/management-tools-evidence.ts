import type { Engine, Plan, WebApp } from '../chapter01/model';
import { types } from '../chapter01/model';
import { replayEngine } from '../sandbox/replay';
import type { ToolsGuide } from './management-tools';
/** Original local commands only; the conceptual definition never dispatches or fabricates one. */
export function toolsNativeEvidence(g: ToolsGuide, engine: Engine | undefined, attempt: number) {
  const checks = {
    group: false,
    scope: false,
    plan: false,
    app: false,
    receipts: false,
    dependency: false,
  };
  const empty = {
    verifiable: false,
    complete: false,
    checks,
    group: null as string | null,
    plan: null as string | null,
    app: null as string | null,
    receipts: [] as string[],
  };
  if (g.mission !== 'intent' || g.attempt !== attempt || !engine || g.through === null)
    return empty;
  const index = (id: string | null) =>
    id === null ? -1 : engine.ledger.findIndex((x) => x.receipt.commandId === id);
  const start = index(g.boundary),
    end = index(g.through);
  if ((g.boundary !== null && start < 0) || end < 0 || end < start) return empty;
  const snap = replayEngine(engine, end + 1);
  if (!snap) return empty;
  const entries = engine.ledger
    .slice(start + 1, end + 1)
    .filter((x) => x.receipt.outcome === 'accepted' && x.receipt.code === 'created');
  const inspected = (kind: string, id: string) => g.inspected.includes(`${kind}:${id}`);
  const candidates = entries
    .filter((e) => e.receipt.operation === 'CreateGroup')
    .flatMap((ge) => {
      const group = snap.world.groups.find(
        (x) =>
          ge.receipt.addedIds.includes(x.id) &&
          x.subscriptionId === 'sub-app' &&
          x.metadataLocation === 'norwayeast',
      );
      if (!group) return [];
      const plans = entries
        .filter(
          (e) => e.receipt.operation === 'CreatePlan' && e.request.command.groupId === group.id,
        )
        .flatMap((pe) => {
          const plan = snap.world.resources.find(
            (p): p is Plan =>
              p.type === types.plan &&
              pe.receipt.addedIds.includes(p.id) &&
              p.groupId === group.id &&
              p.location === 'westeurope',
          );
          return plan ? [{ plan, pe }] : [];
        });
      type Entry = Engine['ledger'][number];
      type Tuple = {
        plan: Plan | undefined;
        pe: Entry | undefined;
        app: WebApp | undefined;
        ae: Entry | undefined;
      };
      const tuples = plans.flatMap<Tuple>(({ plan, pe }) => {
        const apps = entries
          .filter(
            (e) =>
              e.receipt.operation === 'CreateWebApp' &&
              e.request.command.groupId === group.id &&
              e.request.command.planId === plan.id,
          )
          .flatMap((ae) => {
            const app = snap.world.resources.find(
              (a): a is WebApp =>
                a.type === types.app &&
                ae.receipt.addedIds.includes(a.id) &&
                a.groupId === group.id &&
                a.planId === plan.id,
            );
            return app ? [{ app, ae }] : [];
          });
        return apps.length
          ? apps.map((x) => ({ plan, pe, ...x }))
          : [{ plan, pe, app: undefined, ae: undefined }];
      });
      return (
        tuples.length ? tuples : [{ plan: undefined, pe: undefined, app: undefined, ae: undefined }]
      ).map(({ plan, pe, app, ae }) => {
        const ids = [ge, pe, ae].flatMap((e) => (e ? [e.receipt.commandId] : []));
        const checks = {
          group: inspected('resource', group.id),
          scope: inspected('resource', 'sub-app'),
          plan: !!plan && inspected('resource', plan.id),
          app: !!app && inspected('resource', app.id),
          receipts: ids.length === 3 && ids.every((id) => inspected('receipt', id)),
          dependency: !!app && !!plan && inspected('dependency', app.id),
        };
        return {
          verifiable: true,
          complete: Object.values(checks).every(Boolean),
          checks,
          group: group.id,
          plan: plan?.id ?? null,
          app: app?.id ?? null,
          receipts: ids,
        };
      });
    });
  return (
    candidates.sort(
      (a, b) =>
        Number(b.complete) - Number(a.complete) ||
        Object.values(b.checks).filter(Boolean).length -
          Object.values(a.checks).filter(Boolean).length,
    )[0] ?? { ...empty, verifiable: true }
  );
}
