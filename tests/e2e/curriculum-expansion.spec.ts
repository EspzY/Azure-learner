import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { trackUnits, expansionKeys, facts, restore } from '../../src/domain/curriculum/expansion';
import { manuscript } from '../../src/domain/curriculum/expansion-content';
const c = nb.expansion.common;
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(180000);
async function select(page: Page, field: keyof typeof c.labels, value: string) {
  await page
    .locator('.expanded-controls')
    .getByRole('combobox', { name: c.labels[field], exact: true })
    .selectOption(value);
}
async function run(page: Page) {
  await page.getByRole('button', { name: c.run, exact: true }).click();
  await expect(page.locator('.expanded-result')).toBeVisible();
}
async function unitLink(page: Page, title: string) {
  const link = page.locator('.course-units').getByRole('link', { name: title, exact: true });
  if (!(await link.isVisible())) await page.locator('.course-menu-toggle').click();
  await link.click();
}
async function shot(page: Page, info: TestInfo, name: string) {
  await page
    .locator('.expanded-experiment')
    .evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.screenshot({ path: info.outputPath(`32-${name}.png`), scale: 'css' });
}
async function audit(page: Page) {
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
test('root → complete Benefits investigations → independent changed context → Service Types, with isolated evidence', async ({
  page,
}, info) => {
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== new URL(info.project.use.baseURL!).origin)
      external.push(r.url());
  });
  await page.goto('/');
  await expect(page).toHaveURL(/\/learn$/);
  const old = await page.evaluate(() =>
    Object.fromEntries(
      [
        'azurelab.learning.foundations.v1',
        'azurelab.learning.foundations.v2',
        'azurelab.portal.learning.v1',
        'azurelab.chapter01.v1',
        'azurelab.progress.v1',
      ].map((k) => [k, localStorage.getItem(k)]),
    ),
  );
  await page
    .getByRole('link', { name: `${nb.course.open}: ${nb.official.benefits}`, exact: true })
    .click();
  await expect(page).toHaveURL(/\/learn\/benefits\?topic=availability/);
  await expect(
    page.getByRole('heading', { name: nb.official.benefits, exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: info.outputPath('32-benefits-teaching.png'), scale: 'css' });
  await expect(page.getByText(nb.expansion.benefits.intro, { exact: true })).toHaveCount(1);
  for (const unit of trackUnits.benefits) {
    if (unit !== 'availability') await unitLink(page, manuscript('benefits', unit)!.title);
    await expect(
      page.getByText(manuscript('benefits', unit)!.mechanism, { exact: true }),
    ).toBeVisible();
    if (unit === 'availability') {
      await page.getByLabel(c.prediction, { exact: true }).fill('6');
      await run(page);
      await select(page, 'failed', 'one');
      await page.getByLabel(c.prediction, { exact: true }).fill('6');
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(`${c.results.served}0`);
      await select(page, 'instances', '2');
      await select(page, 'size', '4');
      await select(page, 'routing', 'balanced');
      await page.getByLabel(c.prediction, { exact: true }).fill('4');
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(`${c.results.unmet}2`);
    } else if (unit === 'reliability') {
      await select(page, 'incident', 'dependency');
      await select(page, 'remedy', 'scale');
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(c.results.dependencyDown);
      for (const [incident, remedy] of [
        ['capacity', 'scale'],
        ['instance', 'reroute'],
        ['dependency', 'restore'],
        ['trend', 'observe'],
      ]) {
        await select(page, 'incident', incident!);
        await select(page, 'remedy', remedy!);
        await run(page);
      }
    } else if (unit === 'governance') {
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(
        nb.chapter.errors['policy-location-denied'],
      );
      await expect(page.locator('.expanded-result')).toContainText(c.results.fork);
      await select(page, 'region', 'westeurope');
      await run(page);
      await select(page, 'region', 'northeurope');
      await select(page, 'subscription', 'sub-shared');
      await run(page);
    } else if (unit === 'management') {
      await run(page);
      await select(page, 'method', 'template');
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(c.results.consistentWrong);
      await select(page, 'template', 'westeurope');
      await run(page);
    } else {
      await run(page);
      await select(page, 'capacity', '4');
      await select(page, 'hours', '8');
      await run(page);
      await select(page, 'profile', 'critical');
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(`${c.results.unmet}32`);
    }
    const question = manuscript('benefits', unit)!;
    const radios = page.locator('.expanded-practice input[type=radio]');
    await radios.nth(1).check();
    await page.getByRole('button', { name: c.check, exact: true }).click();
    await expect(page.locator('.expanded-practice [role=status]').first()).toContainText(
      question.choices[1]![2]!,
    );
    await radios.first().check();
    await page.getByRole('button', { name: c.check, exact: true }).click();
    await expect(page.locator('.expanded-practice')).toContainText(c.practiced);
    await shot(page, info, unit);
    await audit(page);
  }
  await page.goto('/learn/benefits?topic=summary');
  await expect(page.locator('.expanded-summary')).toContainText(c.guidedComplete);
  await expect(page.locator('.expanded-summary')).toContainText(c.noAssessment);
  await page.getByRole('link', { name: c.assessment, exact: true }).last().click();
  await page.getByRole('button', { name: c.begin, exact: true }).click();
  await page
    .getByLabel(nb.expansion.benefits.assessment.items[0]!.question, { exact: true })
    .fill('0');
  await page.reload();
  await expect(
    page.getByLabel(nb.expansion.benefits.assessment.items[0]!.question, { exact: true }),
  ).toHaveValue('0');
  await page
    .getByLabel(nb.expansion.benefits.assessment.items[0]!.question, { exact: true })
    .fill('1');
  const answers = ['restore', 'one-rule', 'review', 'data', 'usage'];
  for (let n = 1; n < nb.expansion.benefits.assessment.items.length; n++) {
    await page
      .getByLabel(nb.expansion.benefits.assessment.items[n]!.question, { exact: true })
      .selectOption(answers[n - 1]!);
  }
  await page.getByRole('button', { name: c.submit, exact: true }).click();
  await expect(page.locator('.expanded-assessment')).toContainText(c.first);
  await page.reload();
  const saved = await page.evaluate((k) => localStorage.getItem(k), expansionKeys.benefits);
  const observed = facts(restore('benefits', saved).save);
  expect(observed.submissions).toHaveLength(1);
  expect(observed.submissions[0]!.assisted).toBe(false);
  expect(Object.values(observed.submissions[0]!.criteria).every(Boolean)).toBe(true);
  await page.goto('/learn/services?topic=overview');
  await expect(page.locator('.expanded-module')).toContainText(
    nb.expansion.services.units.overview.mechanism,
  );
  expect(
    await page.evaluate(
      (keys) => Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)])),
      Object.keys(old),
    ),
  ).toEqual(old);
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
test('operational Service Types configurations, wrong causes, separate version and assessment aid', async ({
  page,
}, info) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: `${nb.course.open}: ${nb.official.services}`, exact: true })
    .click();
  for (const m of ['IAAS', 'PAAS', 'SAAS'])
    await page
      .locator('.portal-model-choice')
      .getByRole('button', { name: new RegExp(m) })
      .click();
  await expect(
    page.locator('.portal-layer-stack button').filter({ hasText: nb.expedition.layers.os.label }),
  ).toContainText(nb.portal.responsibility.microsoft);
  for (const unit of ['iaas', 'paas', 'saas', 'selection'] as const) {
    if (unit === 'iaas') {
      await page.locator('.expanded-practice input[type=radio]').first().check();
      await page.getByRole('button', { name: c.check, exact: true }).click();
    }
    await unitLink(page, manuscript('services', unit)!.title);
    await expect(
      page.getByText(nb.portal.lesson.sections[unit].mechanism, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(manuscript('services', unit)!.mechanism, { exact: true }),
    ).toBeVisible();
    await run(page);
    if (unit === 'iaas') {
      await expect(page.locator('.expanded-result')).toContainText(c.results.vmMissing.os);
      for (const [key, v] of [
        ['guest', 'windows'],
        ['ram', '8'],
        ['disk', 'persistent'],
        ['network', 'configured'],
        ['runtime', 'installed'],
        ['patch', 'planned'],
      ] as const)
        await select(page, key, v);
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(c.results.aligned);
    } else if (unit === 'paas') {
      await expect(page.locator('.expanded-result')).toContainText(c.results.paasCause.unsupported);
      for (const [key, v] of [
        ['package', 'supported'],
        ['config', 'set'],
        ['access', 'restricted'],
        ['data', 'planned'],
      ] as const)
        await select(page, key, v);
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(c.results.paasCause.fit);
    } else if (unit === 'saas') {
      await select(page, 'role', 'user');
      await select(page, 'sharing', 'team');
      await run(page);
      await select(page, 'user', 'departed');
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(c.results.saasCause.inactive);
    } else {
      for (const [scenario, model, reason] of [
        ['legacy', 'iaas', 'os-team'],
        ['custom', 'paas', 'platform-supported'],
        ['ready', 'saas', 'ready-service'],
        ['open', 'paas', 'platform-supported'],
      ]) {
        await select(page, 'scenario', scenario!);
        await select(page, 'model', model!);
        await select(page, 'reason', reason!);
        await run(page);
      }
      await select(page, 'reason', 'os-team');
      await run(page);
      await expect(page.locator('.expanded-result')).toContainText(c.results.failed);
    }
    await page.locator('.expanded-practice input[type=radio]').first().check();
    await page.getByRole('button', { name: c.check, exact: true }).click();
    await expect(page.locator('.expanded-practice')).toContainText(c.practiced);
    await shot(page, info, unit);
    await audit(page);
  }
  await page.goto('/learn/services?topic=practice');
  await expect(page.locator('.expanded-technical')).toContainText(c.technicalMissing);
  await expect(page.getByRole('button', { name: nb.course.startLab, exact: true })).toBeEnabled();
  await page.goto('/learn/services?topic=assessment');
  await page.getByRole('button', { name: c.begin, exact: true }).click();
  const independentAnswers: Record<string, string> = {
    guest: 'iaas',
    patch: 'customer',
    runtime: 'adapt',
    departure: 'access',
    architecture: 'paas',
    reason: 'platform-supported',
    hosting: 'plan',
  };
  for (const item of nb.expansion.services.assessment.items) {
    const control = page.getByRole('combobox', { name: item.question, exact: true });
    await expect(control).toHaveValue('');
    await control.selectOption(independentAnswers[item.id]!);
  }
  await page.getByRole('button', { name: c.submit, exact: true }).click();
  await expect(page.locator('.expanded-assessment-feedback h3')).toHaveText(c.first);
  await page.getByRole('button', { name: c.newAttempt, exact: true }).click();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(
    nb.expansion.services.units.overview.mechanism,
  );
  await page
    .getByRole('dialog')
    .getByRole('button', { name: nb.portal.close, exact: true })
    .click();
  await expect(page.locator('.expanded-assessment')).toContainText(c.assisted);
  for (const item of nb.expansion.services.assessment.items)
    await page
      .getByRole('combobox', { name: item.question, exact: true })
      .selectOption(item.id === 'reason' ? 'os-team' : independentAnswers[item.id]!);
  await page.getByRole('button', { name: c.submit, exact: true }).click();
  await expect(page.locator('.expanded-assessment-feedback h3')).toHaveText(c.retry);
  await page.reload();
  const data = await page.evaluate((k) => localStorage.getItem(k), expansionKeys.services);
  const submissions = facts(restore('services', data).save).submissions;
  expect(submissions).toHaveLength(2);
  expect(submissions[0]!.assisted).toBe(false);
  expect(Object.values(submissions[0]!.criteria).every(Boolean)).toBe(true);
  expect(submissions[1]).toMatchObject({
    retry: true,
    assisted: true,
    criteria: { architecture: false, reason: false },
  });
  await page.getByRole('button', { name: c.newAttempt, exact: true }).click();
  await page.goto('/portal?lab=web-platform&mode=guided');
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('azurelab.portal.learning.v1'))).toBeNull();
});
test('legacy service bytes require deliberate choice; new observations stay isolated and stale tabs stop', async ({
  page,
  context,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Desktop storage review');
  await page.goto('/learn/services?topic=selection&version=1');
  const legacy = page.locator('.portal-guided-case').first();
  await legacy
    .getByRole('combobox', { name: nb.portal.lesson.model, exact: true })
    .selectOption('iaas');
  await legacy
    .getByRole('combobox', { name: nb.portal.lesson.reason, exact: true })
    .selectOption('os-control');
  await legacy.getByRole('button', { name: nb.portal.lesson.check, exact: true }).click();
  const before = await page.evaluate(() => localStorage.getItem('azurelab.portal.learning.v1'));
  await page.goto('/learn/services?topic=overview');
  await expect(page.getByRole('heading', { name: c.choiceTitle, exact: true })).toBeVisible();
  await page.getByRole('button', { name: c.startCurrent, exact: true }).click();
  await expect(page.locator('.portal-responsibility')).toHaveCount(1);
  expect(
    facts(
      restore(
        'services',
        await page.evaluate((k) => localStorage.getItem(k), expansionKeys.services),
      ).save,
    ).guidedComplete,
  ).toBe(false);
  expect(await page.evaluate(() => localStorage.getItem('azurelab.portal.learning.v1'))).toBe(
    before,
  );
  await page.goto('/learn/benefits?topic=management');
  const other = await context.newPage();
  await other.goto('/learn/benefits?topic=management');
  await expect(other.getByRole('button', { name: c.run, exact: true })).toBeEnabled();
  await run(page);
  await expect(other.locator('.course-storage')).toContainText('conflict');
  await expect(other.getByRole('button', { name: c.run, exact: true })).toBeDisabled();
  await other.getByRole('button', { name: c.reload, exact: true }).click();
  await expect(other.getByRole('button', { name: c.run, exact: true })).toBeEnabled();
  await other.close();
  await page.evaluate((k) => localStorage.setItem(k, '{broken'), expansionKeys.benefits);
  await page.reload();
  await expect(page.locator('.course-storage')).toContainText('corrupt');
  await expect(page.getByRole('button', { name: c.run, exact: true })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('azurelab.portal.learning.v1'))).toBe(
    before,
  );
});
for (const [width, height] of [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
])
  test(`desktop ${width}: live operational composition and keyboard`, async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-chromium', 'Desktop-first reference');
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto('/');
    await page.screenshot({ path: info.outputPath(`32-landing-${width}.png`) });
    await page
      .getByRole('link', { name: `${nb.course.open}: ${nb.official.benefits}`, exact: true })
      .focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/learn\/benefits/);
    await page.getByLabel(c.prediction, { exact: true }).fill('6');
    await run(page);
    await shot(page, info, `availability-${width}`);
    await audit(page);
    await page.goto('/learn/services?topic=iaas');
    await run(page);
    await shot(page, info, `vm-${width}`);
    await audit(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/learn/services?topic=paas');
    await run(page);
    await shot(page, info, `platform-${width}`);
    await audit(page);
  });
