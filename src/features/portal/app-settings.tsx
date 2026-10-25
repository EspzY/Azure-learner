'use client';
import { useState } from 'react';
import { labsNb as t } from '@/content/nb';
import { appSettings, type Command } from '@/domain/sandbox/model';
import type { World } from '@/domain/chapter01/model';
export function AppSettings({
  world,
  id,
  disabled,
  onCreate,
}: {
  world: World;
  id: string;
  disabled: boolean;
  onCreate: (c: Command) => void;
}) {
  const saved = appSettings(world).find((s) => s.appId === id);
  const [environment, setEnvironment] = useState(saved?.environment ?? 'development'),
    [mode, setMode] = useState(saved?.catalogMode ?? 'standard');
  return (
    <section className="portal-create">
      <h2>{t.settings.subtitle}</h2>
      <p>{t.settings.note}</p>
      <p>{t.settings.mechanism}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({ type: 'SetAppSettings', appId: id, environment, catalogMode: mode });
        }}
      >
        <label>
          {t.settings.environment}
          <select
            data-guide="settings"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as typeof environment)}
          >
            {['development', 'staging', 'production'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          {t.settings.catalog}
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
            <option>standard</option>
            <option>read-only</option>
          </select>
        </label>
        <button type="submit" data-guide="commit" disabled={disabled}>
          {t.settings.apply}
        </button>
      </form>
    </section>
  );
}
