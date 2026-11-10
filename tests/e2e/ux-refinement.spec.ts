import { openCloudPart } from './cloud-chapter-actions';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, ownerAcceptanceNb as acceptance } from '../../src/content/nb';
import { restoreV2, v2Facts } from '../../src/domain/curriculum/foundations-v2';
const r = nb.refinement,
  t = nb.foundationsV2,
  c = nb.course;
test.use({ trace: 'on' });
for (const [width, height] of [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
]) {
  test(`desktop ${width}: full-width comparisons, relational diagram, persistent navigation and honest records`, async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== 'desktop-chromium',
      'Desktop-first refinement; existing narrow regressions retained.',
    );
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto('/learn');
    await page.getByRole('link', { name: `${c.open}: Cloud computing`, exact: true }).click();
    await expect(page.locator('[data-activity-heading]')).toBeFocused();
    const nav = page.getByRole('navigation', { name: c.next, exact: true });
    await expect(nav).toHaveCount(1);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(nav).toBeInViewport({ ratio: 1 });
    const footer = await page.locator('.course-footer').boundingBox(),
      bar = await nav.boundingBox();
    expect(footer!.y + footer!.height).toBeLessThanOrEqual(bar!.y);
    await page.locator('.course-build > summary').click();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const build = await page.locator('.course-build > p').last().boundingBox();
    expect(build!.y + build!.height).toBeLessThanOrEqual(bar!.y);
    await page.locator('.course-build > summary').click();
    await page.screenshot({ path: info.outputPath(`31b1-after-navigation-${width}.png`) });
    await nav.getByRole('link', { name: new RegExp(c.next) }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/topic=virtualization/);
    await expect(page.locator('[data-activity-heading]')).toBeFocused();
    const heading = await page.locator('[data-activity-heading]').boundingBox(),
      header = await page.locator('.course-header').boundingBox();
    expect(heading!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
    await page.goBack();
    await expect(page).toHaveURL(/topic=intro-request/);
    await expect(page.locator('[data-activity-heading]')).toBeFocused();
    await page.goForward();
    await expect(page).toHaveURL(/topic=virtualization/);
    await expect(page.locator('[data-activity-heading]')).toBeFocused();
    await openCloudPart(page, 'v2-responsibility');
    const explorer = page.locator('.portal-responsibility');
    await explorer.scrollIntoViewIfNeeded();
    await explorer
      .getByRole('button', { name: nb.expansion.common.recapCases[0]![1], exact: true })
      .click();
    await expect(explorer.getByRole('status')).toContainText(nb.portal.responsibility.microsoft);
    await explorer
      .getByRole('button', { name: nb.expansion.common.recapCases[1]![1], exact: true })
      .click();
    await expect(explorer.getByRole('status')).toContainText(nb.portal.responsibility.customer);
    await expect(
      explorer.getByRole('link', { name: nb.expansion.common.recapDeep, exact: true }),
    ).toHaveCount(0);
    await expect(explorer).toContainText(nb.expansion.common.recapNote);
    expect(
      await page.evaluate(() => localStorage.getItem('azurelab.portal.learning.v1')),
    ).toBeNull();
    expect(
      await page.evaluate(() => localStorage.getItem('azurelab.learning.service-types.v2')),
    ).toBeNull();
    const rect = await explorer.boundingBox(),
      main = await page.locator('.course-main').boundingBox();
    expect(rect!.width).toBeGreaterThan(main!.width * 0.8);
    await page.screenshot({ path: info.outputPath(`31b1-after-responsibility-${width}.png`) });
    await expect(
      page.getByText(nb.foundations.units.responsibility.limits, { exact: true }),
    ).toHaveCount(1);
    await openCloudPart(page, 'v2-models');
    const diagram = page.getByRole('region', { name: r.topology.title, exact: true });
    await diagram.scrollIntoViewIfNeeded();
    await diagram.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.screenshot({ path: info.outputPath(`31b1-after-public-${width}.png`) });
    await diagram.getByRole('button', { name: r.topology.models.private, exact: true }).click();
    await expect(diagram).toHaveAttribute('data-location', 'local');
    await diagram.getByLabel(r.topology.offsite, { exact: true }).check();
    await expect(diagram).toHaveAttribute('data-model', 'private');
    await expect(diagram).toHaveAttribute('data-location', 'operator');
    await expect(diagram.getByRole('status')).toHaveText(r.topology.unchanged);
    await diagram.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.screenshot({ path: info.outputPath(`31b1-after-private-${width}.png`) });
    await diagram.getByRole('button', { name: r.topology.models.hybrid, exact: true }).click();
    await expect(diagram.locator('.deployment-integration')).toHaveCount(1);
    await diagram.getByLabel(r.topology.relationship, { exact: true }).uncheck();
    await expect(diagram.locator('.deployment-integration')).toHaveCount(0);
    await expect(diagram.getByRole('status')).toHaveText(r.topology.separate);
    await diagram.getByLabel(r.topology.relationship, { exact: true }).check();
    await diagram.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.screenshot({ path: info.outputPath(`31b1-after-hybrid-${width}.png`) });
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await expect(nav).toBeInViewport({ ratio: 1 });
    const records = await page.evaluate(() =>
      Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)])),
    );
    const v2 = JSON.parse(records['azurelab.learning.foundations.v2']!);
    expect(
      v2.events.every(
        (event: { kind: string; event?: { kind: string } }) =>
          event.kind === 'visit' || (event.kind === 'practice' && event.event?.kind === 'visit'),
      ),
    ).toBe(true);
    expect(records['azurelab.learning.foundations.v1']).toBeUndefined();
    await page.reload();
    await expect(diagram).toHaveAttribute('data-model', 'public'); // display choice isn't competency evidence
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}
test('assessment draft survives persistent Previous and browser return without submission', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Desktop-first navigation.');
  await page.goto('/learn/computing?topic=v2-assessment');
  await page.getByRole('button', { name: t.beginAssessment, exact: true }).click();
  const input = page.locator('.foundations-v2 form input').first();
  const radio = (await input.getAttribute('type')) === 'radio';
  if (radio) await input.check();
  else await input.fill('2');
  const answerText = radio ? (await input.locator('..').innerText()).trim() : '2';
  const before = await page.evaluate(() =>
    localStorage.getItem('azurelab.learning.foundations.v2'),
  );
  await page
    .getByRole('navigation', { name: c.next, exact: true })
    .getByRole('link', { name: new RegExp(c.previous) })
    .click();
  await expect(page).toHaveURL(/topic=resource-bridge/);
  await page.goBack();
  await expect(page).toHaveURL(/topic=v2-assessment/);
  // Owner correction: deliberate Previous ends the active attempt, retaining its
  // draft as historical evidence. Browser return must not silently restart it.
  await expect(page.locator('.foundations-v2 form')).toHaveCount(0);
  await expect(page.locator('.v2-abandoned')).toContainText(acceptance.abandonedNote);
  await page.locator('.v2-abandoned summary').click();
  await expect(page.locator('.v2-abandoned dd').first()).toHaveText(answerText);
  await page.reload();
  await expect(page.locator('.foundations-v2 form')).toHaveCount(0);
  await page.locator('.v2-abandoned summary').click();
  await expect(page.locator('.v2-abandoned dd').first()).toHaveText(answerText);
  const after = await page.evaluate(() => localStorage.getItem('azurelab.learning.foundations.v2'));
  const oldSave = JSON.parse(before!);
  const restored = restoreV2(after!);
  expect(restored.issue).toBeNull();
  expect(restored.save.events.slice(0, oldSave.events.length)).toEqual(oldSave.events);
  const closed = v2Facts(restored.save);
  expect(closed.active).toBe(false);
  expect(closed.abandoned).toHaveLength(1);
  expect(closed.abandoned[0]!.answers).toEqual(
    oldSave.events.findLast((e: { kind: string }) => e.kind === 'draft').answers,
  );
  expect(JSON.parse(after!).events.filter((e: { kind: string }) => e.kind === 'submit')).toEqual(
    JSON.parse(before!).events.filter((e: { kind: string }) => e.kind === 'submit'),
  );
  await page.getByRole('button', { name: t.retry, exact: true }).click();
  await expect(page.locator('.foundations-v2 form')).toBeVisible();
  const restarted = v2Facts(
    restoreV2(await page.evaluate(() => localStorage.getItem('azurelab.learning.foundations.v2')))
      .save,
  );
  expect(restarted).toMatchObject({ active: true, assisted: true, draft: {}, submissions: [] });
  expect(restarted.abandoned[0]!.answers).toEqual(closed.abandoned[0]!.answers);
});
