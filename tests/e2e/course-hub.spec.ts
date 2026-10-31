import { freshPractical, applyPractical, practicalKey } from '../../src/domain/sandbox/practical';
import { foundationsV2Key, v2Facts, restoreV2 } from '../../src/domain/curriculum/foundations-v2';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, courseHubNb as h, managementNb, networkingNb } from '../../src/content/nb';
import { courseKey, freshCourse } from '../../src/domain/course/model';
import { activeTeachingContexts } from '../fixtures/active-teaching-contexts';
import {
  freshCompute,
  applyCompute,
  computeKey,
  computeItemIds,
  computeHref,
} from '../../src/domain/curriculum/compute';
import {
  freshNetworking,
  applyNetworking,
  networkingKey,
  networkingItemIds,
  networkingHref,
  networkingFacts,
} from '../../src/domain/curriculum/networking';
import {
  freshCost,
  applyCost,
  costKey,
  costItemIds,
  costHref,
} from '../../src/domain/curriculum/cost';
import {
  freshTransfer,
  applyTransfer,
  transferKey,
  transferHref,
} from '../../src/domain/curriculum/transfer';
import {
  freshMissions,
  applyMission,
  missionKey,
  missionOrigin,
} from '../../src/domain/sandbox/missions';
import { openCoursePath, openPathActivities } from './course-hub-actions';

test.setTimeout(180000);
test.use({ actionTimeout: 15000 });
const primary = (page: Page) => page.locator('.learn-hub-start .course-primary');
const read = (page: Page, key: string) => page.evaluate((key) => localStorage.getItem(key), key);
async function audit(page: Page) {
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
}

test('first visit exposes one start, three honest paths and direct modules before teaching', async ({
  page,
}) => {
  await page.goto('/learn');
  await expect(primary(page)).toHaveAttribute('href', '/learn/computing?topic=intro-request');
  await expect(page.locator('.course-hub .course-primary')).toHaveCount(1);
  await expect(page.locator('.learn-hub-path')).toHaveCount(3);
  for (const title of [
    'Cloud Concepts',
    'Azure Architecture & Services',
    'Azure Management & Governance',
  ])
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(page.locator('.learn-hub-planned')).toContainText([
    'File Movement & Migration',
    'Governance',
  ]);
  await expect(
    page
      .locator('.course-hub a')
      .filter({ hasText: /^(Storage|Identity & Security|Governance|Monitoring)$/ }),
  ).toHaveCount(0);
  await expect(page.locator('.learn-hub-module[data-module="computing"]')).toContainText(
    `${h.guided}: 0`,
  );
  await openPathActivities(page, 'architecture');
  await expect(page.getByRole('link', { name: h.partBSummary, exact: true })).toHaveAttribute(
    'href',
    '/learn/architecture?topic=core-summary',
  );
  await audit(page);
  await primary(page).click();
  await expect(page).toHaveURL('/learn/computing?topic=intro-request');
  await openCoursePath(page, 'cloud');
  await expect(page.locator('.course-units a[aria-current="step"]')).toBeVisible();
  await page.locator('.course-overview-link').click();
  await expect(primary(page)).toHaveText(nb.course.resume);
  await expect(primary(page)).toHaveAttribute('href', '/learn/computing?topic=intro-request');
  await expect(page.locator('.learn-hub-module[data-module="computing"]')).toContainText(
    `${h.guided}: 0`,
  );
});

test('saved deep link resumes the exact Core B activity and preserves separate historical records', async ({
  page,
}) => {
  const save = JSON.stringify({
    ...freshCourse(),
    resume: { module: 'architecture', topic: 'organization' },
  });
  await page.addInitScript(
    ({ key, save }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, save);
    },
    { key: courseKey, save },
  );
  await page.goto('/learn');
  await expect(primary(page)).toHaveAttribute('href', '/learn/architecture?topic=organization');
  await primary(page).click();
  await expect(page.locator('.management-lesson > header h2')).toHaveText(
    managementNb.topics.organization,
  );
  await openCoursePath(page, 'architecture');
  await expect(page.locator('button[aria-controls="course-path-architecture"]')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(page.locator('button[aria-controls="course-path-cloud"]')).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(page.locator('.course-units a[aria-current="step"]')).toHaveText(
    managementNb.topics.organization,
  );
  await expect(
    page.locator('.course-units a[href="/learn/architecture?topic=assessment"]'),
  ).toBeVisible();
  await page.locator('.course-overview-link').click();
  await expect(page.locator('.learn-hub-module[data-module="architecture"]')).toContainText(
    `${h.coreObservation}: 0 · ${h.coreObservationB}: 0`,
  );
  const practical = JSON.stringify(
    applyPractical(freshPractical(), {
      type: 'start',
      kind: 'paas',
      mode: 'guided',
      origin: { module: 'services', topic: 'paas' },
      attempt: 1,
      boundary: null,
    }),
  );
  const independent = activeTeachingContexts().find(
    (fixture) => fixture.key === 'azurelab.learning.architecture-management.v1',
  )!;
  await page.evaluate(
    ({ practicalKey, practical, key, raw }) => {
      localStorage.setItem(practicalKey, practical);
      localStorage.setItem(key, raw);
    },
    { practicalKey, practical, key: independent.key, raw: independent.raw },
  );
  await page.reload();
  await expect(primary(page)).toHaveAttribute(
    'href',
    '/learn/architecture?topic=management-assessment',
  );
  expect(await read(page, practicalKey)).toBe(practical);
  await page.evaluate(
    ({ courseKey, key }) => {
      localStorage.removeItem(courseKey);
      localStorage.removeItem(key);
    },
    { courseKey, key: independent.key },
  );
  await page.reload();
  await expect(primary(page)).toHaveText(nb.course.resume);
  await expect(primary(page)).toHaveAttribute(
    'href',
    '/portal?area=home&practice=paas&lab=web-platform',
  );
  await page.evaluate(
    ({ courseKey, practicalKey, missionKey, raw }) => {
      localStorage.removeItem(practicalKey);
      localStorage.setItem(
        courseKey,
        JSON.stringify({
          schema: 1,
          resume: { module: 'architecture', topic: 'organization' },
          lab: null,
        }),
      );
      localStorage.setItem(missionKey, raw);
    },
    {
      courseKey,
      practicalKey,
      missionKey,
      raw: JSON.stringify(
        applyMission(freshMissions(), {
          type: 'start',
          mission: 'platform',
          mode: 'guided',
          attempt: 1,
          boundary: null,
        }),
      ),
    },
  );
  await page.reload();
  await expect(primary(page)).toHaveAttribute('href', missionOrigin('platform'));
  await expect(primary(page)).toHaveText(nb.course.resume);
  await primary(page).click();
  await expect(page).toHaveURL(missionOrigin('platform'));
});

test('all seventeen independent contexts resume their own exact route without metadata help or evidence rewriting', async ({
  browser,
  baseURL,
}) => {
  const expected: Record<string, string> = {
    'azurelab.learning.storage-resilience.v1':
      '/learn/storage-resilience?topic=assessment&case=rb01',
    'azurelab.learning.storage-services.v1': '/learn/storage?topic=assessment&case=sa01',
    'azurelab.learning.networking-connectivity.v1':
      '/learn/connectivity?topic=assessment&case=nc03',
    'azurelab.learning.architecture-management.v1':
      '/learn/architecture?topic=management-assessment',
    'azurelab.learning.architecture-physical.v1': '/learn/architecture?topic=assessment',
    'azurelab.learning.serverless.v1': '/learn/computing?topic=serverless-assessment',
    'azurelab.learning.foundations.v1': '/learn/computing?topic=assessment',
    'azurelab.learning.foundations.v2': '/learn/computing?topic=v2-assessment',
    'azurelab.portal.learning.v1': '/portal?area=challenge&course=1&module=services&topic=practice',
    'azurelab.learning.benefits.v1': '/learn/benefits?topic=assessment',
    'azurelab.learning.service-types.v2': '/learn/services?topic=assessment',
    'azurelab.practical-labs.v1': '/portal?area=home&practice=paas',
  };
  const fixtures = [
    ...activeTeachingContexts().map((f) => ({ ...f, href: expected[f.key] })),
    {
      key: computeKey,
      raw: JSON.stringify(applyCompute(freshCompute(), { kind: 'begin', item: computeItemIds[0] })),
      href: computeHref('assessment', computeItemIds[0]),
    },
    {
      key: networkingKey,
      raw: JSON.stringify(
        applyNetworking(freshNetworking(), { kind: 'begin', item: networkingItemIds[0] }),
      ),
      href: networkingHref('assessment', networkingItemIds[0]),
    },
    {
      key: costKey,
      raw: JSON.stringify(applyCost(freshCost(), { kind: 'begin', item: costItemIds[0] })),
      href: costHref('assessment', costItemIds[0]),
    },
    {
      key: transferKey,
      raw: JSON.stringify(
        applyTransfer(freshTransfer(), { kind: 'begin', item: 'public-information' }),
      ),
      href: transferHref('public-information'),
    },
    {
      key: missionKey,
      raw: JSON.stringify(
        applyMission(freshMissions(), {
          type: 'start',
          mission: 'platform',
          mode: 'independent',
          attempt: 1,
          boundary: null,
        }),
      ),
      href: missionOrigin('platform'),
    },
  ];
  expect(fixtures).toHaveLength(17);
  for (const fixture of fixtures) {
    expect(fixture.href, fixture.key).toBeTruthy();
    expect(fixture.raw).not.toBe('null');
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    await page.addInitScript(
      ({ key, raw, courseKey }) => {
        if (!localStorage.getItem(key)) localStorage.setItem(key, raw);
        if (!localStorage.getItem(courseKey))
          localStorage.setItem(
            courseKey,
            JSON.stringify({
              schema: 1,
              resume: { module: 'cost', topic: 'introduction' },
              lab: null,
            }),
          );
      },
      { key: fixture.key, raw: fixture.raw, courseKey },
    );
    if (fixture.key === 'azurelab.learning.foundations.v1')
      await page.addInitScript((key) => {
        if (!localStorage.getItem(key))
          localStorage.setItem(
            key,
            JSON.stringify({
              schema: 2,
              content: '2.0.0',
              model: '2.0.0',
              rubric: '2.0.0',
              choice: 'v2',
              events: [],
            }),
          );
      }, foundationsV2Key);
    await page.goto('/learn');
    await expect(primary(page), fixture.key).toHaveAttribute('href', fixture.href!);
    await expect(page.getByText(h.activeAssessment, { exact: true })).toBeVisible();
    await openPathActivities(page, 'cloud');
    await openCoursePath(page, 'architecture');
    expect(await read(page, fixture.key), fixture.key).toBe(fixture.raw);
    await primary(page).click();
    await expect(page).toHaveURL(fixture.href!);
    const after = JSON.parse((await read(page, fixture.key))!);
    const before = JSON.parse(fixture.raw);
    // Existing lesson components may register a non-completing visit after navigation.
    // No aid, answer, first submission, retry or other evidence may be added.
    expect(after.events.slice(0, before.events.length), fixture.key).toEqual(before.events);
    expect(
      after.events
        .slice(before.events.length)
        .every(
          (event: { kind?: string; version?: string }) =>
            event.kind === 'visit' ||
            (fixture.key === 'azurelab.learning.service-types.v2' &&
              event.kind === 'choose' &&
              event.version === 'v2'),
        ),
      fixture.key,
    ).toBe(true);
    if ('state' in fixture)
      expect(fixture.state(JSON.stringify(after))).toMatchObject({ active: true, assisted: false });
    await context.close();
  }
});

test('corrupt, denied and cross-tab history suppresss invented progress and retains deliberate recovery', async ({
  page,
  context,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/learn');
  await expect(primary(page)).toHaveAttribute('href', '/learn/computing?topic=intro-request');
  const other = await context.newPage();
  await other.goto('/learn');
  const newer = JSON.stringify({ ...freshCourse(), resume: { module: 'cost', topic: 'analysis' } });
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: courseKey,
    raw: newer,
  });
  await expect(primary(page)).toBeDisabled();
  await expect(page.locator('.learn-hub-module').first()).toContainText(h.historyUnknownShort);
  expect(await read(page, courseKey)).toBe(newer);
  await page
    .locator('.learn-hub-recovery')
    .getByRole('button', { name: `${nb.course.reload} · Kursposisjon`, exact: true })
    .click();
  await expect(primary(page)).toHaveAttribute('href', '/learn/cost?topic=analysis');
  const guided = {
    schema: 2,
    content: '2.0.0',
    model: '2.0.0',
    rubric: '2.0.0',
    choice: 'v2',
    events: [
      { kind: 'visit', topic: 'intro-request' },
      { kind: 'request' },
      { kind: 'check', topic: 'intro-request', answer: 'server' },
    ],
  };
  const restoredGuided = restoreV2(JSON.stringify(guided));
  expect(restoredGuided.issue).toBe(null);
  expect(v2Facts(restoredGuided.save).guided('intro-request')).toBe(true);
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: foundationsV2Key,
    raw: JSON.stringify(guided),
  });
  await page.reload();
  await openCoursePath(page, 'cloud');
  await page.getByRole('button', { name: `${h.activities}: Cloud computing`, exact: true }).click();
  await expect(page.locator('.course-observed')).toHaveCount(1);
  await expect(page.locator('.learn-hub-module[data-module="computing"]')).toContainText(
    `${h.guided}: 1`,
  );
  const newerGuided = JSON.stringify({
    ...guided,
    events: [...guided.events, { kind: 'visit', topic: 'physical-server' }],
  });
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: foundationsV2Key,
    raw: newerGuided,
  });
  await expect(primary(page)).toBeDisabled();
  await expect(page.locator('.course-observed')).toHaveCount(0);
  await expect(page.locator('.learn-hub-module[data-module="computing"]')).toContainText(
    h.historyUnknownShort,
  );
  expect(await read(page, foundationsV2Key)).toBe(newerGuided);
  await page.screenshot({ path: info.outputPath('conflict-progress-withheld.png') });
  await page.reload();
  await openCoursePath(page, 'cloud');
  await page.getByRole('button', { name: `${h.activities}: Cloud computing`, exact: true }).click();
  await expect(page.locator('.course-observed')).toHaveCount(1);

  await page.evaluate((key) => localStorage.setItem(key, '{broken'), networkingKey);
  await page.reload();
  await expect(primary(page)).toBeDisabled();
  await expect(page.locator('.learn-hub-recovery')).toContainText('Networking · del A');
  expect(await read(page, networkingKey)).toBe('{broken');
  await page
    .locator('.learn-hub-recovery')
    .getByRole('link', { name: `${h.reviewRecord} · Networking · del A`, exact: true })
    .click();
  await expect(page.getByText(networkingNb.storage.title, { exact: true })).toBeVisible();
  await other.close();
  await page.addInitScript((key) => {
    const get = Storage.prototype.getItem;
    Storage.prototype.getItem = function (k) {
      if (k === key) throw new DOMException('denied', 'SecurityError');
      return get.call(this, k);
    };
  }, courseKey);
  await page.goto('/learn');
  await expect(primary(page)).toBeDisabled();
  await expect(page.locator('.learn-hub-recovery')).toContainText('Kursposisjon · unsaved');
  await expect(page.getByRole('heading', { name: 'Cloud Concepts', exact: true })).toBeVisible();
});

test('root Journal durably classifies independent help and withholds teaching when storage denies it', async ({
  browser,
  baseURL,
}) => {
  const key = networkingKey;
  const raw = JSON.stringify(
    applyNetworking(freshNetworking(), { kind: 'begin', item: networkingItemIds[0] }),
  );
  for (const denied of [false, true]) {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    await page.addInitScript(
      ({ key, raw, denied }) => {
        if (!localStorage.getItem(key)) localStorage.setItem(key, raw);
        if (denied) {
          const set = Storage.prototype.setItem;
          Storage.prototype.setItem = function (k, v) {
            if (k === key) throw new DOMException('denied', 'QuotaExceededError');
            set.call(this, k, v);
          };
        }
      },
      { key, raw, denied },
    );
    await page.goto('/learn');
    await expect(primary(page)).toHaveAttribute(
      'href',
      networkingHref('assessment', networkingItemIds[0]),
    );
    expect(await read(page, key)).toBe(raw);
    await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
    const dialog = page.getByRole('dialog');
    if (denied) {
      await expect(dialog).toContainText(managementNb.accessText);
      await expect(dialog.locator('.networking-lesson')).toHaveCount(0);
      expect(await read(page, key)).toBe(raw);
    } else {
      await expect
        .poll(async () => networkingFacts(JSON.parse((await read(page, key))!)).assisted)
        .toBe(true);
      await expect(dialog).not.toContainText(managementNb.accessText);
    }
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: nb.course.journal, exact: true })).toBeFocused();
    await context.close();
  }
});

test('desktop compositions, collapsed hierarchy, short windows, keyboard, reduced motion and Sandbox return remain usable', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [800, 700],
    [1024, 500],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto('/learn');
    await expect(primary(page)).toHaveAttribute('href', '/learn/computing?topic=intro-request');
    if (width >= 1024 && height >= 768) {
      for (const title of await page.locator('.learn-hub-path h3').all())
        await expect(title).toBeInViewport();
    }
    await page.screenshot({ path: info.outputPath(`hub-${width}x${height}.png`) });
    await audit(page);
  }
  await page.setViewportSize({ width: 1024, height: 768 });
  await openCoursePath(page, 'architecture');
  const path = page.locator('button[aria-controls="course-path-architecture"]');
  await path.focus();
  await page.keyboard.press('Space');
  await expect(path).toHaveAttribute('aria-expanded', 'false');
  await expect(path).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(path).toHaveAttribute('aria-expanded', 'true');
  const part = page.getByRole('button', {
    name: `${h.activities}: Del B · Hybrid og endpoints`,
    exact: true,
  });
  await part.focus();
  await page.keyboard.press('Enter');
  const assessment = page.locator(
    '#course-activities-connectivity a[href="/learn/connectivity?topic=assessment"]',
  );
  await expect(assessment).toBeVisible();
  await assessment.click();
  await expect(page).toHaveURL('/learn/connectivity?topic=assessment');
  await expect(page.locator('.course-tree-path:has(a[aria-current]) > h2')).toBeInViewport();
  await expect(page.locator('.course-units a[aria-current="step"]')).toBeInViewport();
  await expect(page.locator('.course-activity [data-activity-heading]').first()).toBeFocused();
  await page.screenshot({ path: info.outputPath('navigation-networking-b-1024.png') });
  await page.locator('.course-overview-link').click();
  await page.getByRole('link', { name: nb.course.sandbox, exact: true }).click();
  await expect(page).toHaveURL('/portal');
  await page.getByRole('link', { name: nb.course.returnCourse, exact: true }).click();
  await expect(page).toHaveURL(/\/learn/);
});
