import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import ts from 'typescript';
import { nb } from '../../src/content/nb';
import { create, service } from './ephemeral-actions';
import { startIntegrated, storage, integratedWorld, courseBytes } from './integrated-actions';

const base = 'c4119f3f770d6767881dc5ee455686cbae0150d7';
const require = createRequire(import.meta.url);
const sha = (text: string) => createHash('sha256').update(text).digest('hex');
function fixtureScript(source: (path: string) => string) {
  const transpile = (path: string) =>
    ts.transpileModule(source(path), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
      fileName: path,
    }).outputText;
  const packageRoot = (name: string) => dirname(require.resolve(name + '/package.json'));
  const modules: Record<string, string> = {
    react: readFileSync(join(packageRoot('react'), 'cjs/react.production.js'), 'utf8'),
    'react/jsx-runtime': readFileSync(
      join(packageRoot('react'), 'cjs/react-jsx-runtime.production.js'),
      'utf8',
    ),
    'react-dom': readFileSync(
      join(packageRoot('react-dom'), 'cjs/react-dom.production.js'),
      'utf8',
    ),
    'react-dom/client': readFileSync(
      join(packageRoot('react-dom'), 'cjs/react-dom-client.production.js'),
      'utf8',
    ),
    scheduler: readFileSync(join(packageRoot('scheduler'), 'cjs/scheduler.production.js'), 'utf8'),
    layout: transpile('src/features/portal/presentation.tsx'),
    './service-icon': transpile('src/features/portal/service-icon.tsx'),
    '@/content/nb': transpile('src/content/nb.ts'),
    '../../../public/icons/manifest.json':
      'module.exports=' + source('public/icons/manifest.json') + ';',
    './presentation.css': 'module.exports={};',
  };
  return `(() => {
    const sources = ${JSON.stringify(modules)}, cache = {};
    const process = { env: { NODE_ENV: 'development' } };
    function require(name) { if (cache[name]) return cache[name].exports; const module = { exports: {} }; cache[name] = module; new Function('module', 'exports', 'require', 'process', sources[name])(module, module.exports, require, process); return module.exports; }
    const React = require('react'), { createRoot } = require('react-dom/client'), { PortalResourceLayout } = require('layout');
    let released = false, release;
    const gate = new Promise(resolve => { release = () => { released = true; resolve(); }; });
    window.releasePresentationFixture = release;
    function DeferredProperties() { if (!released) throw gate; return React.createElement('a', { href: '#fixture-new-target' }, 'Fixture new action'); }
    function Fixture() {
      const [section, setSection] = React.useState('overview'), [pending, start] = React.useTransition();
      return React.createElement(React.Fragment, null,
        React.createElement('h1', null, 'Controlled presentation fixture — no World or receipt'),
        React.createElement('output', { id: 'fixture-pending' }, pending ? 'pending' : 'settled'),
        React.createElement(React.Suspense, { fallback: React.createElement('p', null, 'Fixture suspension') },
          React.createElement(PortalResourceLayout, { pending, menu: React.createElement('button', { onClick: () => start(() => setSection('properties')) }, 'Fixture Properties') },
            section === 'properties' ? React.createElement(DeferredProperties) : React.createElement('a', { href: '#fixture-stale-target' }, 'Fixture stale action'))),
        React.createElement('button', { id: 'fixture-outside' }, 'Fixture outside action'));
    }
    createRoot(document.getElementById('fixture-root')).render(React.createElement(Fixture));
  })();`;
}

test('resource navigation actual old and current presentation under a real React transition suspension excludes stale fixture actions', async ({
  page,
}, info) => {
  const old = execFileSync('git', ['show', base + ':src/features/portal/presentation.tsx'], {
    encoding: 'utf8',
  });
  const current = readFileSync('src/features/portal/presentation.tsx', 'utf8');
  const css = ['src/features/portal/portal.css', 'src/features/portal/presentation.css'].map(
    (path) => ({ path, text: readFileSync(path, 'utf8') }),
  );
  const observations = [];
  for (const [version, source] of [
    ['parent', old],
    ['candidate', current],
  ] as const) {
    const sourceHashes: Record<string, string> = {};
    const actualSource = (path: string) => {
      const text =
        version === 'parent'
          ? execFileSync('git', ['show', base + ':' + path], {
              encoding: 'utf8',
              maxBuffer: 16 * 1024 * 1024,
            })
          : readFileSync(path, 'utf8');
      sourceHashes[path] = sha(text);
      return text;
    };
    await page.goto('about:blank');
    await page.setContent(
      '<div class="portal"><div class="portal-content" id="fixture-root"></div></div>',
    );
    await page.addStyleTag({ content: css.map((item) => actualSource(item.path)).join('\n') });
    const compiledFixture = fixtureScript(actualSource);
    await page.addScriptTag({ content: compiledFixture });
    await page.getByRole('button', { name: 'Fixture Properties', exact: true }).click();
    await expect(page.locator('#fixture-pending')).toHaveText('pending');
    const stale = page.getByRole('link', { name: 'Fixture stale action', exact: true });
    if (version === 'parent') await expect(stale).toBeVisible();
    else {
      await expect(stale).toHaveCount(0);
      await expect(page.locator('.portal-resource-main')).toHaveAttribute('aria-busy', 'true');
      await expect(page.locator('.portal-resource-main')).toHaveAttribute('inert', '');
    }
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const staleReached = new URL(page.url()).hash === '#fixture-stale-target';
    expect(staleReached).toBe(version === 'parent');
    observations.push({
      version,
      staleReached,
      sourceSha256: sha(source),
      sourceHashes,
      compiledFixtureSha256: sha(compiledFixture),
      pending: true,
    });
    await page.screenshot({ path: info.outputPath(`controlled-${version}-pending.png`) });
    await page.evaluate(() =>
      (
        window as unknown as { releasePresentationFixture: () => void }
      ).releasePresentationFixture(),
    );
    await expect(page.getByRole('link', { name: 'Fixture new action', exact: true })).toBeVisible();
    await expect(page.locator('#fixture-pending')).toHaveText('settled');
  }
  await info.attach('controlled-presentation-evidence', {
    body: JSON.stringify(
      {
        fixtureOnly: true,
        authority:
          'Actual full old/current PortalResourceLayout module and dependencies with installed React/ReactDOM; no World, receipt, application route, fetch or runtime claims.',
        reactVersion: JSON.parse(
          readFileSync(
            join(dirname(require.resolve('react/package.json')), 'package.json'),
            'utf8',
          ),
        ).version,
        css: css.map((item) => ({ path: item.path, sha256: sha(item.text) })),
        observations,
      },
      null,
      2,
    ),
    contentType: 'application/json',
  });
});

async function observeNavigation(page: Page) {
  await page.evaluate(() => {
    const record: Record<string, unknown>[] = [];
    const capture = (event: string, key?: string, target?: EventTarget | null) => {
      const main = document.querySelector('.portal-resource-main'),
        active = document.activeElement;
      record.push({
        event,
        key,
        at: performance.now(),
        location: location.search,
        pending: main?.getAttribute('data-resource-navigation-pending'),
        visibility: main ? getComputedStyle(main).visibility : null,
        activeTag: active?.tagName,
        activeHref: active?.getAttribute('href'),
        activeConnected: active?.isConnected,
        targetTag: target instanceof Element ? target.tagName : undefined,
        targetHref: target instanceof Element ? target.getAttribute('href') : undefined,
      });
    };
    new MutationObserver(() => capture('mutation')).observe(
      document.querySelector('.portal-body')!,
      {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['style', 'inert', 'aria-busy', 'data-resource-navigation-pending'],
      },
    );
    document.addEventListener('focusin', (event) => capture('focusin', undefined, event.target));
    document.addEventListener('keydown', (event) => capture('keydown', event.key, event.target));
    (
      window as unknown as { portalNavigationObservations: Record<string, unknown>[] }
    ).portalNavigationObservations = record;
  });
}

test('native cached resource section navigation commits focus before original receipt keyboard activation and Back Forward without writes', async ({
  page,
}, info) => {
  await startIntegrated(page);
  const before = await courseBytes(page);
  await create(page, storage.newGroup, { name: 'rg-pending-navigation' });
  await service(page, storage.accounts);
  const created = await create(page, storage.newAccount, { name: 'pendingnavigation' });
  const account = integratedWorld(created).accounts[0]!;
  let commandCount = 0,
    propertiesRscRequests = 0;
  page.on('request', (request) => {
    if (
      request.method() === 'POST' &&
      request.url().endsWith('/api/laboratory/ephemeral') &&
      request.postDataJSON().action === 'command'
    )
      commandCount++;
    const url = new URL(request.url());
    if (
      url.pathname === '/labs/laboratory' &&
      url.searchParams.get('section') === 'properties' &&
      request.headers().rsc === '1'
    )
      propertiesRscRequests++;
  });
  await observeNavigation(page);
  const properties = page
    .locator('[data-portal-component="resource-menu"]')
    .getByRole('button', { name: nb.portalUi.properties, exact: true });
  for (let cycle = 0; cycle < 2; cycle++) {
    await properties.click();
    await expect(page).toHaveURL(/section=properties/);
    await expect(page.locator('.portal-resource-main')).not.toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('.portal-title h1')).toBeFocused();
    const receipt = page.getByRole('link', { name: storage.receipt, exact: true });
    await receipt.focus();
    await expect(receipt).toBeFocused();
    const href = await receipt.getAttribute('href');
    expect(new URL(href!, page.url()).searchParams.get('receipt')).toBe(account.origin);
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-portal-component="receipt"]')).toContainText(account.origin);
    await expect(page.locator('[data-portal-component="receipt"]')).toContainText(account.id);
    await page.goBack();
    await expect(page).toHaveURL(/section=properties/);
    await expect(page.locator('.portal-title h1')).toBeFocused();
    await page.goBack();
    await expect(page).not.toHaveURL(/section=properties/);
    await expect(page.locator('.portal-title h1')).toBeFocused();
    await page.goForward();
    await expect(page).toHaveURL(/section=properties/);
    await expect(page.locator('.portal-title h1')).toBeFocused();
    await page.goBack();
    await expect(page).not.toHaveURL(/section=properties/);
  }
  const observations = await page.evaluate(
    () =>
      (window as unknown as { portalNavigationObservations: Record<string, unknown>[] })
        .portalNavigationObservations,
  );
  const enter = observations.filter((item) => item.event === 'keydown' && item.key === 'Enter');
  expect(enter).toHaveLength(2);
  for (const event of enter) {
    expect(event.activeConnected).toBe(true);
    expect(event.activeHref).toBe(event.targetHref);
    expect(String(event.targetHref)).toContain(account.origin);
  }
  expect(commandCount).toBe(0);
  expect(await courseBytes(page)).toBe(before);
  await info.attach('native-navigation-observations', {
    body: JSON.stringify(
      {
        propertiesRscRequests,
        heldResponse: false,
        note: 'No RSC request is invented or assumed. This records actual cached/native route commits and native focus/key targets; controlled pending suspension is a separate presentation fixture.',
        observations,
      },
      null,
      2,
    ),
    contentType: 'application/json',
  });
  await page.screenshot({ path: info.outputPath('native-cached-navigation-settled.png') });
});
