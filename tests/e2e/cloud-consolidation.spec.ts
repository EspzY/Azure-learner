import { serverlessTopics } from '../../src/domain/curriculum/serverless';
import {
  v2Bindings,
  laterUnits,
  beginnerSources,
} from '../../src/domain/curriculum/foundations-v2';
import { units, sourceUrl } from '../../src/domain/curriculum/manifest';
import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  cloudChapters,
  cloudRecommendedTopics,
  cloudNavigationTopic,
} from '../../src/features/course/cloud-computing-chapters';
import { nb } from '../../src/content/nb';
import {
  v2Topics,
  foundationsV2Key as key,
  restoreV2,
  v2Facts,
  freshV2,
  applyV2,
} from '../../src/domain/curriculum/foundations-v2';
import { openCloudPart } from './cloud-chapter-actions';
const t = nb.foundationsV2;
const snapshot = (page: Page) =>
  page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(([k]) => !/learning|course|guidance/.test(k)),
    ),
  );
const facts = async (page: Page) =>
  v2Facts(restoreV2(await page.evaluate((key) => localStorage.getItem(key), key)).save);
const next = (page: Page) => page.locator('.course-nav-next a');
test('consolidated Cloud Computing follows fourteen meaningful entries with preserved module boundary and no automatic assessment start', async ({
  page,
}) => {
  await page.goto('/learn');
  await page.getByRole('link', { name: `${nb.course.open}: Cloud computing`, exact: true }).click();
  await expect(page.locator('#course-activities-computing > li')).toHaveCount(14);
  await expect(
    page.locator('#course-activities-computing details, #course-activities-computing ol'),
  ).toHaveCount(0);
  await expect(page.getByText('Deler i økten', { exact: true })).toHaveCount(0);
  for (const [i, chapter] of cloudChapters.entries())
    await expect(page.locator('#course-activities-computing > li > a').nth(i)).toHaveText(
      chapter.title,
    );
  const before = await snapshot(page);
  for (let i = 0; i < cloudRecommendedTopics.length; i++) {
    const topic = cloudRecommendedTopics[i]!;
    await expect(page.locator('.cloud-chapter-parts')).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`topic=${topic}`));
    await expect(page.locator('.course-nav-context')).toContainText(`${i + 1} av 14`);
    if (i > 0)
      await expect(page.locator('.course-nav-previous a')).toHaveAttribute(
        'href',
        `/learn/computing?topic=${cloudRecommendedTopics[i - 1]}`,
      );
    await expect(next(page)).toHaveAttribute(
      'href',
      i === 13
        ? '/learn/benefits?topic=availability'
        : `/learn/computing?topic=${cloudRecommendedTopics[i + 1]}`,
    );
    if (topic === 'serverless-assessment')
      await expect(page.locator('.serverless-lesson form')).toHaveCount(0);
    if (i < 13) await next(page).click();
  }
  expect((await facts(page)).submissions).toEqual([]);
  expect(await snapshot(page)).toEqual(before);
  await next(page).click();
  await expect(page).toHaveURL(/learn\/benefits\?topic=availability/);
});
test('every historical Foundations v2 URL resolves to the right consolidated session without rewriting its address', async ({
  page,
}) => {
  for (const topic of v2Topics) {
    await page.goto(`/learn/computing?topic=${topic}`);
    await expect(page).toHaveURL(new RegExp(`topic=${topic}$`));
    const chapter = cloudChapters.find((c) => c.topic === cloudNavigationTopic(topic));
    if (chapter) {
      await expect(page.locator('.cloud-chapter')).toHaveAttribute('aria-label', chapter.title);
      await expect(page.locator('[data-activity-heading]')).toBeFocused();
      await expect(page.locator('.course-nav-context')).toContainText(chapter.title);
      await expect(page.locator('.course-units > li > a[aria-current=step]')).toHaveCount(1);
    }
  }
});
test('historical part navigation retains the same live investigation and exact saved resume through Back Forward reload and v1', async ({
  page,
}) => {
  await page.goto('/learn/computing?topic=intro-request');
  const ram = nb.foundationsVisuals.parts.find((part) => part.id === 'ram')!;
  await page.getByRole('button', { name: new RegExp(`^${ram.name}`) }).click();
  await expect(page.locator('.proof-part-detail')).toContainText(ram.explanation);
  // Native history entry represents a historical part address; no visible part menu exists.
  await page.evaluate(() => history.pushState(null, '', '/learn/computing?topic=physical-server'));
  await expect(page).toHaveURL(/topic=physical-server$/);
  await expect(page.locator('#cloud-part-physical-server h3').first()).toBeFocused();
  await expect(page.locator('.proof-part-detail')).toContainText(ram.explanation);
  await page.goBack();
  await expect(page).toHaveURL(/topic=intro-request$/);
  await expect(page.locator('.cloud-chapter-heading h2')).toBeFocused();
  await expect(page.locator('.proof-part-detail')).toContainText(ram.explanation);
  await page.goForward();
  await expect(page.locator('#cloud-part-physical-server h3').first()).toBeFocused();
  await expect(page.locator('.proof-part-detail')).toContainText(ram.explanation);
  await page.goto('/learn/computing?topic=provisioning');
  await page.reload();
  await expect(page.locator('#cloud-part-provisioning h3').first()).toBeFocused();
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start .course-primary')).toContainText(nb.course.resume);
  await page
    .getByRole('link', { name: new RegExp(nb.course.resume) })
    .first()
    .click();
  await expect(page).toHaveURL(/topic=provisioning/);
  await page.goBack();
  await expect(page).toHaveURL(/\/learn$/);
  await page.goForward();
  await expect(page).toHaveURL(/topic=provisioning/);
  await page.goto('/learn/computing?topic=capacity');
  await expect(page.getByText(t.legacy, { exact: true })).toBeVisible();
  await expect(
    page.getByText(nb.foundations.units.capacity.mechanism, { exact: true }),
  ).toBeVisible();
});
test('historical Serverless transfer assessment and summary direct URLs retain their original independent stores and explicit starts', async ({
  page,
}) => {
  for (const topic of [...serverlessTopics, 'transfer', 'v2-assessment', 'v2-summary']) {
    await page.goto(`/learn/computing?topic=${topic}`);
    await expect(page).toHaveURL(`/learn/computing?topic=${topic}`);
    await expect(
      page
        .locator('.serverless-lesson, .transfer-workspace, .v2-assessment, .foundations-v2')
        .first(),
    ).toBeVisible();
  }
  expect((await facts(page)).active).toBe(false);
  expect((await facts(page)).submissions).toEqual([]);
});
test('composed sections register only actually exposed visits and explicit model observations without completion World receipts or XP', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1024, height: 500 });
  await page.goto('/learn/computing?topic=virtualization');
  await expect(page.locator('.cloud-chapter')).toBeVisible();
  const before = await snapshot(page);
  await page
    .locator('#cloud-part-virtualization .v2-explanation > p')
    .first()
    .scrollIntoViewIfNeeded();
  await expect.poll(async () => (await facts(page)).visited('virtualization')).toBe(true);
  expect((await facts(page)).visited('provisioning')).toBe(false);
  await page.getByLabel(t.vm.a, { exact: true }).selectOption('8');
  await page.getByRole('button', { name: t.vm.apply, exact: true }).click();
  await expect(page.locator('.v2-vm [role=status]')).toContainText(t.vm.denied);
  await page
    .locator('#cloud-part-provisioning .v2-explanation > p')
    .first()
    .scrollIntoViewIfNeeded();
  await expect.poll(async () => (await facts(page)).visited('provisioning')).toBe(true);
  await page.getByLabel(t.provision.available, { exact: true }).uncheck();
  await page.getByRole('button', { name: t.provision.request, exact: true }).click();
  await expect(page.locator('.v2-provision [role=status]')).toContainText(t.provision.denied);
  const raw = JSON.parse((await page.evaluate((key) => localStorage.getItem(key), key))!);
  expect(raw.events.filter((e: { kind: string }) => e.kind === 'memory')).toHaveLength(1);
  expect(raw.events.filter((e: { kind: string }) => e.kind === 'provision')).toEqual([
    { kind: 'provision', supported: false },
  ]);
  expect((await facts(page)).guided('virtualization')).toBe(false);
  expect((await facts(page)).submissions).toEqual([]);
  expect(await snapshot(page)).toEqual(before);
  // Progressive fallback: visiting the chapter without viewport observation must
  // not invent exposure; an actual original control still authorizes its part.
  await page.addInitScript(() => {
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined, configurable: true });
  });
  await page.goto('/learn/computing?topic=v2-models');
  expect((await facts(page)).visited('v2-models')).toBe(false);
  const model = page.locator('#cloud-part-v2-models');
  for (const mode of ['public', 'private', 'hybrid']) {
    await model.getByLabel(nb.foundations.topology, { exact: true }).selectOption(mode);
    await model.getByRole('button', { name: nb.foundations.run, exact: true }).click();
  }
  expect((await facts(page)).visited('v2-models')).toBe(true);
  expect((await facts(page)).visited('v2-placement')).toBe(false);
  expect((await facts(page)).observed.observations.models.probes).toHaveLength(3);
  expect(await snapshot(page)).toEqual(before);
});
test('chapter source union original manuscripts checks and causal models are preserved while generic guide repetition is removed', async ({
  page,
}) => {
  for (const chapter of cloudChapters) {
    await page.goto(`/learn/computing?topic=${chapter.topic}`);
    await expect(page.locator('.cloud-chapter > .source-disclosure')).toHaveCount(1);
    await expect(page.locator('.cloud-chapter > .source-disclosure')).not.toHaveAttribute('open');
    await expect(page.getByText(t.guidedNote, { exact: true })).toHaveCount(0);
    const sources = [
      ...new Map(
        chapter.members
          .flatMap((member): { id: string; url: string }[] => {
            const unit = laterUnits.find((unit) => member === `v2-${unit}`);
            return unit
              ? units
                  .find((item) => item.id === unit)!
                  .sources.map((id) => ({ id, url: sourceUrl(id) }))
              : v2Bindings
                  .find((item) => item.topic === member)!
                  .sources.map((id) => ({
                    id,
                    url: id.startsWith('BL')
                      ? beginnerSources[id as keyof typeof beginnerSources]
                      : sourceUrl(id as 'L02'),
                  }));
          })
          .map((source) => [source.id, source]),
      ).values(),
    ];
    const disclosure = page.locator('.cloud-chapter > .source-disclosure');
    await expect(disclosure.locator('[data-source-id]')).toHaveCount(sources.length);
    for (const source of sources)
      await expect(disclosure.locator(`[data-source-id="${source.id}"] a`)).toHaveAttribute(
        'href',
        source.url,
      );

    for (const member of chapter.members) {
      const part = page.locator(`#cloud-part-${member}`),
        copy = t.topics[member];
      await expect(part.getByText(copy.text, { exact: true })).toHaveCount(1);
      await expect(part.getByText(copy.detail, { exact: true })).toHaveCount(1);
    }
    await expect(page.locator('.course-nav-next a')).toHaveCount(1);
  }
  await page.goto('/learn/computing?topic=capacity-basics');
  await page.getByLabel(nb.foundationsVisuals.prediction, { exact: true }).fill('2');
  await page.getByRole('button', { name: nb.foundationsVisuals.run, exact: true }).click();
  await expect.poll(async () => (await facts(page)).runs.length).toBe(1);
  await page.locator('.v2-capacity-controls').getByRole('radio', { name: /^10 / }).check();
  await page.getByLabel(nb.foundationsVisuals.prediction, { exact: true }).fill('0');
  await page.getByRole('button', { name: nb.foundationsVisuals.run, exact: true }).click();
  await expect.poll(async () => (await facts(page)).runs.length).toBe(2);
  await expect(page.locator('#cloud-part-v2-capacity .v2-check button')).toBeEnabled();
});
test('chapter navigation keeps PR51 explicit abandonment assisted practice denied writes cross-tab and Journal fail closed', async ({
  page,
  context,
}) => {
  const raw = JSON.stringify(
    applyV2(applyV2(freshV2(), { kind: 'begin' })!, { kind: 'draft', answers: { shortfall: '3' } }),
  );
  await page.addInitScript(
    ({ key, raw }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, raw);
    },
    { key, raw },
  );
  await page.goto('/learn/computing?topic=v2-assessment');
  await page.reload();
  expect((await facts(page)).active).toBe(true);
  await openCloudPart(page, 'provisioning');
  await expect(page).toHaveURL(/topic=virtualization$/);
  await expect(page.locator('.cloud-chapter-heading h2')).toBeFocused();
  expect((await facts(page)).active).toBe(false);
  expect((await facts(page)).abandoned).toHaveLength(1);
  expect((await facts(page)).submissions).toEqual([]);
  await page.goto('/learn/computing?topic=v2-assessment');
  await page.getByRole('button', { name: t.retry, exact: true }).click();
  expect((await facts(page)).abandoned).toHaveLength(1);
  expect((await facts(page)).assisted).toBe(true);
  const stored = await page.evaluate((key) => localStorage.getItem(key), key);
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw Error('denied');
      return original.call(this, k, v);
    };
  }, key);
  await openCloudPart(page, 'provisioning');
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(stored);
  await page.keyboard.press('Escape');
  await expect(page.locator('.cloud-chapter')).toHaveCount(0);
  const other = await context.newPage();
  await other.goto('/learn/computing?topic=v2-assessment');
  await other.getByLabel(t.extraItems[0]!.question, { exact: true }).fill('4');
  await expect(page.locator('.course-storage').first()).toBeVisible();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(
    page.locator('.portal-dialog .cloud-chapter, .portal-dialog .foundations-v2'),
  ).toHaveCount(0);
  await other.close();
});
test('consolidated chapter desktop compact short-height keyboard reduced motion and Axe keep explanations and controls reachable', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learn/computing?topic=virtualization');
  await expect(page.locator('[data-activity-heading]')).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto('/learn/computing?topic=virtualization');
    await expect(page.locator('[data-activity-heading]')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.locator('.cloud-chapter-guide summary').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.cloud-chapter-guide')).toHaveAttribute('open');
    await page.keyboard.press('Enter');
    await expect(page.locator('.cloud-chapter-guide')).not.toHaveAttribute('open');
    await page.locator('#cloud-part-provisioning button').first().scrollIntoViewIfNeeded();
    const control = await page.locator('#cloud-part-provisioning button').first().boundingBox(),
      footer = await page.locator('.course-step-navigation').boundingBox();
    expect(control!.y + control!.height).toBeLessThanOrEqual(footer!.y);
    if (width === 1024 && height === 500)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    if (width === 1440 || height === 500)
      await page.screenshot({ path: info.outputPath(`chapter-${width}x${height}.png`) });
  }
});
