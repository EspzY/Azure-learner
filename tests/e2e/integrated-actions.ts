import { portalResourceContextNb as fidelity } from '../../src/content/portal-resource-context-nb';
import { expect, type Page } from '@playwright/test';
import { nb, landingNb as landing, laboratoryV3Nb as storage } from '../../src/content/nb';
import { laboratoryEphemeralNb as temp } from '../../src/content/laboratory-ephemeral-nb';
import { laboratoryApplicationNb as application } from '../../src/content/laboratory-application-nb';
import { create, service as globalService, memoryResponse, courseBytes } from './ephemeral-actions';
import type { CommandResult, Snapshot } from '../../src/laboratory/engine';
import type { World } from '../../src/laboratory/v39/contract';
export { courseBytes, memoryResponse, storage, application };

/** Navigate through the actual parent menu. These historic test labels remain
 * family identifiers, not assertions that children belong in global Favorites. */
export async function service(page: Page, name: string) {
  const contexts: Record<string, { services: string[]; menu: string }> = {
    'Front Door endpoints': { services: ['Front Door profiles'], menu: 'Endpoints' },
    'Origin groups and synthetic probes': {
      services: ['Front Door profiles'],
      menu: 'Origin groups',
    },
    'Front Door origins': { services: ['Front Door profiles'], menu: 'Origins' },
    'Front Door routes': { services: ['Front Door profiles'], menu: 'Routes' },
    'Front Door security policies': {
      services: ['Front Door profiles'],
      menu: 'Security policies',
    },
    'WAF custom rules': { services: ['Front Door WAF policies'], menu: 'Custom rules' },
    'Gateway backend pools': { services: ['Application Gateways'], menu: 'Backend pools' },
    'Gateway HTTP listeners': { services: ['Application Gateways'], menu: 'Listeners' },
    'Gateway HTTPS backend settings': {
      services: ['Application Gateways'],
      menu: 'Backend settings',
    },
    'Gateway synthetic probes': { services: ['Application Gateways'], menu: 'Health probes' },
    'Gateway routing rules': { services: ['Application Gateways'], menu: 'Rules' },
    'PostgreSQL database': {
      services: ['Azure Database for PostgreSQL flexible server'],
      menu: 'Databases',
    },
    'Database server firewall rule': {
      services: ['SQL logical server', 'Azure Database for PostgreSQL flexible server'],
      menu: 'Networking',
    },
    'Synthetic function': { services: ['Function App'], menu: 'Functions' },
    'Application database binding': {
      services: [nb.portal.areas.apps, 'Function App'],
      menu: 'Database bindings',
    },
  };
  const context = contexts[name];
  if (!context) return globalService(page, name);
  const serviceViews: Record<string, string> = {
    'Front Door profiles': 'frontDoor',
    'Front Door WAF policies': 'frontDoorWafPolicy',
    'Application Gateways': 'applicationGateway',
    'Azure Database for PostgreSQL flexible server': 'postgresServer',
    'SQL logical server': 'sqlServer',
    'Function App': 'functionApp',
    [nb.portal.areas.apps]: 'webApp',
  };
  const owners = context.services.map((name) => serviceViews[name]);
  if (name === 'Front Door origins') owners.push('originGroup');
  if (name === 'Front Door routes') owners.push('frontDoorEndpoint');
  const menu = page.locator('[data-portal-component="resource-menu"]');
  const target = menu.getByRole('button', { name: context.menu, exact: true });
  const current = new URL(page.url()).searchParams.get('view');
  if (owners.includes(current ?? '') && (await target.count())) {
    await expect(target, `Unique actual ${current} context menu`).toHaveCount(1);
    await target.click();
    await expect(
      page.getByRole('heading', { level: 2, name: context.menu, exact: true }),
    ).toBeVisible();
    return;
  }
  let selected = false;
  for (const parentService of context.services) {
    await globalService(page, parentService);
    const resources = page.getByRole('table').getByRole('link');
    if (await resources.count()) {
      await expect(resources, `Unique actual parent required for ${name}`).toHaveCount(1);
      await resources.click();
      selected = true;
      break;
    }
  }
  expect(selected, `Actual parent required for ${name}`).toBe(true);
  await expect(menu.getByRole('button', { name: context.menu, exact: true })).toBeVisible();
  await menu.getByRole('button', { name: context.menu, exact: true }).click();
  await expect(
    page.getByRole('heading', { level: 2, name: context.menu, exact: true }),
  ).toBeVisible();
}
export const integratedFamilyKinds: Record<string, string> = {
  frontDoor: 'frontDoor',
  frontDoorEndpoint: 'frontDoor',
  originGroup: 'frontDoor',
  frontDoorOrigin: 'frontDoor',
  frontDoorRoute: 'frontDoor',
  frontDoorWafPolicy: 'waf',
  frontDoorWafRule: 'waf',
  frontDoorSecurityPolicy: 'frontDoor',
  applicationGateway: 'applicationGateway',
  gatewayBackendPool: 'applicationGateway',
  gatewayListener: 'applicationGateway',
  gatewayBackendSetting: 'applicationGateway',
  gatewayProbe: 'applicationGateway',
  gatewayRoutingRule: 'applicationGateway',
  postgresServer: 'postgresServer',
  postgresDatabase: 'postgresServer',
  sqlServer: 'sqlServer',
  sqlDatabase: 'sqlDatabase',
  databaseFirewallRule: 'settings',
  functionPlan: 'plan',
  functionApp: 'functionApp',
  function: 'functionApp',
  databaseConnection: 'settings',
};

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
    const fieldLabel =
      label === storage.name && (await page.locator('.lab-group-create').count())
        ? fidelity.groupName
        : label;
    const input = page.locator('.lab-form').getByLabel(fieldLabel, { exact: true });
    if (!(await input.isEditable())) {
      await expect(input).toHaveValue(value);
      continue;
    }
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
  await page
    .locator('.lab-form')
    .getByRole('button', { name: /^Review(?: \+ (?:create|save|delete))?$/ })
    .click();
  const preview = await (await reviewed).json();
  expect(preview.preview.outcome, JSON.stringify(preview.preview)).toBe('accepted');
  if (action === 'Delete') await page.locator('.lab-form').getByRole('checkbox').check();
  const committed = integratedResponse(page, 'command');
  await page.locator('.lab-form').getByRole('button', { name: action, exact: true }).click();
  const result: CommandResult = await (await committed).json();
  expect(result.receipt.outcome, JSON.stringify(result.receipt)).toBe('accepted');
  await expect(page.locator('.lab-integrated-form')).toHaveCount(0);
  const suffix = result.receipt.operation.replace(/^(Create|Update)/, '');
  const view = suffix.charAt(0).toLowerCase() + suffix.slice(1);
  let kind = integratedFamilyKinds[view];
  if (kind && action !== 'Delete') {
    await expect.poll(() => new URL(page.url()).searchParams.get('view')).toBe(view);
    if (view === 'databaseFirewallRule') {
      const id = result.receipt.addedIds[0] ?? result.receipt.updatedIds?.[0];
      const rule = integratedWorld(result).data.databaseFirewallRules.find(
        (rule) => rule.id === id,
      );
      kind = rule?.type.startsWith('Microsoft.DBforPostgreSQL') ? 'postgresServer' : 'sqlServer';
    }
    if (kind === 'settings')
      await expect(page.locator('.portal-title [data-icon="settings"]')).toHaveAttribute(
        'data-icon-source',
        'fluent',
      );
    else await expectIntegratedTitleIcon(page, kind);
  }
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
