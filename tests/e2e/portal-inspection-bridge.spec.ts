import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  inspectionBridgeNb as c,
  nb,
  computeNb,
  serverlessNb,
  refinedAssessmentNb,
} from '../../src/content/nb';
import { inspectionFixture } from '../fixtures/portal-inspection';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { storageKey } from '../../src/domain/progression';
import { parseLocation, portalHref } from '../../src/domain/portal/model';
import { inspectionHref, resourceOperations } from '../../src/domain/portal/inspection';
import { computeKey, computeFacts, restoreCompute } from '../../src/domain/curriculum/compute';
import {
  refinedKeys,
  refinedHref,
  refinedFacts,
  restoreRefined,
} from '../../src/domain/curriculum/refined-assessment';
const p = nb.portal;
async function seed(page: Page) {
  const f = inspectionFixture();
  await page.addInitScript(
    ({ key, raw }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, raw);
    },
    { key: sandboxKey, raw: f.raw },
  );
  return f;
}
const technical = (page: Page) =>
  page.evaluate(({ key, xp }) => [localStorage.getItem(key), localStorage.getItem(xp)], {
    key: sandboxKey,
    xp: storageKey,
  });
const vmGuide = async (page: Page) =>
  computeFacts(restoreCompute(await page.evaluate((k) => localStorage.getItem(k), computeKey)).save)
    .guide;
async function selectTarget(page: Page, id: string) {
  const bridge = page.locator('.inspection-bridge');
  await expect(bridge).toBeVisible();
  await bridge.getByRole('combobox', { name: c.select, exact: true }).selectOption(id);
  await bridge.getByRole('link', { name: c.open, exact: false }).click();
  await expect(page).toHaveURL(/\/portal\?/);
}
const returnLink = (page: Page) =>
  page
    .locator('.portal-training-strip')
    .getByRole('link', { name: nb.course.returnCourse, exact: true });

test('VM course bridge follows actual dependencies receipt views native guidance and exact return without inspection credit', async ({
  page,
}) => {
  const f = await seed(page);
  await page.goto('/learn/compute?topic=dependencies');
  await page.getByRole('button', { name: computeNb.labels.begin, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
  const guide = JSON.stringify(await vmGuide(page)),
    before = await technical(page);
  await selectTarget(page, f.vm.id);
  await expect(page.locator('.portal-title h1')).toHaveText(f.vm.name);
  const menu = page.locator('.portal-resource-menu');
  await menu.getByRole('button', { name: nb.portalUi.properties, exact: true }).click();
  await expect(page).toHaveURL(/view=properties/);
  await expect(page.locator('.portal-resource-main')).toBeFocused();
  await page.reload();
  await expect(page.locator('.portal-resource-main')).toContainText('ubuntu-22-04');
  await page.goBack();
  await expect(menu.getByRole('button', { name: p.overview, exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await menu.getByRole('button', { name: nb.portalUi.networking, exact: true }).click();
  await page
    .locator('.portal-infrastructure')
    .getByRole('button', { name: new RegExp(f.vm.name + '-nic') })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText(f.vm.name + '-nic');
  await page
    .locator('.portal-infrastructure')
    .getByRole('button', { name: new RegExp(f.vm.name + '-subnet') })
    .click();
  await page
    .locator('.portal-infrastructure')
    .getByRole('button', { name: new RegExp(f.vm.name + '-vnet') })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText(f.vm.name + '-vnet');
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: p.areas.activity, exact: true })
    .click();
  await expect(page).toHaveURL(/resource=vnet-/);
  await expect(page.locator('.portal-inspection-scope')).toContainText(f.vm.name + '-vnet');
  const code = resourceOperations(f.engine, f.vm.id)[0]!.entry.receipt.commandId;
  await page
    .locator('.portal-table-scroll')
    .getByRole('button', { name: code, exact: true })
    .click();
  await expect(page.locator('.chapter-receipt')).toContainText(code);
  await expect(page.locator('[data-receipt-evidence]')).toContainText(f.vm.name);
  const coach = page.locator('.compute-portal-guide');
  await coach.getByRole('button', { name: computeNb.vmCopy.hide, exact: true }).click();
  await page.locator('.portal-guidance-toggle').click();
  await expect(coach).not.toHaveClass(/minimized/);
  await returnLink(page).click();
  await expect(page).toHaveURL(/learn\/compute\?topic=dependencies/);
  expect(JSON.stringify(await vmGuide(page))).toBe(guide);
  expect(await technical(page)).toEqual(before);
  await page.locator('.course-overview-link').click();
  await expect(page.locator('.course-primary')).toHaveAttribute(
    'href',
    /learn\/compute\?topic=dependencies/,
  );
});

test('Web App inspection connects actual plan scope and original configuration with filtered history and Back Forward', async ({
  page,
}) => {
  const f = await seed(page);
  await page.goto('/learn/management-tools?topic=studio&perspective=intent');
  const before = await technical(page);
  await selectTarget(page, f.app.id);
  await expect(page.locator('.portal-title h1')).toHaveText(f.app.name);
  await page
    .locator('.portal-essentials')
    .getByRole('button', { name: f.plan.name, exact: true })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText(f.plan.name);
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: p.areas.activity, exact: true })
    .click();
  await expect(page.locator('tbody tr')).toHaveCount(2);
  await expect(page.locator('.portal-inspection-scope')).toContainText(f.plan.name);
  await page.goBack();
  await expect(page.locator('.portal-title h1')).toHaveText(f.plan.name);
  await page.goForward();
  await expect(page.locator('.portal-inspection-scope')).toContainText(f.plan.name);
  await page.reload();
  await expect(page.locator('tbody tr')).toHaveCount(2);
  const prior = resourceOperations(f.engine, f.app.id).find(
    (x) => x.entry.request.command.environment === 'staging',
  )!.entry;
  await page.goto(
    portalHref(parseLocation(new URLSearchParams('tools=intent')), 'activity', {
      id: prior.receipt.commandId,
      resource: f.app.id,
    }),
  );
  await expect(page.locator('[data-receipt-evidence]')).toContainText('staging');
  await expect(page.locator('[data-receipt-evidence]')).not.toContainText('production');
  await page
    .locator('[data-receipt-evidence]')
    .getByRole('button', { name: new RegExp(f.app.name) })
    .click();
  await expect(page.locator('.portal-infrastructure')).toContainText('production');
  await returnLink(page).click();
  await expect(page).toHaveURL(/learn\/management-tools\?topic=studio&perspective=intent/);
  expect(await technical(page)).toEqual(before);
});

test('Governance bridge selects original Policy denial and original submitted scope without fabricating a resource', async ({
  page,
}) => {
  const f = await seed(page);
  await page.goto('/learn/governance?topic=studio&perspective=policy');
  const before = await technical(page);
  await selectTarget(page, f.denied.receipt.commandId);
  await expect(page.locator('.chapter-receipt')).toHaveAttribute('data-outcome', 'rejected');
  await expect(page.locator('.chapter-receipt')).toContainText('policy-location-denied');
  await expect(page.locator('[data-receipt-evidence]')).toContainText('plan-denied');
  await expect(page.locator('[data-receipt-evidence]')).toContainText('northeurope');
  await expect(page.locator('.policy-witness')).toContainText('sub-app');
  await page
    .locator('.policy-witness')
    .getByRole('button', { name: nb.chapter.showPolicy, exact: true })
    .click();
  await expect(page).toHaveURL(/area=policy/);
  await returnLink(page).click();
  await expect(page).toHaveURL(/learn\/governance\?topic=studio&perspective=policy/);
  expect(await technical(page)).toEqual(before);
});

test('Missing deleted invalid and cross-tab stale inspection targets fail honestly while old receipt IDs survive', async ({
  page,
  context,
}) => {
  const f = await seed(page);
  await page.goto('/learn/compute?topic=dependencies');
  await page.locator('.inspection-bridge select').selectOption(f.vm.id);
  const other = await context.newPage();
  await other.goto('/portal');
  f.command({ type: 'DeleteVmBundle', vmId: f.vm.id });
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: sandboxKey,
    raw: f.raw,
  });
  await expect(page.locator('.inspection-bridge')).toContainText(c.unsafe);
  await expect(page.locator('.inspection-bridge a')).toHaveCount(0);
  await page
    .locator('.inspection-bridge')
    .getByRole('button', { name: c.reload, exact: true })
    .click();
  await expect(page.locator('.inspection-bridge')).toContainText(c.empty);
  const after = await technical(page);
  await page.goto(inspectionHref('vm', f.vm.id));
  await expect(page.getByRole('status').filter({ hasText: c.missing })).toBeVisible();
  await expect(page.locator('.portal-resource-overview')).toHaveCount(0);
  const create = f.engine.ledger.find((e) => e.receipt.operation === 'CreateVmBundle')!;
  await page.goto('/portal?area=activity&compute=vm&id=' + create.receipt.commandId);
  await expect(page.locator('.chapter-receipt')).toContainText(create.receipt.commandId);
  await expect(page.locator('[data-receipt-evidence]')).toContainText(c.absent);
  await page.goto('/portal?area=resource&compute=vm&id=https%3A%2F%2Fevil.test');
  await expect(page.getByRole('status').filter({ hasText: c.missing })).toBeVisible();
  await expect(returnLink(page)).toHaveAttribute('href', '/learn/compute?topic=dependencies');
  await page.goto('/portal?area=activity&tools=intent&id=unknown-command');
  await expect(page.getByRole('status').filter({ hasText: c.noTarget })).toBeVisible();
  await expect(page.locator('.chapter-receipt')).toHaveCount(0);
  await page.goto(
    '/portal?area=activity&tools=intent&resource=' + f.plan.id + '&id=' + create.receipt.commandId,
  );
  await expect(page.getByRole('status').filter({ hasText: c.noTarget })).toBeVisible();
  await expect(page.locator('.chapter-receipt')).toHaveCount(0);
  await page.goto('/portal?area=resource&tools=intent&id=' + f.app.id + '&view=disks');
  await expect(
    page
      .locator('.portal-resource-menu')
      .getByRole('button', { name: nb.portalUi.disks, exact: true }),
  ).toHaveCount(0);
  await expect(
    page.locator('.portal-resource-menu').getByRole('button', { name: p.overview, exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page.goto('/portal?area=activity&compute=vm&resource=sub-app');
  await expect(page.locator('.portal-table-scroll tbody tr')).toHaveCount(
    resourceOperations(f.store.getSnapshot().attempt.engine, 'sub-app').length,
  );
  expect(await technical(page)).toEqual(after);
});

test('Independent raw Portal inspection stays neutral while denied durable assistance withholds course bridge instructions and exact resume', async ({
  page,
}) => {
  const f = await seed(page);
  await page.goto(refinedHref('benefits'));
  await page.getByRole('button', { name: refinedAssessmentNb.ui.start, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: refinedAssessmentNb.ui.confirm, exact: true })
    .click();
  await page.locator('[data-refined-item="b-capacity"]').getByRole('textbox').fill('4');
  const raw = await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits),
    before = await technical(page);
  await page.goto(inspectionHref('vm', f.vm.id));
  await page
    .locator('.portal-resource-menu')
    .getByRole('button', { name: p.areas.activity, exact: true })
    .click();
  await page.locator('.portal-table-scroll').getByRole('button').first().click();
  await expect(page.locator('[data-receipt-evidence]')).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits)).toBe(raw);
  await page.locator('.portal-guidance-toggle').click();
  await expect(page.locator('#portal-guidance-menu')).toContainText('aktiv selvstendig vurdering');
  await expect(page.locator('.compute-portal-guide')).not.toContainText(
    computeNb.missions.vm.observe,
  );
  const deny = (key: string) => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key && JSON.parse(v).events?.at(-1)?.kind === 'aid')
        throw new DOMException('Denied', 'QuotaExceededError');
      return set.call(this, k, v);
    };
  };
  await page.addInitScript(deny, refinedKeys.benefits);
  await page.evaluate(deny, refinedKeys.benefits);
  await returnLink(page).click();
  await expect(page).toHaveURL(/learn\/compute/);
  await expect(page.locator('.inspection-bridge')).toHaveCount(0);
  await expect(page.locator('.course-storage').first()).toBeVisible();
  expect(await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits)).toBe(raw);
  await page.goto('/learn');
  await expect(page.locator('.course-primary')).toHaveAttribute('href', refinedHref('benefits'));
  await page.locator('.course-primary').click();
  await expect(page).toHaveURL(/assessment=updated/);
  await page.reload();
  await expect(page.locator('[data-refined-item="b-capacity"]').getByRole('textbox')).toHaveValue(
    '4',
  );
  const facts = refinedFacts(
    restoreRefined(
      'benefits',
      await page.evaluate((k) => localStorage.getItem(k), refinedKeys.benefits),
    ).save,
  );
  expect(facts.assisted).toBe(false);
  expect(facts.first).toBeNull();
  expect(await technical(page)).toEqual(before);
});

test('Portal inspection desktop compact short-height keyboard focus reduced motion and Axe preserve accessible source and resource navigation', async ({
  page,
}) => {
  const f = await seed(page),
    initial = page.viewportSize()!;
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const size of [
    initial,
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1024, height: 768 },
    { width: 1024, height: 500 },
  ]) {
    await page.setViewportSize(size);
    await page.goto('/learn/compute?topic=dependencies');
    const bridge = page.locator('.inspection-bridge');
    await bridge.getByRole('combobox').selectOption(f.vm.id);
    await bridge.getByRole('link').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/area=resource/);
    const button = page
      .locator('.portal-resource-menu')
      .getByRole('button', { name: nb.portalUi.properties, exact: true });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.portal-resource-main')).toBeFocused();
    await expect(page).toHaveURL(/view=properties/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.setViewportSize(initial);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await returnLink(page).click();
  await expect(page.locator('details.source-disclosure')).not.toHaveAttribute('open', '');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
