'use client';
import { migrationNb as c } from '@/content/nb';
import { type MigrationInput } from '@/domain/curriculum/migration-model';
export function MigrationControls({
  input,
  change,
}: {
  input: MigrationInput;
  change: (v: MigrationInput) => void;
}) {
  const select = (key: keyof typeof c.options) => (
    <label className="compute-control" key={key}>
      <span>{c.controls[key]}</span>
      <select
        value={String((input as unknown as Record<string, unknown>)[key])}
        onChange={(e) =>
          change({
            ...input,
            [key]:
              typeof (input as unknown as Record<string, unknown>)[key] === 'number'
                ? Number(e.target.value)
                : e.target.value,
          } as MigrationInput)
        }
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
        onChange={(e) => change({ ...input, [key]: e.target.checked } as MigrationInput)}
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
