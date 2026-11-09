import { expect, type Page } from '@playwright/test';
import { nb, landingNb as t, laboratoryV3Nb as c } from '../../src/content/nb';
import { laboratoryEphemeralNb as temp } from '../../src/content/laboratory-ephemeral-nb';
import { laboratoryNetworkNb as n } from '../../src/content/laboratory-networking-nb';
import { laboratoryRoutingNb as r } from '../../src/content/laboratory-routing-nb';
import { laboratoryEndpointsNb as e } from '../../src/content/laboratory-endpoints-nb';
import { laboratoryComputeNb as m } from '../../src/content/laboratory-compute-nb';
import { laboratoryFirewallNb as f } from '../../src/content/laboratory-firewall-nb';
import { revealLaboratoryLink, closeLaboratoryDrawer } from './laboratory-actions';
import type { CommandResult, Snapshot } from '../../src/laboratory/engine';
export { t, c, temp, n, r, e, m, f };
export const memoryResponse = (page: Page, action: string) =>
  page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/laboratory/ephemeral') &&
      response.request().method() === 'POST' &&
      response.request().postDataJSON().action === action,
  );
export const courseBytes = (page: Page) =>
  page.evaluate(() =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(localStorage)
          .filter(([k]) => k.startsWith('azurelab.'))
          .sort(([a], [b]) => a.localeCompare(b)),
      ),
    ),
  );
export async function startTemporary(page: Page) {
  await page.goto('/');
  await page.getByRole('link', { name: t.labLink, exact: true }).click();
  // These inherited journeys intentionally replay the original3.7 workspace.
  await page.getByText('Tidligere arbeidsområdemodeller', { exact: true }).click();
  await page
    .getByRole('combobox', { name: 'Arbeidsområdemodell', exact: true })
    .selectOption('laboratory@3.7.0');
  const started = memoryResponse(page, 'session');
  await page.getByRole('button', { name: temp.start, exact: true }).click();
  const result = await started,
    s: Snapshot = await result.json();
  expect(result.status()).toBe(201);
  expect(s.world.model).toBe('laboratory@3.7.0');
  await expect(page.getByRole('button', { name: c.newGroup, exact: true })).toBeVisible();
  await expect(page.locator('.laboratory-workspace-status')).toContainText(temp.status);
  return s;
}
export async function service(page: Page, name: string) {
  const nav = page.getByRole('navigation', { name: c.navigation, exact: true });
  const favorite = nav.getByRole('link', { name, exact: true, includeHidden: true });
  if (await favorite.count()) {
    await revealLaboratoryLink(
      page,
      nav.getByRole('link', { name: nb.portal.areas.home, exact: true }),
    );
    const disclosure = favorite.locator('xpath=ancestor::details[1]');
    if ((await disclosure.count()) && (await disclosure.getAttribute('open')) === null)
      await disclosure.locator('summary').click();
    await favorite.click();
  } else {
    const directory = nav.getByRole('link', { name: nb.portal.areas.services, exact: true });
    await revealLaboratoryLink(page, directory);
    await directory.click();
    await closeLaboratoryDrawer(page);
    const link = page.locator('main').getByRole('link', { name, exact: true, includeHidden: true });
    const disclosure = link.locator('xpath=ancestor::details[1]');
    if ((await disclosure.count()) && (await disclosure.getAttribute('open')) === null)
      await disclosure.locator('summary').click();
    await link.click();
  }
  await closeLaboratoryDrawer(page);
  await expect(page.locator('.portal-title h1')).toHaveText(name);
}
export async function openResource(page: Page, name: string) {
  await page.getByRole('link', { name, exact: true }).click();
  await expect(page.locator('.portal-title h1')).toHaveText(name);
}
const label = (key: string) =>
  key === 'subscriptionId'
    ? c.subscription
    : ([f.fields, m.fields, e.fields, r.fields, n.fields, c.fields]
        .map((map) => (map as Record<string, string>)[key])
        .find(Boolean) ?? key);
export async function fill(page: Page, fields: Record<string, string>, selector = '.lab-form') {
  for (const [key, value] of Object.entries(fields)) {
    const input = page
      .locator(selector)
      .getByLabel(key === 'name' ? c.name : key === 'text' ? c.text : label(key), { exact: true });
    if (await input.evaluate((el) => el.tagName === 'SELECT')) await input.selectOption(value);
    else await input.fill(value);
  }
}
export async function create(
  page: Page,
  button: string,
  fields: Record<string, string>,
  apply = false,
  transport: 'memory' | 'persistent' = 'memory',
) {
  await page.getByRole('button', { name: button, exact: true }).click();
  await fill(page, fields);
  await page.getByRole('button', { name: c.review, exact: true }).click();
  const review = page.getByRole('region', { name: c.review, exact: true });
  await expect(review).toContainText('Konfigurasjonen er validert');
  const response =
    transport === 'persistent'
      ? page.waitForResponse(
          (response) =>
            response.request().method() === 'POST' &&
            response.url().endsWith('/api/laboratory/command'),
        )
      : memoryResponse(page, 'command');
  await review.getByRole('button', { name: apply ? n.apply : c.create, exact: true }).click();
  const res = await response;
  const result: CommandResult = await res.json();
  expect(result.receipt.outcome).toBe('accepted');
  await expect(page.locator('.lab-form')).toHaveCount(0);
  if (fields.name) await expect(page.locator('.portal-title h1')).toHaveText(fields.name);
  return result;
}
