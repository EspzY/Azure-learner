'use client';
import { toolsNb as c } from '@/content/nb';
import type { ToolsInput } from '@/domain/curriculum/management-tools-model';
export function ToolsControls({
  input,
  change,
}: {
  input: ToolsInput;
  change: (v: ToolsInput) => void;
}) {
  const select = (key: keyof typeof c.options) => (
    <label className="compute-control" key={key}>
      <span>{c.controls[key]}</span>
      <select
        value={String((input as unknown as Record<string, unknown>)[key])}
        onChange={(e) => change({ ...input, [key]: e.target.value } as ToolsInput)}
      >
        {Object.entries(c.options[key]).map(([v, label]) => (
          <option key={v} value={v}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
  const check = (key: keyof typeof c.controls) => (
    <label className="storage-check" key={key}>
      <input
        type="checkbox"
        checked={Boolean((input as unknown as Record<string, unknown>)[key])}
        onChange={(e) => change({ ...input, [key]: e.target.checked } as ToolsInput)}
      />
      <span>{c.controls[key]}</span>
    </label>
  );
  if (input.kind === 'intent')
    return (
      <>
        {(['tool', 'host', 'subscription', 'metadataRegion'] as const).map(select)}
        {(
          [
            'installed',
            'authenticated',
            'authorized',
            'providerReady',
            'policyAllows',
            'lockAllows',
          ] as const
        ).map(check)}
        <p className="tools-control-boundary">{c.visual.authoring}</p>
      </>
    );
  if (input.kind === 'change')
    return (
      <>
        {(
          ['syntax', 'baseline', 'stage', 'binding', 'order', 'costCenter', 'evaluation'] as const
        ).map(select)}
        {(['authorized', 'providerReady', 'policyAllows', 'lockAllows'] as const).map(check)}
        <p className="tools-control-boundary">{c.visual.incremental}</p>
      </>
    );
  return (
    <>
      {(['resource', 'approach', 'capability'] as const).map(select)}
      {(['onboarded', 'connected', 'prerequisites', 'extension'] as const).map(check)}
      <p className="tools-control-boundary">{c.visual.observedOnly}</p>
    </>
  );
}
