import { expect, type Page } from '@playwright/test';
import { nb, landingNb as landing, laboratoryV3Nb as storage } from '../../src/content/nb';
import { laboratoryEphemeralNb as temp } from '../../src/content/laboratory-ephemeral-nb';
import { laboratoryApplicationNb as application } from '../../src/content/laboratory-application-nb';
import { create, service, memoryResponse, courseBytes } from './ephemeral-actions';
import type { CommandResult, Snapshot } from '../../src/laboratory/engine';
import type { World } from '../../src/laboratory/v39/contract';
export { service, courseBytes, memoryResponse, storage, application };
export const integratedIconFiles: Record<string, string> = {
  frontDoor: '10073-icon-service-Front-Door-and-CDN-Profiles.svg',
  waf: '10362-icon-service-Web-Application-Firewall-Policies-WAF.svg',
  applicationGateway: '10076-icon-service-Application-Gateways.svg',
  postgresServer: '10131-icon-service-Azure-Database-PostgreSQL-Server.svg',
  sqlServer: '10132-icon-service-SQL-Server.svg',
  sqlDatabase: '10130-icon-service-SQL-Database.svg',
  functionApp: '10029-icon-service-Function-Apps.svg',
  account: '10086-icon-service-Storage-Accounts.svg',
  vm: '10021-icon-service-Virtual-Machine.svg',
  plan: '00046-icon-service-App-Service-Plans.svg',
};
export async function expectIntegratedTitleIcon(page: Page, kind: string) {
  const icon = page.locator(`.portal-title img[data-icon="${kind}"]`);
  await expect(icon).toHaveAttribute('src', '/icons/azure/' + integratedIconFiles[kind]);
  await expect(icon).toHaveAttribute('data-icon-source', 'azure');
  await expect
    .poll(() =>
      icon.evaluate(
        (image) =>
          (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
      ),
    )
    .toBe(true);
}
export async function expectIntegratedRowIcon(page: Page, name: string, kind: string) {
  const row = page.getByRole('row').filter({ has: page.getByRole('link', { name, exact: true }) });
  const icon = row.locator(`img[data-icon="${kind}"]`);
  await expect(icon).toHaveAttribute('src', '/icons/azure/' + integratedIconFiles[kind]);
  await expect
    .poll(() =>
      icon.evaluate(
        (image) =>
          (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
      ),
    )
    .toBe(true);
}
export const integratedResponse = (page: Page, action: string) =>
  page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      (response.url().endsWith('/api/laboratory/' + action) ||
        (response.url().endsWith('/api/laboratory/ephemeral') &&
          response.request().postDataJSON().action === action)),
  );
export const integratedWorld = (snapshot: Snapshot) => {
  expect(snapshot.world.model).toBe('laboratory@3.9.0');
  return snapshot.world as World;
};
export async function startIntegrated(page: Page, persistent = false) {
  await page.goto('/');
  await page.getByRole('link', { name: landing.labLink, exact: true }).click();
  await expect(page.getByText('3.9 · Integrated Application Chain', { exact: true })).toBeVisible();
  const started = integratedResponse(page, 'session');
  await page
    .getByRole('button', { name: persistent ? storage.start : temp.start, exact: true })
    .click();
  const result: Snapshot = await (await started).json();
  expect(result.world.model).toBe('laboratory@3.9.0');
  await expect(page.locator('[data-portal-component="home"]')).toBeVisible();
  return result;
}
export async function fillIntegrated(page: Page, fields: Record<string, string>) {
  for (const [label, value] of Object.entries(fields)) {
    const input = page.locator('.lab-form').getByLabel(label, { exact: true });
    if (await input.evaluate((element) => element.tagName === 'SELECT'))
      await input.selectOption(value);
    else await input.fill(value);
  }
}
export async function integratedOperation(
  page: Page,
  label: string,
  fields: Record<string, string> = {},
  action = 'Create',
): Promise<CommandResult> {
  await page.getByRole('button', { name: label, exact: true }).click();
  await fillIntegrated(page, fields);
  const reviewed = integratedResponse(page, 'review');
  await page.locator('.lab-form').getByRole('button', { name: 'Review', exact: true }).click();
  const preview = await (await reviewed).json();
  expect(preview.preview.outcome, JSON.stringify(preview.preview)).toBe('accepted');
  if (action === 'Delete') await page.locator('.lab-form').getByRole('checkbox').check();
  const committed = integratedResponse(page, 'command');
  await page.locator('.lab-form').getByRole('button', { name: action, exact: true }).click();
  const result: CommandResult = await (await committed).json();
  expect(result.receipt.outcome, JSON.stringify(result.receipt)).toBe('accepted');
  await expect(page.locator('.lab-integrated-form')).toHaveCount(0);
  return result;
}
export async function integratedApp(page: Page, suffix: string) {
  await startIntegrated(page);
  const before = await courseBytes(page);
  const group = await create(page, storage.newGroup, { name: `rg-${suffix}` });
  await service(page, nb.portal.areas.plans);
  await integratedOperation(page, application.operations.CreateAppServicePlan, {
    [application.fields.name]: `plan-${suffix}`,
  });
  await service(page, nb.portal.areas.apps);
  const app = await integratedOperation(page, application.operations.CreateWebApp, {
    [application.fields.name]: `app-${suffix}`,
  });
  const configured = await integratedOperation(
    page,
    application.operations.DeploySyntheticApplication,
    {},
    application.save,
  );
  return { before, group, app, configured };
}
