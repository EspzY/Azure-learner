import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BifrostBrandMark } from '@/features/design/brand-mark';
import reference from '../../../docs/design/bifrost-demo-reference.json';

const normalized = (value: string) => value.replace(/\s/g, '').replace(/([,(])0\./g, '$1.');
it('retains every light and dark Purple token from the actual owner attachment', () => {
  const css = readFileSync('src/features/design/tokens.css', 'utf8');
  const light = css.match(/\.bifrost-learning\s*{([^}]+)}/)![1]!;
  const dark = css.match(/html\[data-bf-theme='dark'\]\s+\.bifrost-learning\s*{([^}]+)}/)![1]!;
  const tokens = (block: string) =>
    Object.fromEntries(
      [...block.matchAll(/(--bfc-[\w-]+):([^;]+);/g)].map((m) => [m[1], normalized(m[2]!)]),
    );
  const expected = (values: Record<string, string>) =>
    Object.fromEntries(Object.entries(values).map(([key, value]) => [key, normalized(value)]));
  expect(tokens(light)).toEqual(expected(reference.light));
  expect(tokens(dark)).toEqual(expected(reference.darkOverrides));
});

it('keeps exact supplied landing mark geometry and colors with unique reusable references', () => {
  const markup = renderToStaticMarkup(
    createElement('div', {}, createElement(BifrostBrandMark), createElement(BifrostBrandMark)),
  );
  const svgs = markup.match(/<svg\b.*?<\/svg>/g)!;
  expect(svgs).toHaveLength(2);
  const geometry = (svg: string) =>
    [...svg.matchAll(/<(?:path|use)\b[^>]+>/g)].map(([tag]) =>
      Object.fromEntries(
        [...tag.matchAll(/\b(d|transform|fill|fill-rule)="([^"]*)"/g)].map((m) => [m[1], m[2]]),
      ),
    );
  for (const svg of svgs) {
    expect(svg).toContain('viewBox="0 0 1024 1024"');
    expect(geometry(svg)).toEqual(reference.landingMarkGeometry);
    const id = svg.match(/id="([^"]+)"/)![1]!;
    expect(svg.split(`href="#${id}"`)).toHaveLength(4);
  }
  expect(svgs[0]!.match(/id="([^"]+)"/)![1]).not.toBe(svgs[1]!.match(/id="([^"]+)"/)![1]);
});

it('ships only the cleared unchanged Open Sans and its redistribution license', () => {
  const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
  expect(hash('public/design/bifrost/fonts/open-sans-latin-variable.woff2')).toBe(
    'd8e4fe0452aa2076429a9bb5d8757d00a994dd95986cf950e9a1a371b9a072a0',
  );
  expect(hash('public/design/bifrost/fonts/OFL-Open-Sans.txt')).toBe(
    'fbbbcfef55318de350562559b671360de6d597112ecc5c73881b05092db89602',
  );
});
