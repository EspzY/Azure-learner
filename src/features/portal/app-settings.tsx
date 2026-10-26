'use client';
import { useState } from 'react';
import { labsNb as t, nb } from '@/content/nb';
import { appSettings, type Command } from '@/domain/sandbox/model';
import type { World } from '@/domain/chapter01/model';
import { PortalDialog } from './shared';
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
  const [editing, setEditing] = useState<'environment' | 'catalog' | null>(null),
    [draft, setDraft] = useState('');
  const entries = [
    {
      id: 'environment' as const,
      label: t.settings.environment,
      value: environment,
      values: ['development', 'staging', 'production'],
    },
    {
      id: 'catalog' as const,
      label: t.settings.catalog,
      value: mode,
      values: ['standard', 'read-only'],
    },
  ];
  const active = entries.find((e) => e.id === editing);
  return (
    <section className="portal-app-settings">
      <h2>{t.settings.title}</h2>
      <nav className="portal-settings-tabs" aria-label={t.settings.title}>
        <span aria-current="page">{t.settings.subtitle}</span>
      </nav>
      <p className="portal-inline-info">{nb.portalUi.settingsDraft}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({ type: 'SetAppSettings', appId: id, environment, catalogMode: mode });
        }}
      >
        <div className="portal-settings-actions">
          <button type="submit" className="primary" data-guide="commit" disabled={disabled}>
            {t.settings.apply}
          </button>
        </div>
        <table>
          <caption>{t.settings.subtitle}</caption>
          <thead>
            <tr>
              <th scope="col">{nb.portal.name}</th>
              <th scope="col">{nb.portalUi.value}</th>
              <th scope="col">{nb.portalUi.edit}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id}>
                <th scope="row">{entry.label}</th>
                <td>{entry.value}</td>
                <td>
                  <button
                    type="button"
                    data-guide={entry.id === 'environment' && !editing ? 'settings' : undefined}
                    onClick={() => {
                      setDraft(entry.value);
                      setEditing(entry.id);
                    }}
                  >
                    {nb.portalUi.edit}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
      <details>
        <summary>{nb.portalUi.learningLayer}</summary>
        <p>{t.settings.note}</p>
        <p>{t.settings.mechanism}</p>
      </details>
      {active && (
        <PortalDialog title={nb.portalUi.editSetting} onClose={() => setEditing(null)}>
          <form
            className="portal-setting-editor"
            onSubmit={(e) => {
              e.preventDefault();
              if (editing === 'environment') setEnvironment(draft as typeof environment);
              else setMode(draft as typeof mode);
              setEditing(null);
            }}
          >
            <p>{active.label}</p>
            <label>
              {active.label}
              <select
                data-guide="settings"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              >
                {active.values.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <p>{nb.portalUi.settingsDraft}</p>
            <footer>
              <button type="submit">{nb.portalUi.saveDraft}</button>
              <button type="button" onClick={() => setEditing(null)}>
                {nb.portalUi.cancel}
              </button>
            </footer>
          </form>
        </PortalDialog>
      )}
    </section>
  );
}
