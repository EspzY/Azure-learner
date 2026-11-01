'use client';
import { governanceNb as c } from '@/content/nb';
import type { GovernanceInput } from '@/domain/curriculum/governance-model';
export function GovernanceControls({
  input,
  change,
}: {
  input: GovernanceInput;
  change: (v: GovernanceInput) => void;
}) {
  const select = (key: string, label: string, options: Record<string, string>) => (
    <label className="compute-control" key={key}>
      <span>{label}</span>
      <select
        value={String(input[key as keyof typeof input])}
        onChange={(e) => change({ ...input, [key]: e.target.value } as GovernanceInput)}
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
        onChange={(e) => change({ ...input, [key]: e.target.checked } as GovernanceInput)}
      />
      <span>{label}</span>
    </label>
  );
  if (input.kind === 'data')
    return (
      <>
        {select('asset', c.controls.asset, c.options.asset)}
        {check('registered', c.controls.registered)}
        {check('catalogAccess', c.controls.catalogAccess)}
        {select('classification', c.controls.classification, c.options.classification)}
        {select('owner', c.controls.owner, c.options.owner)}
        {check('glossary', c.controls.glossary)}
        {check('lineage', c.controls.lineage)}
        {check('sourceAuthorized', c.controls.sourceAuthorized)}
        <p className="governance-control-boundary">{c.visual.notAccess}</p>
      </>
    );
  if (input.kind === 'policy')
    return (
      <>
        {select('resourceType', c.controls.resourceType, c.options.resourceType)}
        {select(
          'resourceScope',
          c.controls.resourceScope,
          Object.fromEntries(
            ['rg-app', 'rg-shared'].map((k) => [k, c.options.scopes[k as 'rg-app' | 'rg-shared']]),
          ),
        )}
        {select(
          'assignment',
          c.controls.assignment,
          Object.fromEntries(
            ['mg-lab', 'sub-app', 'sub-shared', 'rg-app'].map((k) => [
              k,
              c.options.scopes[k as keyof typeof c.options.scopes],
            ]),
          ),
        )}
        {select('target', c.controls.policyTarget, c.options.target)}
        {select('rule', c.controls.rule, c.options.rule)}
        {select('effect', c.controls.effect, c.options.effect)}
        {input.rule === 'location' ? (
          <>
            {select('location', c.controls.location, c.options.region)}
            {select('allowed', c.controls.allowed, {
              westeurope: c.options.region.westeurope,
              northeurope: c.options.region.northeurope,
            })}
          </>
        ) : (
          check('propertyPresent', c.controls.propertyPresent)
        )}
        {select('phase', c.controls.phase, c.options.phase)}
        {check('evaluationReady', c.controls.evaluationReady)}
        {select('excluded', c.controls.excluded, c.options.excluded)}
        {select('exemption', c.controls.exemption, c.options.exemption)}
        {check('enforcement', c.controls.enforcement)}
        {['modify', 'deploy'].includes(input.effect) && (
          <>
            {input.phase === 'existing' &&
              check('remediationRequested', c.controls.remediationRequested)}
            {check('identityReady', c.controls.identityReady)}
          </>
        )}
        <p className="governance-control-boundary">{c.visual.scopedAssumptions}</p>
      </>
    );
  const scopes = Object.fromEntries(
    Object.entries(c.options.scopes).filter(([k]) => k !== 'mg-lab'),
  );
  return (
    <>
      {select('lock', c.controls.lock, c.options.lock)}
      {select('scope', c.controls.scope, scopes)}
      {select(
        'target',
        c.controls.lockTarget,
        Object.fromEntries(
          ['vm', 'account', 'rg-app', 'rg-shared'].map((k) => [
            k,
            c.options.scopes[k as keyof typeof c.options.scopes],
          ]),
        ),
      )}
      {select('operation', c.controls.operation, c.options.operation)}
      {check('authorized', c.controls.authorized)}
      <details className="governance-advanced">
        <summary>{c.visual.inherited}</summary>
        {select('second', c.controls.second, c.options.lock)}
        {select('secondScope', c.controls.secondScope, scopes)}
      </details>
      <p className="governance-control-boundary">{c.visual.lockAssumptions}</p>
    </>
  );
}
