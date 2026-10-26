import { test, expect, type Page, type TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb, labsNb as t, learningPolishNb as polish } from '../../src/content/nb';
import { freshServices, applyModuleEvent } from '../../src/domain/portal/learning';
import { fresh as freshExpansion } from '../../src/domain/curriculum/expansion';
import { applyEvent, freshAttempt } from '../../src/domain/chapter01/scenario';
import { snapshotOf } from '../../src/domain/chapter01/persistence';
const p = nb.portal;
test.use({ trace: 'on', video: 'on', actionTimeout: 15000 });
test.setTimeout(180000);
test('current lab entry preserves genuine v1 records and imports the validated technical prefix without archive return', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Desktop legacy migration review.');
  const oldLearning = JSON.stringify(
    applyModuleEvent(freshServices(), { kind: 'compare', model: 'iaas' }),
  );
  const oldChapter = JSON.stringify(
    snapshotOf(
      applyEvent(freshAttempt(), {
        kind: 'command',
        bindResult: false,
        request: {
          commandId: 'old-group',
          expectedWorldRevision: 0,
          command: {
            type: 'CreateGroup',
            subscriptionId: 'sub-shared',
            metadataRegion: 'norwayeast',
            name: 'rg-preserved',
          },
        },
      })!,
      1,
      4,
    ),
  );
  const selected = freshExpansion('services');
  selected.events.push({ kind: 'choose', version: 'v1' });
  await page.addInitScript(
    ({ oldLearning, oldChapter, selected }) => {
      for (const [key, value] of Object.entries({
        'azurelab.portal.learning.v1': oldLearning,
        'azurelab.chapter01.guided.v1': oldChapter,
        'azurelab.learning.service-types.v2': selected,
      }))
        if (!localStorage.getItem(key)) localStorage.setItem(key, value);
    },
    { oldLearning, oldChapter, selected: JSON.stringify(selected) },
  );
  await page.goto('/');
  await page.getByRole('link', { name: t.models.iaas + ' · ' + t.title, exact: true }).click();
  await expect(page.locator('.practical-entry')).toBeVisible();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.launch, exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(polish.briefing.eyebrow);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  await area(page, 'groups');
  await expect(page.locator('table')).toContainText('rg-preserved');
  await page
    .locator('.portal-training-strip')
    .getByRole('link', { name: nb.course.returnCourse, exact: true })
    .click();
  await expect(page).toHaveURL(/version=2/);
  await page.reload();
  await expect(
    page.locator('.practical-entry').getByRole('link', { name: t.resume, exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('azurelab.portal.learning.v1'))).toBe(
    oldLearning,
  );
  expect(await page.evaluate(() => localStorage.getItem('azurelab.chapter01.guided.v1'))).toBe(
    oldChapter,
  );
  await expect(page.locator('.practical-entry')).not.toContainText(t.complete);
});
async function shot(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`321-${name}.png`), scale: 'css' });
}
async function desktopEvidence(page: Page, info: TestInfo, name: string) {
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    if (name !== 'vm-basics')
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    if (name === 'vm-basics') {
      await page.locator('[data-guide="vm-profile"]').scrollIntoViewIfNeeded();
      await expect
        .poll(async () => {
          const target = await page.locator('[data-guide="vm-profile"]').boundingBox(),
            ring = await page.locator('.guide-target-ring').boundingBox();
          return target && ring
            ? Math.abs(target.x - 4 - ring.x) + Math.abs(target.y - 4 - ring.y)
            : Infinity;
        })
        .toBeLessThan(3);
    }
    await shot(page, info, `${name}-${viewport.width}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.setViewportSize({ width: 1920, height: 1080 });
}
async function area(page: Page, name: keyof typeof p.areas) {
  await page
    .getByRole('navigation', { name: p.navLabel })
    .getByRole('link', { name: p.areas[name], exact: true })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas[name]);
}
async function create(page: Page, kind: 'group' | 'plan' | 'app', name: string) {
  await area(page, kind === 'group' ? 'groups' : kind === 'plan' ? 'plans' : 'apps');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page.getByLabel(kind === 'group' ? p.groupName : p.name, { exact: true }).fill(name);
  if (kind === 'group')
    await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('norwayeast');
  if (kind === 'app') await page.locator('[data-guide="plan"]').selectOption({ index: 1 });
  if (kind === 'plan')
    await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('westeurope');
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  await page.locator('[data-guide="commit"]').click();
  await expect(page).toHaveURL(/area=resource/);
}
async function inspect(page: Page) {
  await page.getByRole('button', { name: t.inspect, exact: true }).click();
}
test('root course to persisted VM, app settings, separate SaaS, exact debrief and resume', async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== 'desktop-chromium',
    'Desktop-first new lab walkthrough; baseline narrow regressions retained.',
  );
  await page.setViewportSize({ width: 1920, height: 1080 });
  const errors: string[] = [],
    external: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== new URL(info.project.use.baseURL!).origin)
      external.push(r.url());
  });
  await page.goto('/');
  await desktopEvidence(page, info, 'course-root');
  await page
    .getByRole('link', { name: `${nb.course.open}: ${nb.official.services}`, exact: true })
    .click();
  await page.locator('.course-navigation a[href="/learn/services?topic=iaas"]').click();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.launch, exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(polish.briefing.eyebrow);
  await shot(page, info, 'mission-vm');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  await expect(page.locator('.practical-coach')).toBeVisible();
  await expect(page.locator('.practical-outcome')).toHaveCount(0);
  await page.getByRole('searchbox', { name: p.search, exact: true }).fill('Resource groups');
  await page
    .locator('.portal-search-results a')
    .filter({ hasText: p.areas.groups })
    .first()
    .click();
  await create(page, 'group', 'rg-operational-dev');
  await area(page, 'vms');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page.getByLabel(t.vm.name, { exact: true }).fill('BAD');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Review + create', exact: true })
    .click();
  await expect(page.locator('[data-guide="commit"]')).toBeDisabled();
  await expect(page.locator('.guide-target-ring')).toHaveAttribute('data-kind', 'inspection');
  await shot(page, info, 'vm-invalid-review');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Basics', exact: true })
    .click();
  await page.getByLabel(t.vm.name, { exact: true }).fill('vm-first');
  await desktopEvidence(page, info, 'vm-basics');
  await page.getByRole('combobox', { name: t.vm.profile, exact: true }).focus();
  await page.keyboard.press('ArrowDown');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Disks', exact: true })
    .click();
  await page.getByRole('combobox', { name: t.vm.dataDisk, exact: true }).selectOption('32');
  await shot(page, info, 'vm-disks');
  await expect(page.locator('.practical-coach')).toHaveAttribute('data-phase', 'disks');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Networking', exact: true })
    .click();
  await shot(page, info, 'vm-network');
  await expect(page.locator('.practical-coach')).toHaveAttribute('data-phase', 'network');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Review + create', exact: true })
    .click();
  await expect(page.locator('[data-guide="validation"]')).toContainText(t.vm.reviewValid);
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('azurelab.sandbox.v2')!).commands.some(
        (r: { command: { type: string } }) => r.command.type === 'CreateVmBundle',
      ),
    ),
  ).toBe(false);
  await page.locator('[data-guide="commit"]').click();
  await expect(page.locator('.portal-title h1')).toHaveText('vm-first');
  await page.getByRole('button', { name: t.receipt, exact: true }).click();
  await expect(page.locator('.chapter-receipt')).toHaveAttribute('data-outcome', 'accepted');
  await expect(page.locator('.chapter-receipt')).toContainText('vm-profile@2');
  await shot(page, info, 'vm-receipt');
  await page.getByRole('button', { name: p.viewResource, exact: true }).click();
  await inspect(page);
  await page
    .locator('.portal-infrastructure')
    .getByRole('button', { name: 'vm-first-os', exact: true })
    .click();
  await inspect(page);
  await area(page, 'vms');
  await page.getByRole('button', { name: 'vm-first', exact: true }).click();
  await page
    .locator('.portal-infrastructure')
    .getByRole('button', { name: 'vm-first-nic', exact: true })
    .click();
  await inspect(page);
  await shot(page, info, 'vm-nic');
  await area(page, 'architecture');
  await expect(page.locator('.react-flow__node')).toHaveCount(10);
  await shot(page, info, 'live-diagram');
  await page.getByRole('button', { name: p.graph.list, exact: true }).click();
  await expect(page.locator('.portal-architecture')).toContainText('vm-first-os');
  await shot(page, info, 'vm-architecture');
  await page
    .locator('.practical-outcome')
    .getByRole('radio', { name: t.reasons.vm[0][1], exact: true })
    .check();
  await page
    .locator('.practical-outcome')
    .getByRole('button', { name: t.submit, exact: true })
    .click();
  await page
    .locator('.practical-outcome')
    .getByRole('link', { name: t.return, exact: true })
    .click();
  await expect(page).toHaveURL(/topic=iaas&activity=practical/);
  await expect(page.locator('.practical-entry')).toBeFocused();
  await expect(page.locator('.practical-entry h3')).toBeInViewport();
  await expect(page.locator('.practical-entry')).toContainText(t.complete);
  await page.reload();
  await expect(page.locator('.practical-entry')).toBeFocused();
  await expect(page.locator('.practical-entry h3')).toBeInViewport();
  await expect(page.locator('.practical-entry')).toContainText(t.complete);
  await shot(page, info, 'vm-debrief');
  await page.locator('.course-navigation a[href^="/learn/services?topic=paas"]').click();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.launch, exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(polish.briefing.eyebrow);
  await shot(page, info, 'mission-paas');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  const prerequisiteExit = page.getByRole('link', { name: nb.course.leaveLab, exact: true });
  await expect(prerequisiteExit).toHaveAttribute('href', /topic=paas&activity=practical&version=2/);
  await prerequisiteExit.click();
  await expect(page).toHaveURL(/topic=paas&activity=practical&version=2/);
  await page.locator('.practical-entry').getByRole('link', { name: t.resume, exact: true }).click();
  await area(page, 'plans');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page.getByRole('textbox', { name: p.name, exact: true }).fill('plan-denied');
  await page.getByRole('combobox', { name: p.region, exact: true }).selectOption('northeurope');
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  await page.locator('[data-guide="commit"]').click();
  await expect(page.locator('.chapter-receipt')).toHaveAttribute('data-outcome', 'rejected');
  await shot(page, info, 'paas-policy-rejected');
  await page.getByRole('button', { name: nb.chapter.showPolicy, exact: true }).click();
  await expect(page.locator('.portal-view')).toContainText('policy-web-location');
  await shot(page, info, 'paas-policy-inspected');
  await create(page, 'plan', 'plan-operational');
  await create(page, 'app', 'app-operational');
  await area(page, 'architecture');
  await page.getByRole('button', { name: p.graph.list, exact: true }).click();
  await page
    .locator('.portal-relation-list')
    .getByRole('button', { name: /app-operational → plan-operational/ })
    .click();
  await expect(page.locator('.practical-coach')).toBeVisible();
  await area(page, 'apps');
  await page.getByRole('button', { name: 'app-operational', exact: true }).click();
  await page.getByRole('button', { name: t.settings.title, exact: true }).click();
  await page
    .getByRole('combobox', { name: t.settings.environment, exact: true })
    .selectOption('staging');
  await page
    .getByRole('combobox', { name: t.settings.catalog, exact: true })
    .selectOption('read-only');
  await desktopEvidence(page, info, 'app-settings');
  await page.getByRole('button', { name: t.settings.apply, exact: true }).click();
  await expect(page.locator('.portal-infrastructure')).toContainText('staging');
  await inspect(page);
  await page.reload();
  await expect(page.locator('.portal-infrastructure')).toContainText('read-only');
  await page
    .locator('.practical-outcome')
    .getByRole('radio', { name: t.reasons.paas[0][1], exact: true })
    .check();
  await page
    .locator('.practical-outcome')
    .getByRole('button', { name: t.submit, exact: true })
    .click();
  await expect(page.locator('.practical-outcome')).toContainText(t.complete);
  await page
    .locator('.practical-outcome')
    .getByRole('link', { name: t.return, exact: true })
    .click();
  await expect(page).toHaveURL(/topic=paas&activity=practical/);
  await page.locator('.course-navigation a[href^="/learn/services?topic=saas"]').click();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.launch, exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(polish.briefing.eyebrow);
  await shot(page, info, 'mission-saas');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Mina', exact: true })).toBeVisible();
  await page.locator('.saas-navigation').getByRole('button', { name: /Erin/ }).click();
  await page.getByRole('button', { name: t.saas.assign, exact: true }).click();
  await expect(page.locator('.saas-receipt')).toContainText(t.saas.reasons['seats-full']);
  await shot(page, info, 'saas-rejected');
  await page.locator('.saas-navigation').getByRole('button', { name: /Mina/ }).click();
  await page.getByRole('button', { name: t.saas.release, exact: true }).click();
  await page.getByRole('button', { name: t.saas.block, exact: true }).click();
  await page.getByRole('combobox', { name: t.saas.role, exact: true }).selectOption('member');
  await page.getByRole('button', { name: t.saas.saveRole, exact: true }).click();
  await page.getByRole('combobox', { name: t.saas.sharing, exact: true }).selectOption('team');
  await page.getByRole('button', { name: t.saas.saveSharing, exact: true }).click();
  await page.getByRole('button', { name: t.saas.review, exact: true }).click();
  await page.locator('.saas-navigation').getByRole('button', { name: /Erin/ }).click();
  await page.getByRole('button', { name: t.saas.assign, exact: true }).click();
  await page
    .locator('.saas-navigation')
    .getByRole('button', { name: t.history, exact: true })
    .click();
  await inspect(page);
  await desktopEvidence(page, info, 'saas-history');
  await page.getByRole('radio', { name: t.reasons.saas[0][1], exact: true }).check();
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  await expect(page.locator('.practical-outcome')).toContainText(t.complete);
  const violations = (await new AxeBuilder({ page }).analyze()).violations;
  expect(violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }))).toEqual([]);
  await page
    .locator('.practical-outcome')
    .getByRole('link', { name: t.return, exact: true })
    .click();
  await expect(page).toHaveURL(/topic=saas&activity=practical/);
  await page.reload();
  await expect(page.locator('.practical-entry')).toBeFocused();
  await expect(page.locator('.practical-entry h3')).toBeInViewport();
  await expect(page.locator('.practical-entry')).toContainText(t.complete);
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.locator('.practical-entry').scrollIntoViewIfNeeded();
    await shot(page, info, `debrief-${viewport.width}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  const priorDeliveries = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem('azurelab.practical-labs.v1')!).events.filter(
        (e: { type: string }) => e.type === 'submit',
      ).length,
  );
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.launch, exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(polish.briefing.eyebrow);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  await expect(page.locator('.saas-learning')).toHaveAttribute('data-step', 'saas-replay');
  await expect(page.locator('.saas-learning')).toContainText(t.saas.replay);
  await page.getByRole('button', { name: t.saas.reset, exact: true }).click();
  await page.getByRole('button', { name: t.saas.confirmReset, exact: true }).click();
  await expect(page.locator('.saas-learning')).toHaveAttribute('data-step', 'saas-capacity');
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem('azurelab.practical-labs.v1')!).events.filter(
          (e: { type: string }) => e.type === 'submit',
        ).length,
    ),
  ).toBe(priorDeliveries);
  await page.locator('.saas-header').getByRole('link', { name: t.return, exact: true }).click();
  await page.goto('/learn/benefits?topic=governance');
  const bridge = page.locator('.benefits-lab-bridge');
  await bridge.getByRole('button', { name: t.bridge.open, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  await expect(page.locator('.portal-view')).toContainText('policy-web-location');
  await expect(page).toHaveURL(/bridge=governance/);
  await shot(page, info, 'benefits-real-policy');
  await page
    .locator('.portal-training-strip')
    .getByRole('link', { name: nb.course.returnCourse, exact: true })
    .click();
  await expect(page).toHaveURL(/learn\/benefits\?topic=governance&activity=practical/);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('independent VM uses changed requirements, preserves first delivery and classifies explicit help', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'New interaction is desktop-first.');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: t.models.iaas + ' · ' + t.title, exact: true }).click();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.challenge, exact: true })
    .click();
  await expect(page.locator('.portal-independent-practical')).toContainText(t.lab.vm.changed);
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await expect(page.locator('.practical-criteria')).toHaveCount(0);
  await create(page, 'group', 'rg-independent');
  // The scenario requires Shared Sandbox; valid App Sandbox work must not falsely pass it.
  await area(page, 'groups');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.createTitles.group);
  await page
    .getByRole('combobox', { name: p.subscription, exact: true })
    .selectOption('sub-shared');
  await page.getByRole('textbox', { name: p.groupName, exact: true }).fill('rg-shared');
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  await page.locator('[data-guide="commit"]').click();
  await area(page, 'vms');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.createTitles.vm);
  await page
    .getByRole('combobox', { name: p.subscription, exact: true })
    .selectOption('sub-shared');
  await page
    .getByRole('combobox', { name: p.group, exact: true })
    .selectOption({ label: 'rg-shared' });
  await page.getByRole('textbox', { name: t.vm.name, exact: true }).fill('vm-independent');
  await page.getByRole('combobox', { name: t.vm.image, exact: true }).selectOption('windows-2022');
  await page.getByRole('combobox', { name: t.vm.profile, exact: true }).selectOption('standard');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Disks', exact: true })
    .click();
  await page.getByRole('combobox', { name: t.vm.dataDisk, exact: true }).selectOption('64');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Review + create', exact: true })
    .click();
  await page.locator('[data-guide="commit"]').click();
  const technicalSnapshot = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('azurelab.sandbox.v2')!),
  );
  await info.attach('independent-command-snapshot', {
    body: JSON.stringify(technicalSnapshot.commands, null, 2),
    contentType: 'application/json',
  });
  expect(technicalSnapshot.commands[1].command.subscriptionId).toBe('sub-shared');
  expect(technicalSnapshot.commands.at(-1).command).toMatchObject({
    image: 'windows-2022',
    profile: 'standard',
    dataDiskGiB: '64',
  });
  await inspect(page);
  await page
    .locator('.portal-infrastructure')
    .getByRole('button', { name: 'vm-independent-os', exact: true })
    .click();
  await inspect(page);
  await area(page, 'vms');
  await page.getByRole('button', { name: 'vm-independent', exact: true }).click();
  await page
    .locator('.portal-infrastructure')
    .getByRole('button', { name: 'vm-independent-nic', exact: true })
    .click();
  await inspect(page);
  await page.getByRole('radio', { name: t.reasons.vm[0][1], exact: true }).check();
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  await expect(page.locator('.practical-outcome')).toContainText(t.independentResult);
  await shot(page, info, 'independent-vm');
  await page
    .locator('.practical-outcome')
    .getByRole('link', { name: t.return, exact: true })
    .click();
  await expect(page.locator('.practical-entry')).toContainText(t.unaided);
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.challenge, exact: true })
    .click();
  await expect(page.locator('.portal-independent-practical')).toBeVisible();
  await page.getByRole('button', { name: t.hint, exact: true }).click();
  await expect(page.locator('.portal-independent-practical')).toContainText(t.lab.vm.changed);
  await page.getByRole('radio', { name: t.reasons.vm[0][1], exact: true }).check();
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  // Prior resources predate this retry boundary, so they cannot satisfy it.
  await expect(page.locator('.practical-outcome')).toContainText(t.wrong);
  await page
    .locator('.practical-outcome')
    .getByRole('link', { name: t.return, exact: true })
    .click();
  await expect(page.locator('.practical-entry')).toContainText(t.aided);
  const legacyKeys = [
    'azurelab.learning.foundations.v1',
    'azurelab.portal.learning.v1',
    'azurelab.progress.v1',
    'azurelab.chapter01.guided.v1',
  ];
  expect(
    await page.evaluate((keys) => keys.map((k) => localStorage.getItem(k)), legacyKeys),
  ).toEqual([null, null, null, null]);
});

test('changed PaaS and SaaS tasks assess actual new operations without coach highlights', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Desktop-first operational tasks.');
  await page.goto('/');
  await page.getByRole('link', { name: t.models.paas + ' · ' + t.title, exact: true }).click();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.challenge, exact: true })
    .click();
  await expect(page.locator('.portal-independent-practical')).toBeVisible();
  await create(page, 'group', 'rg-paas-task');
  await create(page, 'plan', 'plan-task');
  await create(page, 'app', 'app-task');
  await page.getByRole('button', { name: t.settings.title, exact: true }).click();
  await page
    .getByRole('combobox', { name: t.settings.environment, exact: true })
    .selectOption('production');
  await page
    .getByRole('combobox', { name: t.settings.catalog, exact: true })
    .selectOption('read-only');
  await page.getByRole('button', { name: t.settings.apply, exact: true }).click();
  await inspect(page);
  await expect(page.locator('.guide-target-ring')).toHaveCount(0);
  await expect(page.locator('.practical-criteria')).toHaveCount(0);
  await page.getByRole('radio', { name: t.reasons.paas[0][1], exact: true }).check();
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  await expect(page.locator('.practical-outcome')).toContainText(t.independentResult);
  await page
    .locator('.practical-outcome')
    .getByRole('link', { name: t.return, exact: true })
    .click();
  await expect(page.locator('.practical-entry')).toContainText(t.unaided);
  await page.locator('.course-navigation a[href^="/learn/services?topic=saas"]').click();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.challenge, exact: true })
    .click();
  await expect(page.locator('.saas-layout')).toBeVisible();
  await page.locator('.saas-navigation').getByRole('button', { name: /Leo/ }).click();
  await page.getByRole('button', { name: t.saas.block, exact: true }).click();
  await page.getByRole('button', { name: t.saas.release, exact: true }).click();
  await page.getByRole('combobox', { name: t.saas.role, exact: true }).selectOption('member');
  await page.getByRole('button', { name: t.saas.saveRole, exact: true }).click();
  await page.getByRole('combobox', { name: t.saas.sharing, exact: true }).selectOption('team');
  await page.getByRole('button', { name: t.saas.saveSharing, exact: true }).click();
  await page.getByRole('button', { name: t.saas.review, exact: true }).click();
  await page
    .locator('.saas-navigation')
    .getByRole('button', { name: t.history, exact: true })
    .click();
  await inspect(page);
  await expect(page.locator('.practical-criteria')).toHaveCount(0);
  await page.getByRole('radio', { name: t.reasons.saas[0][1], exact: true }).check();
  await page.getByRole('button', { name: t.submit, exact: true }).click();
  await expect(page.locator('.practical-outcome')).toContainText(t.independentResult);
  await page.reload();
  await expect(page.locator('.practical-outcome')).toContainText(t.independentResult);
  await page
    .locator('.practical-outcome')
    .getByRole('link', { name: t.return, exact: true })
    .click();
  await expect(page.locator('.practical-entry')).toContainText(t.unaided);
});

test('explicit SaaS and Portal reset rebind guided sessions and retain abandoned attempts', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'Desktop reset and resume contract.');
  await page.goto('/');
  await page.getByRole('link', { name: t.models.saas + ' · ' + t.title, exact: true }).click();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.launch, exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(polish.briefing.eyebrow);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  await expect(page.locator('.saas-learning')).toHaveAttribute('data-step', 'saas-capacity');
  await page.locator('.saas-navigation').getByRole('button', { name: /Erin/ }).click();
  await page.getByRole('button', { name: t.saas.assign, exact: true }).click();
  await expect(page.locator('.saas-learning')).toHaveAttribute('data-step', 'saas-release');
  await page.getByRole('button', { name: t.saas.reset, exact: true }).click();
  await page.getByRole('button', { name: t.saas.confirmReset, exact: true }).click();
  await expect(page.locator('.saas-learning')).toHaveAttribute('data-step', 'saas-capacity');
  await page.reload();
  await expect(page.locator('.saas-learning')).toHaveAttribute('data-step', 'saas-capacity');
  await page.locator('.saas-learning').getByRole('link', { name: t.return, exact: true }).click();
  await expect(page.locator('.practical-entry')).toContainText(t.pending);
  await page.locator('.practical-entry').getByText(t.attempts, { exact: true }).click();
  await expect(page.locator('.practical-entry')).toContainText(t.cancelled);
  await page.getByRole('link', { name: nb.course.overview, exact: true }).first().click();
  await page.getByRole('link', { name: t.models.iaas + ' · ' + t.title, exact: true }).click();
  await page
    .locator('.practical-entry')
    .getByRole('button', { name: t.launch, exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(polish.briefing.eyebrow);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: polish.briefing.start, exact: true })
    .click();
  await expect(page.locator('.practical-coach')).toBeVisible();
  await page.getByRole('button', { name: p.limitations, exact: true }).click();
  await page.getByRole('button', { name: p.resetTechnical, exact: true }).click();
  await page.getByRole('button', { name: p.confirmReset, exact: true }).click();
  await expect(page.locator('.practical-coach')).toBeVisible();
  await page.reload();
  await expect(page.locator('.practical-coach')).not.toContainText(t.unverifiable);
  await page
    .locator('.portal-training-strip')
    .getByRole('link', { name: nb.course.returnCourse, exact: true })
    .click();
  await expect(
    page.locator('.practical-entry').getByRole('link', { name: t.resume, exact: true }),
  ).toBeVisible();
});
