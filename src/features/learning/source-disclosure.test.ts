import { assertCC03Change, cc03DomainChanges } from '../../../tests/cc03-preservation';
import { assertCC01Change, cc01DomainChanges } from '../../../tests/cc01-preservation';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { SourceDisclosure } from './source-disclosure';
import { ComputeSources } from './compute';
import { NetworkingSources } from './networking';
import { ConnectivitySources } from './connectivity';
import { StorageSources } from './storage';
import { ResilienceSources } from './storage-resilience';
import { IdentitySources } from './identity-foundations';
import { AccessSources } from './access-control';
import { GovernanceSources } from './governance';
import { ToolsSources } from './management-tools';
import { MonitoringSources } from './monitoring';
import { SecuritySources } from './security';
import { MigrationSources } from './migration';
import { CostSources } from './cost';
import * as compute from '@/domain/curriculum/compute-sources';
import * as networking from '@/domain/curriculum/networking-sources';
import * as connectivity from '@/domain/curriculum/connectivity-sources';
import * as storage from '@/domain/curriculum/storage-sources';
import * as resilience from '@/domain/curriculum/storage-resilience-sources';
import * as identity from '@/domain/curriculum/identity-foundations-sources';
import * as access from '@/domain/curriculum/access-control-sources';
import * as governance from '@/domain/curriculum/governance-sources';
import * as tools from '@/domain/curriculum/management-tools-sources';
import * as monitoring from '@/domain/curriculum/monitoring-sources';
import * as security from '@/domain/curriculum/security-sources';
import * as migration from '@/domain/curriculum/migration-sources';
import * as cost from '@/domain/curriculum/cost-sources';
// Next uses the automatic JSX transform; the existing Node test runner uses classic JSX.
vi.stubGlobal('React', React);
afterAll(() => vi.unstubAllGlobals());
const base = '2f2a6c838232a17c4c018ac485e340a0be1711d5';
const families = [
  [ComputeSources, compute.computeSources, compute.computeStudySources],
  [NetworkingSources, networking.networkingSources, networking.networkingStudySources],
  [ConnectivitySources, connectivity.connectivitySources, connectivity.connectivityStudySources],
  [StorageSources, storage.storageSources, storage.storageStudySources],
  [ResilienceSources, resilience.resilienceSources, resilience.resilienceStudySources],
  [IdentitySources, identity.identitySources, identity.identityStudySources],
  [AccessSources, access.accessSources, access.accessStudySources],
  [GovernanceSources, governance.governanceSources, governance.governanceStudySources],
  [ToolsSources, tools.toolsSources, tools.toolsStudySources],
  [MonitoringSources, monitoring.monitoringSources, monitoring.monitoringStudySources],
  [SecuritySources, security.securitySources, security.securityStudySources],
  [MigrationSources, migration.migrationSources, migration.migrationStudySources],
  [CostSources, cost.costSources, cost.costStudySources],
] as const;
describe('Source presentation preservation', () => {
  it('uses closed native disclosure, accurate count, safe links and original optional metadata without evidence state', () => {
    const html = renderToStaticMarkup(
      React.createElement(SourceDisclosure, {
        entries: [
          {
            id: 'test',
            title: 'Original title',
            url: 'https://learn.microsoft.com/en-us/test',
            reviewed: '2026-10-23',
            version: 'rolling-page',
            publisher: 'Microsoft',
          },
        ],
      }),
    );
    expect(html).toContain('Kilder og videre lesning');
    expect(html).toContain('(1)');
    expect(html).not.toMatch(/<details[^>]*\bopen|aria-expanded/);
    expect(html).toContain('noopener noreferrer');
    for (const value of ['test', 'Original title', '2026-10-23', 'rolling-page', 'Microsoft'])
      expect(html).toContain(value);
    const source = readFileSync('src/features/learning/source-disclosure.tsx', 'utf8');
    expect(source).not.toMatch(/localStorage|useEffect|useState|onToggle|\.event\(/);
  });
  it('renders every actual modern Summary and every topic with the exact registered ID URL and title selection', () => {
    for (const [Component, bank, topics] of families) {
      for (const topic of [undefined, ...Object.keys(topics)]) {
        const ids =
          topic === undefined
            ? Object.keys(bank)
            : (topics as Record<string, readonly string[]>)[topic]!;
        const html = renderToStaticMarkup(
          React.createElement(Component as React.ComponentType<{ topic?: string }>, { topic }),
        );
        expect(html).not.toMatch(/<details[^>]*\bopen/);
        expect(html).toContain(`(${ids.length})`);
        expect([...html.matchAll(/data-source-id="([^"]+)"/g)].map((m) => m[1])).toEqual(ids);
        const urls = [...html.matchAll(/href="([^"]+)"/g)].map((m) =>
          m[1]!.replaceAll('&amp;', '&'),
        );
        expect(urls).toEqual(
          ids.map((id) => {
            const s = (bank as Record<string, readonly string[] | { url: string; title: string }>)[
              id
            ]!;
            return Array.isArray(s)
              ? s.find((value) => value.startsWith('https://'))
              : (s as { url: string }).url;
          }),
        );
        for (const id of ids) {
          const value = (
            bank as Record<string, readonly string[] | { url: string; title: string }>
          )[id]!;
          let title = Array.isArray(value)
            ? value.find((x) => !x.startsWith('https://'))!
            : (value as { title: string }).title;
          if (bank === monitoring.monitoringSources) title = title.replace(/^'|'$/g, '');
          const escaped = title
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#x27;');
          expect(html).toContain(escaped);
        }
      }
    }
  });
  it('preserves every original domain source record mapping rubric store and full authored content prefix against the verified base', () => {
    // PR49 isolated bank and explicitly owner-authorized PR51 lifecycle1 are bounded
    // exceptions. Freeze every other domain and the full original v2 source/model/rubric prefix.
    const navigationOnly = [
      'src/domain/curriculum/application-transfer.ts',
      'src/domain/curriculum/application-store.ts',
      'src/domain/curriculum/application-exposure.ts',
      'src/domain/curriculum/application-sources.ts',
      'src/domain/curriculum/application-transfer.test.ts',
      'src/domain/curriculum/foundations-v2.ts',
      'src/domain/curriculum/foundations-v2.test.ts',
      'src/domain/curriculum/v2-store.ts',
      'src/domain/curriculum/foundations-v2-lifecycle.test.ts',
    ];
    const changed = execFileSync('git', ['diff', '--name-only', base, '--', 'src/domain/'], {
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter(Boolean);
    expect(
      changed.filter(
        (path) =>
          !navigationOnly.includes(path) &&
          !cc01DomainChanges.includes(path) &&
          !cc03DomainChanges.includes(path),
      ),
    ).toEqual([]);
    for (const path of cc01DomainChanges) assertCC01Change(path);
    for (const path of cc03DomainChanges) assertCC03Change(path);
    const priorV2 = execFileSync(
      'git',
      ['show', base + ':src/domain/curriculum/foundations-v2.ts'],
      { encoding: 'utf8' },
    );
    expect(
      readFileSync('src/domain/curriculum/foundations-v2.ts', 'utf8').split(
        'export type V2Event',
      )[0],
    ).toBe(priorV2.split('export type V2Event')[0]);
    const priorPortal = execFileSync('git', ['show', base + ':src/domain/portal/model.ts'], {
      encoding: 'utf8',
    });
    expect(
      readFileSync('src/domain/portal/model.ts', 'utf8').split('export type InventoryKind =')[1],
    ).toBe(priorPortal.split('export type InventoryKind =')[1]);
    const old = execFileSync('git', ['show', base + ':src/content/nb.ts'], {
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
    });
    expect(readFileSync('src/content/nb.ts', 'utf8').startsWith(old)).toBe(true);
  });
});
