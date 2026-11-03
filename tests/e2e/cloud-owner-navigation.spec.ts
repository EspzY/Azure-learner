import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, ownerAcceptanceNb as owner } from '../../src/content/nb';
import { transferKey } from '../../src/domain/curriculum/transfer';
import { cloudChapters } from '../../src/features/course/cloud-computing-chapters';
import { foundationsV2Key, restoreV2, v2Facts } from '../../src/domain/curriculum/foundations-v2';
const technical = (page: import('@playwright/test').Page) =>
  page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(([key]) => !/learning|course|guidance/.test(key)),
    ),
  );
const facts = async (page: import('@playwright/test').Page) =>
  v2Facts(
    restoreV2(await page.evaluate((key) => localStorage.getItem(key), foundationsV2Key)).save,
  );

test('owner flat Cloud Computing navigation short desktop keyboard reduced motion and Axe expose actual teaching without nested menus or credit', async ({
  page,
}, info) => {
  const sizes =
    info.project.name === 'desktop-chromium'
      ? [
          { width: 1440, height: 900 },
          { width: 1024, height: 500 },
        ]
      : [page.viewportSize()!];
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const { width, height } of sizes) {
    await page.setViewportSize({ width, height });
    await page.goto('/learn/computing?topic=virtualization');
    await expect(page.locator('.cloud-chapter-heading h2')).toBeFocused();
    await expect(page.locator('#course-activities-computing > li')).toHaveCount(14);
    await expect(
      page.locator(
        '#course-activities-computing details, #course-activities-computing ol, .cloud-chapter-parts',
      ),
    ).toHaveCount(0);
    await expect(page.getByText('Deler i økten', { exact: true })).toHaveCount(0);
    await expect(page.locator('.cloud-chapter .related-activities, .related-transfer')).toHaveCount(
      0,
    );
    for (const [i, chapter] of cloudChapters.entries())
      await expect(page.locator('#course-activities-computing > li > a').nth(i)).toHaveText(
        chapter.title,
      );
    const first = await page
      .locator('#cloud-part-virtualization .v2-explanation > p')
      .first()
      .boundingBox();
    const header = await page.locator('.course-header').boundingBox();
    const footer = await page.locator('.course-step-navigation').boundingBox();
    expect(
      Math.min(first!.y + first!.height, footer!.y, height) -
        Math.max(first!.y, header!.y + header!.height),
    ).toBeGreaterThanOrEqual(64);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect.poll(async () => (await facts(page)).visited('virtualization')).toBe(true);
    expect((await facts(page)).visited('provisioning')).toBe(false);
    const before = await technical(page);
    await page.locator('.cloud-chapter-guide summary').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.cloud-chapter-guide')).toHaveAttribute('open');
    await page.keyboard.press('Enter');
    await expect(page.locator('.cloud-chapter-guide')).not.toHaveAttribute('open');
    expect((await facts(page)).submissions).toEqual([]);
    expect((await facts(page)).active).toBe(false);
    expect(await technical(page)).toEqual(before);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`owner-flat-${width}x${height}.png`) });
  }
});

test('historical chapter fragment addresses focus their original sections and ignore unknown or foreign parts without rewriting resume or creating results', async ({
  page,
}) => {
  await page.goto('/learn');
  const before = await technical(page);
  for (const chapter of cloudChapters) {
    const member = chapter.members.at(-1)!;
    const href = `/learn/computing?topic=${chapter.topic}#cloud-part-${member}`;
    await page.goto(href);
    await expect(page).toHaveURL(href);
    await expect(page.locator('.cloud-chapter')).toHaveAttribute('aria-label', chapter.title);
    await expect(page.locator(`#cloud-part-${member} h3`).first()).toBeFocused();
    await expect(page.locator(`#cloud-part-${member} h3`).first()).toBeInViewport();
    await expect(
      page.locator('#course-activities-computing > li > a[aria-current=step]'),
    ).toHaveCount(1);
  }
  await page.goto('/learn/computing?topic=virtualization#cloud-part-physical-server');
  await expect(page.locator('.cloud-chapter-heading h2')).toBeFocused();
  await page.goto('/learn/computing?topic=provisioning');
  await expect(page.locator('#cloud-part-provisioning h3').first()).toBeFocused();
  await page.reload();
  await expect(page.locator('#cloud-part-provisioning h3').first()).toBeFocused();
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(localStorage.getItem('azurelab.course.v1')!).resume.topic),
    )
    .toBe('provisioning');
  // An old debrief address with an unfinished lab keeps the original lab fallback.
  await page.goto('/learn/computing?topic=resource-bridge&activity=debrief');
  await expect(page.locator('#lab-debrief')).toHaveCount(0);
  await expect(page.locator('#practical-lab')).toBeFocused();
  await expect(page.locator('#practical-lab')).toBeInViewport();
  expect((await facts(page)).submissions).toEqual([]);
  expect((await facts(page)).active).toBe(false);
  expect(await technical(page)).toEqual(before);
});

test('closing Cloud Computing choices distinguish voluntary assessment observations and recommended transfer without starting attempts', async ({
  page,
}, info) => {
  if (info.project.name === 'desktop-chromium')
    await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/learn/computing?topic=resource-bridge');
  await expect.poll(async () => (await facts(page)).visited('resource-bridge')).toBe(true);
  const before = await technical(page);
  const choice = page.locator('.related-activities');
  await expect(choice).toHaveCount(1);
  await expect(choice).not.toHaveAttribute('open');
  const saved = await page.evaluate((key) => localStorage.getItem(key), foundationsV2Key);
  await choice.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(choice).toHaveAttribute('open');
  expect(await page.evaluate((key) => localStorage.getItem(key), foundationsV2Key)).toBe(saved);
  await expect(choice).toContainText(owner.assessmentPurpose);
  await expect(choice).toContainText(owner.observationsPurpose);
  await expect(choice.getByRole('link', { name: owner.assessment, exact: true })).toHaveAttribute(
    'href',
    '/learn/computing?topic=v2-assessment',
  );
  await expect(choice.getByRole('link', { name: owner.observations, exact: true })).toHaveAttribute(
    'href',
    '/learn/computing?topic=v2-summary',
  );
  await expect(page.locator('.course-nav-next a')).toHaveCount(1);
  await expect(page.locator('.course-nav-next a')).toHaveAttribute(
    'href',
    '/learn/computing?topic=transfer',
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('closing-secondary-choices.png') });
  await choice.getByRole('link', { name: owner.assessment, exact: true }).click();
  await expect(page).toHaveURL(/topic=v2-assessment$/);
  await expect(
    page.getByRole('button', { name: nb.foundationsV2.beginAssessment, exact: true }),
  ).toBeVisible();
  expect((await facts(page)).active).toBe(false);
  await page.goBack();
  await expect(page).toHaveURL(/topic=resource-bridge$/);
  await page.locator('.related-activities summary').click();
  await page.getByRole('link', { name: owner.observations, exact: true }).click();
  await expect(page).toHaveURL(/topic=v2-summary$/);
  await page.goBack();
  await expect(page).toHaveURL(/topic=resource-bridge$/);
  await page.locator('.course-nav-next a').click();
  await expect(page).toHaveURL(/topic=transfer$/);
  await expect(page.locator('.transfer-workspace')).toBeVisible();
  await expect(page.locator('.course-nav-next a')).toHaveAttribute(
    'href',
    '/learn/benefits?topic=availability',
  );
  await page.reload();
  await expect(page.locator('.transfer-workspace')).toBeVisible();
  expect(
    await page.evaluate(
      (key) => JSON.parse(localStorage.getItem(key) ?? '{"events":[]}').events,
      transferKey,
    ),
  ).toEqual([]);
  expect((await facts(page)).active).toBe(false);
  expect((await facts(page)).submissions).toEqual([]);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: nb.course.journal, exact: true })).toBeFocused();
  expect(await technical(page)).toEqual(before);
});
