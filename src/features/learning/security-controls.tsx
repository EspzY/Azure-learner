'use client';
import { securityNb as c } from '@/content/nb';
import { type SecurityInput } from '@/domain/curriculum/security-model';
export function SecurityControls({
  input,
  change,
}: {
  input: SecurityInput;
  change: (v: SecurityInput) => void;
}) {
  const select = (key: keyof typeof c.options) => (
    <label className="compute-control" key={key}>
      <span>{c.controls[key]}</span>
      <select
        value={String((input as unknown as Record<string, unknown>)[key])}
        onChange={(e) => change({ ...input, [key]: e.target.value } as SecurityInput)}
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
        onChange={(e) => change({ ...input, [key]: e.target.checked } as SecurityInput)}
      />
      <span>{c.controls[key]}</span>
    </label>
  );
  return (
    <>
      {Object.keys(input)
        .filter((k) => k !== 'kind')
        .map((k) =>
          typeof (input as unknown as Record<string, unknown>)[k] === 'boolean'
            ? check(k as keyof typeof c.controls)
            : select(k as keyof typeof c.options),
        )}
    </>
  );
}
