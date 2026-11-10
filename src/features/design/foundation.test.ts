import { describe, expect, it } from 'vitest';
import { runInNewContext } from 'node:vm';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { themeInitScript, visualThemeKey } from './theme-init';

describe('isolated pre-paint visual theme', () => {
  for (const dark of [true, false]) {
    for (const saved of [null, 'system', 'light', 'dark', '{corrupt', 'complete']) {
      it(`resolves system=${dark} saved=${saved} without any storage write`, () => {
        const dataset: Record<string, string> = {};
        const reads: string[] = [];
        runInNewContext(themeInitScript, {
          document: { documentElement: { dataset } },
          matchMedia: () => ({ matches: dark }),
          localStorage: {
            getItem: (key: string) => {
              reads.push(key);
              return saved;
            },
            setItem: () => {
              throw new Error('init must never write');
            },
          },
        });
        expect(reads).toEqual([visualThemeKey]);
        expect(dataset.bfTheme).toBe(
          saved === 'light' || saved === 'dark' ? saved : dark ? 'dark' : 'light',
        );
      });
    }
    it(`handles blocked storage with system=${dark}`, () => {
      const dataset: Record<string, string> = {};
      runInNewContext(themeInitScript, {
        document: { documentElement: { dataset } },
        matchMedia: () => ({ matches: dark }),
        localStorage: {
          getItem: () => {
            throw new Error('blocked');
          },
        },
      });
      expect(dataset.bfTheme).toBe(dark ? 'dark' : 'light');
    });
  }
});

it('retains every original root provider and their nesting order', () => {
  const base = execFileSync(
    'git',
    ['show', '249833f7cb7ea41d3e411444ec3c4f83805d3a5f:src/app/layout.tsx'],
    { encoding: 'utf8' },
  );
  const current = readFileSync('src/app/layout.tsx', 'utf8');
  const providers = (source: string) =>
    source
      .match(/<\/?[A-Za-z0-9]+Provider(?:>|\s)/g)
      ?.filter((x) => !x.includes('BifrostThemeProvider'));
  expect(providers(current)).toEqual(providers(base));
});

it('defines colors only on learning wrappers and never sets a global Portal font or palette', () => {
  const css = readFileSync('src/features/design/tokens.css', 'utf8');
  const selectors = [...css.matchAll(/([^{}]+)\{/g)]
    .map((match) => match[1]!.trim())
    .filter((s) => !s.startsWith('/*') && !s.startsWith('@'));
  for (const selector of selectors) expect(selector).toContain('.bifrost-learning');
  expect(css).not.toMatch(/--(?:portal-|bg:|text:|surface:|learning-)/);
  expect(css).toContain('--bfc-theme: #631cce');
  expect(css).toContain('--bfc-theme: #ad8aff');
});
