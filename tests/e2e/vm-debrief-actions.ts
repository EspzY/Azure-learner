import { expect, type Page } from '@playwright/test';
import { openPathActivities } from './course-hub-actions';
import { missionsNb as c, nb, labsNb as lab, learningPolishNb } from '../../src/content/nb';
import {
  missionKey,
  missionFacts,
  missionOrigin,
  missionAnswerIds,
  type MissionId,
  type MissionSave,
} from '../../src/domain/sandbox/missions';
const p = nb.portal;
export async function start(page: Page, id: MissionId, mode = 'guided') {
  await page.goto('/learn');
  await openPathActivities(page, 'cloud');
  await page
    .locator('.mission-discovery')
    .getByRole('link', { name: c.missions[id].title, exact: true })
    .click();
  const entry = page.getByRole('region', { name: c.missions[id].title, exact: true });
  await expect(entry).toContainText(c.missions[id].bridge);
  if (mode === 'guided') {
    const before = await page.evaluate(() =>
      localStorage.getItem('azurelab.practical-missions.v1'),
    );
    await entry.getByRole('button', { name: c.start, exact: true }).click();
    const dialog = page.getByRole('dialog', { name: c.missions[id].title, exact: true });
    await expect(dialog).toContainText(c.missions[id].observation);
    await dialog
      .getByRole('button', { name: learningPolishNb.briefing.cancel, exact: true })
      .click();
    expect(await page.evaluate(() => localStorage.getItem('azurelab.practical-missions.v1'))).toBe(
      before,
    );
    await entry.getByRole('button', { name: c.start, exact: true }).click();
    await dialog
      .getByRole('button', { name: learningPolishNb.briefing.start, exact: true })
      .click();
  } else await entry.getByRole('button', { name: c.independent, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`mission=${id}`));
  await expect(page.locator('.mission-coach')).toContainText(c.missions[id].title);
}
export async function area(page: Page, area: keyof typeof p.areas) {
  await expect(page.locator('.portal-title h1')).toBeVisible();
  const nav = page.getByRole('navigation', { name: p.navLabel, exact: true });
  if (!(await nav.isVisible()))
    await page.getByRole('button', { name: p.menu, exact: true }).click();
  await expect(nav).toBeVisible();
  const link = nav.getByRole('link', { name: p.areas[area], exact: true });
  if (!(await link.isVisible())) await nav.locator('.portal-learning-tools > summary').click();
  await link.click();
  await expect(page.locator('.portal-title h1')).toHaveText(p.areas[area]);
}
export async function create(
  page: Page,
  kind: 'group' | 'plan' | 'app',
  name: string,
  subscription = 'sub-app',
  region = 'westeurope',
  groupName = 'rg-mission',
) {
  await area(page, kind === 'group' ? 'groups' : kind === 'plan' ? 'plans' : 'apps');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`area=create.*kind=${kind}`));
  await expect(page.locator('.portal-title h1')).toHaveText(p.createTitles[kind]);
  if (kind === 'group') {
    await page
      .getByRole('combobox', { name: p.subscription, exact: true })
      .selectOption(subscription);
    await expect(page.getByRole('combobox', { name: p.subscription, exact: true })).toHaveValue(
      subscription,
    );
    await page.getByLabel(p.groupName, { exact: true }).fill(name);
  } else {
    await page
      .getByRole('combobox', { name: p.subscription, exact: true })
      .selectOption(subscription);
    await page
      .getByRole('combobox', { name: p.group, exact: true })
      .selectOption({ label: groupName });
    await page.getByLabel(p.name, { exact: true }).fill(name);
  }
  if (kind === 'app') {
    const selector = page.locator('[data-guide="plan"]');
    await selector.selectOption({ index: (await selector.locator('option').count()) - 1 });
  } else await page.getByRole('combobox', { name: p.region, exact: true }).selectOption(region);
  await page
    .locator('.portal-create-tabs')
    .getByRole('button', { name: p.review, exact: true })
    .click();
  if (kind === 'group')
    await expect(page.locator('.portal-review')).toContainText(
      subscription === 'sub-shared' ? 'Shared Sandbox' : 'App Sandbox',
    );
  await page.locator('[data-guide="commit"]').click();
  await expect(page).toHaveURL(/area=(resource|activity)/);
  if (kind === 'group') {
    await expect(page.locator('.portal-title h1')).toHaveText(name);
    await expect(page.locator('.portal-essentials')).toContainText(
      subscription === 'sub-shared' ? 'Shared Sandbox' : 'App Sandbox',
    );
  }
}
export async function vm(
  page: Page,
  independent = false,
  profile?: 'small' | 'standard',
  name?: string,
) {
  await area(page, 'vms');
  await page
    .locator('.portal-commandbar')
    .getByRole('button', { name: p.create, exact: true })
    .click();
  await page
    .locator('[data-guide="subscription"]')
    .selectOption(independent ? 'sub-app' : 'sub-shared');
  await page.locator('[data-guide="group"]').selectOption({ index: 1 });
  await page
    .getByLabel(lab.vm.name, { exact: true })
    .fill(name ?? (independent ? 'vm-transfer' : 'vm-converter'));
  await page
    .locator('[data-guide="vm-image"]')
    .selectOption(independent ? 'windows-2022' : 'ubuntu-22-04');
  await page
    .locator('[data-guide="vm-profile"]')
    .selectOption(profile ?? (independent ? 'small' : 'standard'));
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Disks', exact: true })
    .click();
  await page.getByRole('combobox', { name: lab.vm.dataDisk, exact: true }).selectOption('32');
  await page
    .locator('.portal-form-tabs')
    .getByRole('button', { name: 'Review + create', exact: true })
    .click();
  await page.locator('[data-guide="commit"]').click();
  await expect(page).toHaveURL(/area=resource/);
}
export async function closeObservation(page: Page) {
  const dialog = page.locator('dialog[open]');
  if (await dialog.count()) {
    await expect(dialog).toHaveCount(1);
    if (await dialog.getAttribute('data-milestone'))
      await dialog.getByRole('button', { name: nb.milestones.close, exact: true }).click();
    else await dialog.getByRole('button', { name: 'Lukk', exact: true }).last().click();
  }
}
export async function inspectCurrent(page: Page) {
  await closeObservation(page);
  const coach = page.locator('.mission-coach');
  await coach
    .getByRole('button', { name: new RegExp(`^(?:${c.inspect}|${c.inspected}) ·`) })
    .click();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await closeObservation(page);
}
export async function selectCurrent(page: Page) {
  await page
    .locator('.mission-coach')
    .getByRole('button', { name: new RegExp(`^${c.select} ·`) })
    .click();
}
export async function inspectAll(page: Page) {
  const links = await page
    .locator('.mission-coach .mission-actual a')
    .evaluateAll((links) =>
      links.map((a) => ({ href: (a as HTMLAnchorElement).href, text: a.textContent ?? '' })),
    );
  for (const link of links) {
    await page
      .locator('.mission-coach')
      .getByRole('link', { name: link.text, exact: true })
      .click();
    await inspectCurrent(page);
  }
}
export async function returnCourse(page: Page, id: MissionId) {
  await page.locator('.mission-coach').getByRole('link', { name: c.return, exact: true }).click();
  await expect(page).toHaveURL(missionOrigin(id));
  await expect(page.locator('.mission-activity')).toBeVisible();
}
export async function inspectFromCourse(page: Page, id: MissionId) {
  const names = await page.locator('.mission-activity .mission-actual a').allTextContents();
  for (const name of names) {
    await page
      .locator('.mission-activity .mission-actual')
      .getByRole('link', { name, exact: true })
      .click();
    await inspectCurrent(page);
    await returnCourse(page, id);
  }
}
export async function reflect(page: Page, id: MissionId, wrong = false) {
  const activity = page.locator('.mission-activity');
  const choices = c.missions[id].choices as Record<string, readonly [string, string]>;
  const ids = {
    diagnose: ['dependency', 'declared-path'],
    governance: ['resource-location', 'bounded-check'],
    infrastructure: ['guest-control', 'retained-operations'],
    platform: ['managed-os', 'config-only'],
  }[id];
  const session = missionFacts(await state(page)).current!;
  if (id === 'platform' && session.mode === 'independent') {
    ids[0] = missionAnswerIds(session).decision[0]!;
    ids[1] = missionAnswerIds(session).reason[0]!;
  }
  await activity
    .getByRole('radio', {
      name: choices[wrong ? Object.keys(choices)[1]! : ids[0]!]![0],
      exact: true,
    })
    .check();
  await activity.getByRole('radio', { name: choices[ids[1]!]![0], exact: true }).check();
  await activity.getByRole('button', { name: c.submit, exact: true }).click();
}
export async function state(page: Page) {
  return JSON.parse(
    (await page.evaluate((key) => localStorage.getItem(key), missionKey)) ?? 'null',
  ) as MissionSave;
}
