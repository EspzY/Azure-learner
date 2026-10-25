import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
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
    await page.goto('/');
    await page
      .getByRole('link', { name: `${c.open}: ${nb.official.computing}`, exact: true })
      .click();
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
    await expect(page).toHaveURL(/topic=physical-server/);
    await expect(page.locator('[data-activity-heading]')).toBeFocused();
    const heading = await page.locator('[data-activity-heading]').boundingBox(),
      header = await page.locator('.course-header').boundingBox();
    expect(heading!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
    await page.goBack();
    await expect(page).toHaveURL(/topic=intro-request/);
    await expect(page.locator('[data-activity-heading]')).toBeFocused();
    await page.goForward();
    await expect(page).toHaveURL(/topic=physical-server/);
    await expect(page.locator('[data-activity-heading]')).toBeFocused();
    await page
      .locator('.course-units')
      .getByRole('link', { name: t.topics['v2-responsibility'].title, exact: true })
      .click();
    const explorer = page.locator('.portal-responsibility');
    await explorer.scrollIntoViewIfNeeded();
    const model = explorer.locator('.portal-model-choice');
    await model.getByRole('button', { name: /IAAS/ }).click();
    await expect(
      explorer
        .locator('.portal-layer-stack button')
        .filter({ hasText: nb.expedition.layers.os.label }),
    ).toContainText(nb.portal.responsibility.customer);
    await model.getByRole('button', { name: /PAAS/ }).click();
    await expect(
      explorer
        .locator('.portal-layer-stack button')
        .filter({ hasText: nb.expedition.layers.os.label }),
    ).toContainText(nb.portal.responsibility.microsoft);
    await expect(explorer.locator('.responsibility-changes')).toContainText('IAAS → PAAS');
    const rect = await explorer.boundingBox(),
      main = await page.locator('.course-main').boundingBox();
    expect(rect!.width).toBeGreaterThan(main!.width * 0.8);
    await page.screenshot({ path: info.outputPath(`31b1-after-responsibility-${width}.png`) });
    await expect(
      page.getByText(nb.foundations.units.responsibility.limits, { exact: true }),
    ).toHaveCount(1);
    await page
      .locator('.course-units')
      .getByRole('link', { name: t.topics['v2-models'].title, exact: true })
      .click();
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
  if (radio) await expect(input).toBeChecked();
  else await expect(input).toHaveValue('2');
  await page.reload();
  if (radio) await expect(input).toBeChecked();
  else await expect(input).toHaveValue('2');
  const after = await page.evaluate(() => localStorage.getItem('azurelab.learning.foundations.v2'));
  expect(JSON.parse(after!).events.filter((e: { kind: string }) => e.kind === 'submit')).toEqual(
    JSON.parse(before!).events.filter((e: { kind: string }) => e.kind === 'submit'),
  );
});
