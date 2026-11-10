'use client';
import { useState } from 'react';
import Link from 'next/link';
import { accessNb as c } from '@/content/nb';
import {
  initialAccess,
  sandboxScopeContext,
  type AccessInput,
  type AccessPolicy,
  type RbacInput,
} from '@/domain/curriculum/access-control-model';
import { managementHierarchy } from '@/domain/curriculum/architecture-management';
import { useSandbox } from '@/features/portal/sandbox-provider';
export function AccessControls({
  input,
  change,
}: {
  input: AccessInput;
  change: (v: AccessInput) => void;
}) {
  const select = (key: string, label: string, options: Record<string, string>) => (
    <label className="compute-control" key={key}>
      <span>{label}</span>
      <select
        value={String(input[key as keyof typeof input])}
        onChange={(e) => change({ ...input, [key]: e.target.value } as AccessInput)}
      >
        {Object.entries(options).map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
  const check = (key: string, label: string) => (
    <label className="storage-check" key={key}>
      <input
        type="checkbox"
        checked={Boolean(input[key as keyof typeof input])}
        onChange={(e) => change({ ...input, [key]: e.target.checked } as AccessInput)}
      />
      <span>{label}</span>
    </label>
  );
  if (input.kind === 'rbac')
    return (
      <>
        {select('principal', c.controls.principal, c.options.principal)}
        {select('assignment', c.controls.assignment, c.options.assignment)}
        {check('member', c.controls.member)}
        {select('role', c.controls.role, c.options.roles)}
        {select(
          'scope',
          c.controls.scope,
          Object.fromEntries(input.context.nodes.map((n) => [n.id, n.name])),
        )}
        {select(
          'target',
          c.controls.target,
          Object.fromEntries(input.context.nodes.map((n) => [n.id, n.name])),
        )}
        {select('action', c.controls.action, c.options.action)}
        <p className="access-control-boundary">{c.visual.rbacAssumptions}</p>
        <details className="access-advanced">
          <summary>{c.visual.details}</summary>
          {select('second', c.controls.second, c.options.roles)}
          {select('route', c.controls.route, c.options.route)}
          {check('deny', c.controls.deny)}
        </details>
        <SandboxContext input={input} change={change} />
      </>
    );
  const policy = (key: 'policyA' | 'policyB') => {
    const value = input[key],
      label = `${c.visual.policy} ${key === 'policyA' ? 'A' : 'B'}`;
    const sel = (field: keyof AccessPolicy, name: string, options: Record<string, string>) => (
      <label className="compute-control">
        <span>{name}</span>
        <select
          aria-label={`${label} · ${name}`}
          value={String(value[field])}
          onChange={(e) => change({ ...input, [key]: { ...value, [field]: e.target.value } })}
        >
          {Object.entries(options).map(([v, t]) => (
            <option key={v} value={v}>
              {t}
            </option>
          ))}
        </select>
      </label>
    );
    return (
      <fieldset className="access-policy" key={key}>
        <legend>{label}</legend>
        {sel('state', c.controls.state, c.options.state)}
        {sel('audience', c.controls.audience, c.options.audience)}
        {sel('app', c.controls.policyApp, c.options.policyApp)}
        {sel('location', c.controls.policyLocation, c.options.policyLocation)}
        {sel('control', c.controls.control, c.options.control)}
        <label className="storage-check">
          <input
            type="checkbox"
            aria-label={`${label} · ${c.controls.excludeEmergency}`}
            checked={value.excludeEmergency}
            onChange={(e) =>
              change({ ...input, [key]: { ...value, excludeEmergency: e.target.checked } })
            }
          />
          <span>{c.controls.excludeEmergency}</span>
        </label>
      </fieldset>
    );
  };
  return (
    <>
      {select('subject', c.controls.subject, c.options.subject)}
      {check('member', c.controls.teamMember)}
      {select('app', c.controls.app, c.options.app)}
      {select('location', c.controls.location, c.options.location)}
      {check('authenticated', c.controls.authenticated)}
      {check('mfa', c.controls.mfa)}
      {check('compliant', c.controls.compliant)}
      <div className="access-policy-grid">
        {policy('policyA')}
        {policy('policyB')}
      </div>
      {select('authorization', c.controls.authorization, c.options.authorization)}
      <p className="access-control-boundary">{c.visual.assumptions}</p>
    </>
  );
}
function SandboxContext({ input, change }: { input: RbacInput; change: (v: AccessInput) => void }) {
  const live = useSandbox(),
    [selected, setSelected] = useState(''),
    world = live.attempt.engine.world,
    nodes = managementHierarchy(world).filter(
      (n) => !['management', 'subscription'].includes(n.kind),
    ),
    node = nodes.find((n) => n.id === selected) ?? nodes[0],
    context = node ? sandboxScopeContext(world, node.id) : null;
  return (
    <section className="access-sandbox" aria-label={c.sandbox.title}>
      <h4>{c.sandbox.title}</h4>
      <p>{c.sandbox.text}</p>
      {!live.ready || live.issue ? (
        <p role="status">{c.sandbox.unsafe}</p>
      ) : (
        <>
          <label className="compute-control">
            <span>{c.sandbox.select}</span>
            <select
              value={node?.id ?? ''}
              disabled={!nodes.length}
              onChange={(e) => setSelected(e.target.value)}
            >
              {!nodes.length && <option value="">{c.sandbox.empty}</option>}
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name} · {n.kind}
                </option>
              ))}
            </select>
          </label>
          {context && (
            <>
              <ol>
                {[...context.nodes].reverse().map((n) => (
                  <li key={n.id}>
                    {n.name} · {n.kind}
                  </li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() =>
                  change({ ...input, context, scope: node!.id, target: node!.id, action: 'view' })
                }
              >
                {c.sandbox.use}
              </button>
            </>
          )}
          <h4>{c.sandbox.policy}</h4>
          <ul>
            {world.policies.map((p) => (
              <li key={p.id}>
                <code>{p.id}</code> · {p.scopeId} · {p.targetTypes.join(', ')} ·{' '}
                {p.allowedLocations.join(', ')}
              </li>
            ))}
          </ul>
          <p>{c.sandbox.policyLimit}</p>
        </>
      )}
      {input.context.origin === 'sandbox' && (
        <button type="button" onClick={() => change(initialAccess('rbac'))}>
          {c.sandbox.reset}
        </button>
      )}
      <Link href="/portal">{c.links.sandbox} →</Link>
    </section>
  );
}
