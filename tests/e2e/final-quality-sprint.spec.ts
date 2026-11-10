import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  finalQualityNb as f,
  securityNb,
  computeNb,
  networkingNb,
  monitoringNb,
  serverlessNb,
  nb,
} from '../../src/content/nb';
import { sandboxKey } from '../../src/domain/sandbox/store';
import { computeFacts, computeKey, freshCompute } from '../../src/domain/curriculum/compute';
import {
  networkingFacts,
  networkingKey,
  freshNetworking,
} from '../../src/domain/curriculum/networking';

async function lesson(page: Page, module: string, topic: string) {
  await page.goto(`/learn/${module}?topic=${topic}`);
  await expect(page.locator('[data-activity-heading]').first()).toBeVisible();
}
async function begin(page: Page, region: string, label: string) {
  await page.locator(region).getByRole('button', { name: label, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', {
      name: serverlessNb.start,
      exact: true,
    })
    .click();
}
async function run(page: Page, label: string, prediction: string, button: string) {
  await page.getByRole('combobox', { name: label, exact: true }).selectOption(prediction);
  await page.getByRole('button', { name: button, exact: true }).click();
}
const technical = (page: Page) => page.evaluate((key) => localStorage.getItem(key), sandboxKey);

test('final quality current Storage orientation and named build disclosure preserve Journal and keyboard access', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/learn');
  await page.locator('.learn-hub-module[data-module="storage"]').getByRole('link').click();
  await expect(page.getByText(f.storageAvailable, { exact: true })).toBeVisible();
  const before = await technical(page);
  await lesson(page, 'storage', 'summary');
  await expect(page.locator('.storage-summary')).toContainText(f.storageAvailable);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(f.storageAvailable);
  await page.getByRole('dialog').press('Escape');
  await expect(page.getByRole('button', { name: nb.course.journal, exact: true })).toBeFocused();
  await page.setViewportSize({ width: 1024, height: 500 });
  const build = page.locator('.course-build');
  await build.locator('summary').focus();
  await build.locator('summary').press('Enter');
  await expect(build).toHaveAttribute('open', '');
  await expect(
    page.getByRole('complementary', { name: nb.foundationsV2.build, exact: true }),
  ).toContainText(nb.foundationsV2.build);
  expect((await new AxeBuilder({ page }).withRules(['region']).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: info.outputPath('storage-summary-build-1024.png'),
    fullPage: true,
  });
  expect(await technical(page)).toBe(before);
});

test('final quality current Compute and Cost summaries retain canonical Next Back Forward and reload without technical writes', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1024, height: 500 });
  await lesson(page, 'compute', 'summary');
  const before = await technical(page);
  await expect(page.locator('.compute-summary')).toContainText(f.computeAvailable);
  await lesson(page, 'cost', 'summary');
  await expect(page.locator('.cost-summary')).not.toContainText('fortsatt planlagt');
  await expect(page.locator('.course-nav-next a')).toHaveAttribute(
    'href',
    '/learn/governance?topic=introduction',
  );
  await page.screenshot({ path: info.outputPath('cost-summary-1024.png'), fullPage: true });
  await page.locator('.course-nav-next a').click();
  await expect(page).toHaveURL(/\/governance\?topic=introduction$/);
  await page.goBack({ waitUntil: 'commit' });
  await expect(page).toHaveURL(/\/cost\?topic=summary$/);
  await page.goForward({ waitUntil: 'commit' });
  await expect(page).toHaveURL(/\/governance\?topic=introduction$/);
  await page.goBack({ waitUntil: 'commit' });
  await expect(page).toHaveURL(/\/cost\?topic=summary$/);
  await page.reload();
  await expect(page.locator('.course-nav-next a')).toHaveAttribute(
    'href',
    '/learn/governance?topic=introduction',
  );
  expect(await technical(page)).toBe(before);
});

test('final quality security and monitoring display copy headings and Journal retain original numeric premises', async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await lesson(page, 'security', 'zero-trust');
  await expect(page.getByText(f.security.zeroTrust, { exact: true })).toBeVisible();
  await lesson(page, 'security', 'posture');
  await expect(page.getByText(f.security.posture, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(f.security.introductionLimit);
  await expect(page.getByRole('dialog')).not.toContainText('P10/P11');
  await expect(page.getByRole('dialog')).toContainText(
    securityNb.sections['zero-trust'].paragraphs[0],
  );
  await page.getByRole('dialog').press('Escape');
  await lesson(page, 'monitoring', 'signals');
  await expect(page.getByText(f.monitoring.signalsExample, { exact: true })).toBeVisible();
  const before = await technical(page);
  await page.goto('/learn/monitoring?topic=studio&perspective=telemetry');
  await begin(page, '.monitoring-workbench', monitoringNb.labels.begin);
  await expect(page.getByText(f.monitoring.telemetryStep, { exact: true }).first()).toBeVisible();
  for (const name of [
    monitoringNb.visual.metricControls,
    monitoringNb.visual.alertControls,
    monitoringNb.visual.logControls,
  ])
    await expect(page.getByRole('heading', { name, level: 4, exact: true })).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: info.outputPath('monitoring-1440.png'), fullPage: true });
  await page.setViewportSize({ width: 1024, height: 500 });
  await page
    .getByRole('heading', { name: monitoringNb.visual.metricControls, exact: true })
    .scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath('monitoring-1024.png'), fullPage: true });
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(f.monitoring.signalsExample);
  await expect(page.getByRole('dialog')).toContainText(f.monitoring.logs);
  await page.getByRole('dialog').press('Escape');
  expect(await technical(page)).toBe(before);
});

test('final quality actual peering and AVD runs explain selected failed premises without assessment or technical credit', async ({
  page,
}, info) => {
  await lesson(page, 'networking', 'peering');
  const before = await technical(page);
  await begin(page, '.compute-workbench', networkingNb.labels.begin);
  await run(page, networkingNb.labels.predict, '0', networkingNb.labels.run);
  await expect(page.locator('.network-verdict')).toContainText(networkingNb.model.peeringMissing);
  for (const name of ['A → C', 'C → A'])
    await page.getByRole('checkbox', { name, exact: true }).check();
  await page.getByRole('checkbox', { name: networkingNb.model.overlapToggle, exact: true }).check();
  await page
    .getByRole('combobox', { name: networkingNb.model.destination, exact: true })
    .selectOption('b');
  await run(page, networkingNb.labels.predict, '0', networkingNb.labels.run);
  await expect(page.locator('.network-verdict')).toHaveText(f.peering.overlap);
  await expect(page.locator('.network-result')).toContainText(
    networkingNb.model.statuses.connected,
  );
  await page.screenshot({ path: info.outputPath('peering-overlap-1440.png'), fullPage: true });
  await page.reload();
  await expect(page.locator('.network-verdict')).toHaveText(f.peering.overlap);
  await lesson(page, 'compute', 'desktop');
  await begin(page, '.compute-workbench', computeNb.labels.begin);
  await page.getByLabel(computeNb.models.desktop.hosts, { exact: true }).fill('0');
  await run(page, computeNb.labels.predict, '1', computeNb.labels.run);
  await expect(page.locator('.compute-result-summary')).toContainText(f.avdPredictions[2]);
  await expect(page.getByText(computeNb.models.desktop.noHost, { exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath('avd-zero-hosts-1440.png'), fullPage: true });
  const facts = await page.evaluate(
    ({ ck, nk }) => ({ compute: localStorage.getItem(ck), network: localStorage.getItem(nk) }),
    { ck: computeKey, nk: networkingKey },
  );
  expect(
    computeFacts(facts.compute ? JSON.parse(facts.compute) : freshCompute()).firsts,
  ).toHaveLength(0);
  expect(
    networkingFacts(facts.network ? JSON.parse(facts.network) : freshNetworking()).firsts,
  ).toHaveLength(0);
  expect(await technical(page)).toBe(before);
});
