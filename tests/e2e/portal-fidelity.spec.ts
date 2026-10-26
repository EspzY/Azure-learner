import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, labsNb, learningPolishNb } from '../../src/content/nb';
import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import { revealPortalLink, editAppSetting } from './portal-actions';

const p = nb.portal,
  ui = nb.portalUi;
test.use({ trace: 'on', video: 'on' });
test.setTimeout(120000);
function fixture() {
  const saved = new Map<string, string>();
  const store = new SandboxStore({
    getItem: (k) => saved.get(k) ?? null,
    setItem: (k, v) => {
      saved.set(k, v);
    },
    removeItem: (k) => {
      saved.delete(k);
    },
  });
  store.load();
  const send = (command: Record<string, string>) => {
    const e = store.getSnapshot().attempt.engine;
    expect(
      store.dispatch({
        kind: 'command',
        request: {
          commandId: `fixture-${e.ledger.length}`,
          expectedWorldRevision: e.world.revision,
          command,
        },
      }),
    ).toBe(true);
    return store.getSnapshot().attempt.engine;
  };
  send({
    type: 'CreateGroup',
    name: 'rg-fidelity-dev',
    subscriptionId: 'sub-app',
    metadataRegion: 'norwayeast',
  });
  send({
    type: 'CreateGroup',
    name: 'rg-second-dev',
    subscriptionId: 'sub-shared',
    metadataRegion: 'norwayeast',
  });
  send({
    type: 'CreatePlan',
    groupId: 'group-1',
    name: 'plan-denied',
    region: 'northeurope',
    profile: 'linux-learning-v1',
  });
  const planned = send({
    type: 'CreatePlan',
    groupId: 'group-1',
    name: 'plan-fidelity',
    region: 'westeurope',
    profile: 'linux-learning-v1',
  });
  const planId = planned.world.resources[0]!.id;
  send({ type: 'CreateWebApp', groupId: 'group-1', name: 'app-fidelity', planId });
  send({
    type: 'CreateVmBundle',
    groupId: 'group-1',
    name: 'vm-fidelity',
    region: 'northeurope',
    image: 'ubuntu-22-04',
    profile: 'small',
    dataDiskGiB: '32',
    subnetId: '',
  });
  return saved.get(sandboxKey)!;
}
async function area(page: Page, name: keyof typeof p.areas) {
  const link = page
    .getByRole('navigation', { name: p.navLabel, exact: true })
    .getByRole('link', { name: p.areas[name], exact: true });
  await revealPortalLink(page, link);
  await link.click();
  await expect(page.locator('h1')).toHaveText(p.areas[name]);
}
async function audit(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
}
for (const [width, height] of [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1024, 768],
]) {
  test(`Portal fidelity ${width}: shared shell, real lists, resource menu, forms, settings and notification inspection`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width: width!, height: height! });
    const errors: string[] = [],
      external: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('request', (r) => {
      if (new URL(r.url()).origin !== new URL(info.project.use.baseURL!).origin)
        external.push(r.url());
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: nb.course.title, exact: true })).toBeVisible();
    await page.evaluate((raw) => localStorage.setItem('azurelab.sandbox.v2', raw), fixture());
    await page.getByRole('link', { name: nb.course.sandbox, exact: true }).click();
    await expect(page.locator('.portal-home-services')).toBeVisible();
    await expect(page.locator('.portal-home-training')).toHaveCount(0);
    expect(
      await page.locator('.portal-header').evaluate((el) => el.getBoundingClientRect().height),
    ).toBe(40);
    await expect(page.locator('[data-icon-missing]')).toHaveCount(0);
    await expect(page.locator('.portal-home-services [data-icon="vms"]')).toHaveAttribute(
      'src',
      /10021-icon-service-Virtual-Machine.svg$/,
    );
    await expect(page.locator('.portal-home-services [data-icon="groups"]')).toHaveAttribute(
      'src',
      /10007-icon-service-Resource-Groups.svg$/,
    );
    expect(
      await page
        .locator('img[data-icon-source="azure"]')
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0 &&
              getComputedStyle(image).filter === 'none',
          ),
        ),
    ).toBe(true);
    await audit(page);
    await page.screenshot({ path: info.outputPath(`fidelity-${width}-home.png`), scale: 'css' });
    await area(page, 'services');
    await expect(page.locator('.portal-services-index [data-icon="vms"]')).toHaveAttribute(
      'src',
      /10021-icon-service-Virtual-Machine.svg$/,
    );
    expect(
      await page
        .locator('.portal-services-index [data-icon]')
        .evaluateAll((icons) => icons.every((icon) => icon.getBoundingClientRect().width <= 22)),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-services.png`),
      scale: 'css',
    });
    const search = page.getByRole('searchbox', { name: p.search, exact: true });
    await search.fill('Resource groups');
    await expect(page.locator('.portal-search-results [data-icon="groups"]')).toHaveAttribute(
      'src',
      /10007-icon-service-Resource-Groups.svg$/,
    );
    await search.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.locator('h1')).toHaveText(p.areas.groups);
    await expect(page.locator('tbody tr')).toHaveCount(2);
    await page.getByRole('columnheader', { name: /Name/ }).getByRole('button').click();
    await expect(page.getByRole('columnheader', { name: /Name/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    await page.screenshot({ path: info.outputPath(`fidelity-${width}-groups.png`), scale: 'css' });
    const savedBeforeInspection = await page.evaluate(
      (key) => localStorage.getItem(key),
      sandboxKey,
    );
    await page.getByRole('combobox', { name: ui.location, exact: true }).selectOption('norwayeast');
    await expect(page.locator('tbody tr')).toHaveCount(2);
    await page
      .locator('.portal-commandbar')
      .getByRole('button', { name: p.create, exact: true })
      .click();
    await expect(
      page.getByRole('heading', { name: ui.resourceDetails, exact: true }),
    ).toBeVisible();
    await expect(page.locator('.portal-commandbar')).toHaveCount(0);
    await expect(page.locator('.portal-create-footer .primary')).toHaveText(p.review);
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-group-create.png`),
      scale: 'css',
    });
    expect(await page.evaluate((key) => localStorage.getItem(key), sandboxKey)).toBe(
      savedBeforeInspection,
    );
    await area(page, 'vms');
    await page.screenshot({ path: info.outputPath(`fidelity-${width}-vms.png`), scale: 'css' });
    await page.getByRole('button', { name: 'vm-fidelity', exact: true }).click();
    await expect(
      page.locator('.portal-commandbar').getByRole('button', { name: p.create, exact: true }),
    ).toHaveCount(0);
    const menu = page.locator('.portal-resource-menu');
    await expect(page.locator('.portal-essentials')).toContainText('rg-fidelity-dev');
    await expect(page.locator('.portal-resource-main > .portal-commandbar')).toBeVisible();
    await expect(page.locator('.portal-resource-menu [data-icon="vm"]').first()).toHaveAttribute(
      'src',
      /10021-icon-service-Virtual-Machine.svg$/,
    );
    await audit(page);
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-vm-overview.png`),
      scale: 'css',
    });
    await menu.getByRole('button', { name: ui.disks, exact: true }).click();
    await expect(page.locator('.portal-related-details')).toContainText('vm-fidelity-os');
    await expect(page.locator('.portal-related-details')).not.toContainText('vm-fidelity-nic');
    await menu.getByRole('button', { name: ui.networking, exact: true }).click();
    await expect(page.locator('.portal-related-details')).toContainText('vm-fidelity-nic');
    await menu.getByRole('button', { name: ui.properties, exact: true }).click();
    await expect(page.locator('.portal-resource-main')).toContainText('ubuntu-22-04');
    await menu.getByRole('searchbox', { name: ui.resourceSearch, exact: true }).fill('Overview');
    await expect(menu.getByRole('button', { name: ui.properties, exact: true })).toHaveCount(0);
    await menu.getByRole('button', { name: p.overview, exact: true }).click();
    await area(page, 'vms');
    await page
      .locator('.portal-commandbar')
      .getByRole('button', { name: p.create, exact: true })
      .click();
    await page.getByRole('textbox', { name: labsNb.vm.name, exact: true }).fill('vm-new');
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-vm-create.png`),
      scale: 'css',
    });
    await audit(page);
    await area(page, 'plans');
    await page
      .locator('.portal-commandbar')
      .getByRole('button', { name: p.create, exact: true })
      .click();
    await expect(page.getByRole('heading', { name: ui.planDetails, exact: true })).toBeVisible();
    await expect(page.locator('.portal-title [data-icon="plan"]')).toHaveAttribute(
      'src',
      /00046-icon-service-App-Service-Plans.svg$/,
    );
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-plan-create.png`),
      scale: 'css',
    });
    await area(page, 'plans');
    await page.getByRole('button', { name: 'plan-fidelity', exact: true }).click();
    await expect(page.locator('h1')).toHaveText('plan-fidelity');
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-plan-overview.png`),
      scale: 'css',
    });
    await page
      .locator('.portal-commandbar')
      .getByRole('button', { name: p.create, exact: true })
      .click();
    await expect(
      page.getByRole('combobox', { name: p.plan, exact: true }).locator('option:checked'),
    ).toHaveText('plan-fidelity · West Europe');
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-app-create.png`),
      scale: 'css',
    });
    await area(page, 'apps');
    await page.screenshot({ path: info.outputPath(`fidelity-${width}-apps.png`), scale: 'css' });
    await page.getByRole('button', { name: 'app-fidelity', exact: true }).click();
    await expect(page.locator('h1')).toHaveText('app-fidelity');
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-app-overview.png`),
      scale: 'css',
    });
    await page
      .locator('.portal-resource-menu')
      .getByRole('button', { name: labsNb.settings.title, exact: true })
      .click();
    const before = await page.evaluate(() => localStorage.getItem('azurelab.sandbox.v2'));
    await expect(page.locator('.portal-app-settings tbody')).not.toContainText('development');
    await page.getByRole('button', { name: ui.show, exact: true }).click();
    await expect(page.locator('.portal-app-settings tbody')).toContainText('development');
    await page.getByRole('button', { name: ui.hideValues, exact: true }).click();
    expect(await page.evaluate((key) => localStorage.getItem(key), sandboxKey)).toBe(before);
    await editAppSetting(page, labsNb.settings.environment, 'staging');
    await editAppSetting(page, labsNb.settings.catalog, 'read-only');
    expect(await page.evaluate(() => localStorage.getItem('azurelab.sandbox.v2'))).toBe(before);
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-settings-draft.png`),
      scale: 'css',
    });
    await page.getByRole('button', { name: labsNb.settings.apply, exact: true }).click();
    await expect(page.locator('.portal-infrastructure')).toContainText('staging');
    await page.reload();
    await expect(page.locator('.portal-infrastructure')).toContainText('read-only');
    await page
      .locator('.portal-resource-menu')
      .getByRole('button', { name: labsNb.settings.title, exact: true })
      .click();
    await page
      .locator('.portal-resource-menu')
      .getByRole('button', { name: ui.properties, exact: true })
      .click();
    await expect(page.locator('.portal-resource-main')).toContainText(ui.localId);
    await expect(page.locator('.portal-resource-main')).toContainText('app-fidelity');
    await expect(page.locator('.portal-app-settings')).toHaveCount(0);
    if (width! > 1100) {
      expect(
        await page
          .locator('.portal-nav')
          .evaluate(
            (el) =>
              el.getBoundingClientRect().top >=
              document.querySelector('.portal-header')!.getBoundingClientRect().bottom,
          ),
      ).toBe(true);
    }
    await page.getByRole('button', { name: /Notifications/ }).click();
    await expect(page.locator('.portal-side-panel')).toBeVisible();
    await audit(page);
    await page.screenshot({
      path: info.outputPath(`fidelity-${width}-notifications.png`),
      scale: 'css',
    });
    await page.keyboard.press('Escape');
    await expect(page.locator('.portal-side-panel')).toHaveCount(0);
    await page.getByRole('button', { name: ui.appearance, exact: true }).click();
    await page.getByRole('radio', { name: ui.flyout, exact: true }).check();
    await page.keyboard.press('Escape');
    await expect(page.locator('.portal-nav')).not.toBeVisible();
    await expect(page.locator('[data-icon-missing]')).toHaveCount(0);
    await page.getByRole('button', { name: p.menu, exact: true }).click();
    await expect(page.locator('.portal-nav')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.portal-nav')).not.toBeVisible();
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  });
}
test('guided coach minimization restores the actual operational workspace without losing the mission', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page
    .getByRole('link', { name: labsNb.models.iaas + ' · ' + labsNb.title, exact: true })
    .click();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: labsNb.launch, exact: true })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: learningPolishNb.briefing.start, exact: true })
    .click();
  const coach = page.locator('.practical-coach');
  await expect(coach).toBeVisible();
  const before = await page
    .locator('.portal-view')
    .evaluateAll((nodes) => getComputedStyle(nodes[0]!).paddingRight);
  await coach.getByRole('button', { name: nb.course.minimize, exact: true }).click();
  expect(
    await page
      .locator('.portal-view')
      .evaluateAll((nodes) => getComputedStyle(nodes[0]!).paddingRight),
  ).toBe('0px');
  expect(before).not.toBe('0px');
  await coach.getByRole('button', { name: nb.course.expand, exact: true }).click();
  await coach.getByRole('button', { name: learningPolishNb.briefing.recall, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(learningPolishNb.briefing.vm.title);
  await page.keyboard.press('Escape');
  await expect(coach).toBeVisible();
});
