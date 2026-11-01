import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  nb,
  serverlessNb,
  securityNb as c,
  securityItemsNb,
  labsNb,
  learningPolishNb,
} from '../../src/content/nb';
import {
  securityKey,
  securityFacts,
  freshSecurity,
  applySecurity,
  securityGuidedAnswer,
  securityItems,
  evaluateSecurityAttempt,
  type SecuritySave,
} from '../../src/domain/curriculum/security';
import { securityContrasts } from '../fixtures/security';
import { practicalFacts } from '../../src/domain/sandbox/practical';
import { sandboxKey } from '../../src/domain/sandbox/store';
const modules = [
  ['compute', 'vm', 'azurelab.learning.compute-hosting.v1'],
  ['networking', 'inspect', 'azurelab.learning.networking-foundations.v1'],
  ['connectivity', 'choose', 'azurelab.learning.networking-connectivity.v1'],
  ['storage', 'design', 'azurelab.learning.storage-services.v1'],
  ['storage-resilience', 'tiers', 'azurelab.learning.storage-resilience.v1'],
  ['identity', 'directory', 'azurelab.learning.identity-foundations.v1'],
  ['access-control', 'rbac', 'azurelab.learning.access-control.v1'],
  ['security', 'trust', securityKey],
  ['cost', 'estimate', 'azurelab.learning.cost-management.v1'],
  ['governance', 'data', 'azurelab.learning.governance-compliance.v1'],
  ['management-tools', 'intent', 'azurelab.learning.management-tools.v1'],
  ['monitoring', 'evidence', 'azurelab.learning.monitoring-diagnostics.v1'],
  ['migration', 'method', 'azurelab.learning.file-movement-migration.v1'],
] as const;
const raw = (p: Page, key = securityKey) => p.evaluate((k) => localStorage.getItem(k), key);
const facts = async (p: Page) =>
  securityFacts(JSON.parse((await raw(p)) ?? JSON.stringify(freshSecurity())) as SecuritySave);
const next = (p: Page) => p.locator('.course-nav-next a');
async function close(p: Page) {
  if (await p.getByRole('dialog').isVisible()) await p.getByRole('dialog').press('Escape');
}
async function startSecurity(p: Page) {
  await p.goto('/learn/security?topic=missions');
  await p.locator('.compute-mission-list article').first().getByRole('link').click();
  await p
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
  await expect.poll(async () => (await facts(p)).guide?.mission).toBe('trust');
}
for (const [module, mission, key] of modules) {
  test(`Learning Flow ${module}: explicit briefing and real active guide control the shared primary action`, async ({
    page,
  }) => {
    await page.goto(`/learn/${module}?topic=${module === 'cost' ? 'summary' : 'missions'}`);
    const link =
      module === 'cost'
        ? page.locator('.cost-summary li').first().getByRole('link')
        : page.locator('.compute-mission-list article').first().getByRole('link');
    const world = await raw(page, sandboxKey);
    await link.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(
      JSON.parse((await raw(page, key)) ?? '{"events":[]}').events.filter(
        (e: { kind: string }) => e.kind === 'mission',
      ),
    ).toEqual([]);
    await page.getByRole('dialog').press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.reload();
    await expect(next(page)).toHaveAttribute('data-flow-action', 'brief');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await next(page).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: serverlessNb.start, exact: true })
      .click();
    await expect(next(page)).toHaveAttribute('data-flow-action', 'work');
    const saved = JSON.parse((await raw(page, key)) ?? '{"events":[]}');
    expect(
      saved.events
        .filter((e: { kind: string; mission?: string }) => e.kind === 'mission')
        .map((e: { mission: string }) => e.mission),
    ).toEqual([mission]);
    const url = page.url();
    await next(page).click();
    await expect(page).toHaveURL(url);
    await expect(page.locator('#guided-work')).toBeFocused();
    expect(await raw(page, sandboxKey)).toBe(world);
    expect(
      JSON.parse((await raw(page, key)) ?? '{}').events.filter(
        (e: { kind: string }) => e.kind === 'explain',
      ),
    ).toEqual([]);
  });
}

test('Learning Flow complete Security contrasts require explanation before debrief and next guide without new credit', async ({
  page,
}) => {
  await startSecurity(page);
  const world = await raw(page, sandboxKey),
    bench = page.locator('.security-workbench');
  for (const input of securityContrasts.trust) {
    for (const [key, value] of Object.entries(input)) {
      if (key === 'kind') continue;
      const ctl = bench.getByRole(typeof value === 'boolean' ? 'checkbox' : 'combobox', {
        name: c.controls[key as keyof typeof c.controls],
        exact: true,
      });
      if (typeof value === 'boolean') await ctl.setChecked(value);
      else await ctl.selectOption(String(value));
    }
    await bench.getByRole('combobox', { name: c.labels.predict, exact: true }).selectOption('1');
    await bench.getByRole('button', { name: c.labels.run, exact: true }).click();
    await expect(bench.locator('.compute-observation')).toBeVisible();
    await close(page);
  }
  await expect(next(page)).toHaveText(new RegExp('Fullfør årsaksforklaringen'));
  await next(page).click();
  await expect(page.locator('#guided-cause')).toBeFocused();
  expect((await facts(page)).completed).toEqual([]);
  await bench
    .getByRole('radio', { name: c.causal.trust[securityGuidedAnswer.trust], exact: true })
    .check();
  await bench.getByRole('button', { name: c.labels.explain, exact: true }).click();
  await close(page);
  await expect(next(page)).toHaveAttribute('data-flow-action', 'next');
  await expect(bench.getByText(c.missions.trust.debrief, { exact: true }).first()).toBeVisible();
  await page.locator('.course-overview-link').click();
  await page.waitForURL('/learn');
  await page.reload();
  await expect(page.locator('.learn-hub-start .course-primary')).toHaveAttribute(
    'href',
    '/learn/security?topic=studio&perspective=depth',
  );
  await page.locator('.learn-hub-start .course-primary').click();
  await expect(next(page)).toHaveAttribute('data-flow-action', 'brief');
  await expect(page.getByText('Du har en pågående undersøkelse.', { exact: true })).toHaveCount(0);
  expect((await facts(page)).completed).toEqual(['trust']);
  expect((await facts(page)).firsts).toEqual([]);
  expect(await raw(page, sandboxKey)).toBe(world);
});

test('Learning Flow pause resume another perspective and Back Forward preserve the same stored guide', async ({
  page,
}) => {
  await startSecurity(page);
  await page.getByRole('button', { name: c.pauseGuided, exact: true }).click();
  await expect(next(page)).toHaveAttribute('data-flow-action', 'resume');
  await page.locator('.course-overview-link').click();
  await page.waitForURL('/learn');
  await page.locator('.learn-hub-start .course-primary').click();
  await next(page).click();
  expect((await facts(page)).guide?.id).toBe(1);
  await page.locator('.security-perspectives a').nth(1).click();
  await expect(next(page)).toHaveAttribute(
    'href',
    '/learn/security?topic=studio&perspective=trust#guided-work',
  );
  await expect(page.locator('.guided-other-mission')).toContainText(c.missions.trust.title);
  await next(page).click();
  await page.waitForURL(/perspective=trust/);
  await page.goBack();
  await page.goForward();
  await page.reload();
  await expect(next(page)).toHaveAttribute('data-flow-action', 'work');
  expect((await facts(page)).guided).toHaveLength(1);
  // Portal and Course must select the same most recent paused session, not mission-list order.
  await page.getByRole('button', { name: c.pauseGuided, exact: true }).click();
  await page.locator('.security-perspectives a').nth(1).click();
  await next(page).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
  await page.getByRole('button', { name: c.pauseGuided, exact: true }).click();
  expect((await facts(page)).guided).toHaveLength(2);
  await expect(next(page)).toHaveAttribute(
    'href',
    '/learn/security?topic=studio&perspective=depth#guided-work',
  );
  await page.goto('/portal');
  await page.locator('.portal-guidance-toggle').click();
  await expect(page.locator('#portal-guidance-menu')).toContainText(c.missions.depth.title);
  await expect(page.locator('#portal-guidance-menu')).not.toContainText(c.missions.trust.title);
});

for (const kind of ['vm', 'paas'] as const) {
  test(`Portal guidance ${kind}: minimized guide recovery and ordinary Portal return preserve the original session`, async ({
    page,
  }) => {
    await page.goto(
      `/learn/services?topic=${kind === 'vm' ? 'iaas' : 'paas'}&activity=practical&version=2`,
    );
    await page
      .locator('.practical-entry')
      .getByRole('button', { name: labsNb.launch, exact: true })
      .click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: learningPolishNb.briefing.start, exact: true })
      .click();
    await page.waitForURL(new RegExp(`practice=${kind}`));
    const session = await raw(page, 'azurelab.practical-labs.v1'),
      world = await raw(page, sandboxKey),
      xp = await raw(page, 'azurelab.progress.v1');
    const coach = page.locator('.guided-coach');
    await expect(coach).toBeVisible();
    await coach.locator('header button').first().click();
    await expect(coach).toHaveClass(/coach-minimized/);
    await page.locator('.portal-guidance-toggle').click();
    await expect(coach).not.toHaveClass(/coach-minimized/);
    await expect(coach).toBeFocused();
    await page
      .getByRole('navigation', { name: nb.portal.navLabel, exact: true })
      .getByRole('link', { name: nb.portal.areas.groups, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`practice=${kind}`));
    await page.goBack();
    await page.goForward();
    await page.reload();
    await expect(coach).toBeVisible();
    await page.goto('/portal');
    await page.locator('.portal-guidance-toggle').click();
    await page
      .locator('#portal-guidance-menu')
      .getByRole('link', {
        name: new RegExp(labsNb.lab[kind].title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      })
      .click();
    await page.waitForURL(new RegExp(`practice=${kind}`));
    await expect(coach).toBeVisible();
    expect(await raw(page, 'azurelab.practical-labs.v1')).toBe(session);
    await page.locator('.portal-guidance-toggle').click();
    await page
      .locator('#portal-guidance-menu')
      .getByRole('link', { name: 'Tilbake til oppdraget i kurset', exact: true })
      .click();
    await page
      .locator('.practical-entry')
      .getByRole('link', { name: labsNb.resume, exact: true })
      .click();
    await page.waitForURL(new RegExp(`practice=${kind}`));
    const restored = await raw(page, 'azurelab.practical-labs.v1');
    expect(practicalFacts(JSON.parse(restored!)).sessions).toEqual(
      practicalFacts(JSON.parse(session!)).sessions,
    );
    expect(
      JSON.parse(restored!).events.filter((e: { type: string }) => e.type === 'start'),
    ).toHaveLength(1);
    expect(await raw(page, sandboxKey)).toBe(world);
    expect(await raw(page, 'azurelab.progress.v1')).toBe(xp);
  });
}

test('Portal neutral guidance and recommended assessment return preserve unaided drafts and previous firsts', async ({
  page,
}) => {
  await page.goto('/learn/security?topic=assessment&case=sp01');
  await page.getByRole('button', { name: c.assessment.start, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
  const pair = securityItems.sp01.accepted[0]!;
  await page
    .getByRole('radio', { name: securityItemsNb.sp01.decisions[pair[0]]!, exact: true })
    .check();
  await page
    .getByRole('radio', { name: securityItemsNb.sp01.reasons[(pair[1] + 1) % 3]!, exact: true })
    .check();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect.poll(async () => (await facts(page)).firsts.length).toBe(1);
  const first = JSON.stringify((await facts(page)).firsts[0]);
  expect(evaluateSecurityAttempt((await facts(page)).firsts[0]!).relation).toBe(false);
  await page.goto('/learn/security?topic=assessment&case=sp08');
  await page.getByRole('button', { name: c.assessment.start, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
  await page.getByRole('radio', { name: securityItemsNb.sp08.decisions[0], exact: true }).check();
  await expect(next(page)).toHaveAttribute('href', '/learn/security?topic=assessment&case=sp08');
  await next(page).click();
  expect((await facts(page)).assisted).toBe(false);
  const before = await raw(page),
    world = await raw(page, sandboxKey);
  await page.goto('/portal?lab=web-platform&mode=guided');
  await page.locator('.portal-guidance-toggle').click();
  await expect(page.locator('#portal-guidance-menu')).toContainText('aktiv selvstendig vurdering');
  await expect(page.locator('.guided-coach,.compute-portal-guide')).toHaveCount(0);
  await expect(page.locator('#portal-guidance-menu')).not.toContainText(c.missions.trust.title);
  expect(await raw(page)).toBe(before);
  expect(await raw(page, sandboxKey)).toBe(world);
  await page.locator('#portal-guidance-menu').getByRole('link').click();
  await page.locator('.learn-hub-start .course-primary').click();
  await page.waitForURL(/case=sp08/);
  await page.reload();
  await expect(
    page.getByRole('radio', { name: securityItemsNb.sp08.decisions[0], exact: true }),
  ).toBeChecked();
  expect((await facts(page)).assisted).toBe(false);
  expect(JSON.stringify((await facts(page)).firsts.find((x) => x.item === 'sp01'))).toBe(first);
  await page.getByRole('button', { name: c.assessment.abandon, exact: true }).click();
  await page.goto('/learn/security?topic=assessment&case=sp01');
  await page.getByRole('button', { name: c.assessment.retry, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
  await page.getByRole('link', { name: c.assessment.help, exact: true }).click();
  await expect.poll(async () => (await facts(page)).assisted).toBe(true);
  await page.goto('/learn/security?topic=assessment&case=sp01');
  await page
    .getByRole('radio', { name: securityItemsNb.sp01.decisions[pair[0]]!, exact: true })
    .check();
  await page
    .getByRole('radio', { name: securityItemsNb.sp01.reasons[pair[1]]!, exact: true })
    .check();
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect.poll(async () => (await facts(page)).current?.status).toBe('submitted');
  expect((await facts(page)).current).toMatchObject({ retry: true, assisted: true });
  expect(evaluateSecurityAttempt((await facts(page)).current!).relation).toBe(true);
  expect(JSON.stringify((await facts(page)).firsts.find((x) => x.item === 'sp01'))).toBe(first);
});

test('Portal stale external context withholds retained guide instructions until scoped recovery', async ({
  page,
  context,
}) => {
  await startSecurity(page);
  await page.goto('/portal?security=inspect&perspective=trust');
  const other = await context.newPage();
  await other.goto('/portal');
  const replacement = applySecurity(freshSecurity(), { kind: 'mission', mission: 'depth' })!;
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: securityKey,
    raw: JSON.stringify(replacement),
  });
  await page.locator('.portal-guidance-toggle').click();
  await expect(page.locator('#portal-guidance-menu')).toContainText('kan ikke bekreftes');
  await expect(page.locator('#portal-guidance-menu')).not.toContainText(c.missions.trust.title);
  await expect(page.locator('.guided-coach,.compute-portal-guide')).toHaveCount(0);
  await other.close();
});

test('Learning Flow denied durable start never creates a guide or completion from a briefing', async ({
  page,
}) => {
  await page.goto('/learn/security?topic=missions');
  await page.locator('.compute-mission-list article').first().getByRole('link').click();
  await page.getByRole('dialog').waitFor();
  const before = await raw(page);
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw Error('write denied');
      return original.call(this, k, v);
    };
  }, securityKey);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
  expect(await raw(page)).toBe(before);
  expect((await facts(page)).guided).toEqual([]);
  expect((await facts(page)).completed).toEqual([]);
  await expect(page.getByRole('status').filter({ hasText: 'unsaved' }).first()).toBeVisible();
});

test('Guidance desktop compact keyboard short windows reduced motion and Axe keep recovery and next actions reachable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.goto('/portal');
    await page.locator('.portal-guidance-toggle').focus();
    await page.keyboard.press('Enter');
    const menu = page.locator('#portal-guidance-menu');
    await expect(menu).toContainText('Fri Portal-sandbox');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(page.locator('.portal-guidance-toggle')).toBeFocused();
  }
  await startSecurity(page);
  await next(page).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#guided-work')).toBeFocused();
  const workTop = await page
    .locator('#guided-work')
    .evaluate((node) => node.getBoundingClientRect().top);
  expect(workTop).toBeGreaterThanOrEqual(65);
  expect(workTop).toBeLessThan(200);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  // Preserve inherited narrow/Arial bounds and the separate two-row Portal header boundary.
  await page.goto('/portal');
  await page.addStyleTag({ content: '.portal { font-family: Arial, sans-serif; }' });
  for (const width of [320, 600, 601, 640, 700, 768, 800, 801, 1024]) {
    await page.setViewportSize({ width, height: 500 });
    await page.locator('.portal-guidance-toggle').focus();
    await page.keyboard.press('Enter');
    const bounds = await page.locator('#portal-guidance-menu').boundingBox();
    const header = await page.locator('.portal-header').boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(bounds!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (width === 320 || width === 800)
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(page.locator('.portal-guidance-toggle')).toBeFocused();
  }
});

for (const module of ['compute', 'networking'] as const) {
  test(`Portal ${module}: native inspection guide survives scope navigation recovery and a wrong technical attempt is not rebound`, async ({
    page,
  }) => {
    await page.goto(`/learn/${module}?topic=missions`);
    await page.locator('.compute-mission-list article').first().getByRole('link').click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: serverlessNb.start, exact: true })
      .click();
    await page.locator(`a[href^="/portal?"][href*="${module}="]`).first().click();
    await page.waitForURL(new RegExp(`${module}=`));
    const coach = page.locator('.compute-portal-guide');
    await expect(coach).toBeVisible();
    const key =
      module === 'compute'
        ? 'azurelab.learning.compute-hosting.v1'
        : 'azurelab.learning.networking-foundations.v1';
    const saved = await raw(page, key),
      world = await raw(page, sandboxKey);
    await coach
      .getByRole('button', { name: /Skjul|Minimer/i })
      .first()
      .click();
    await page.locator('.portal-guidance-toggle').click();
    await expect(coach).not.toHaveClass(/compute-guide-minimized/);
    await page
      .getByRole('navigation', { name: nb.portal.navLabel, exact: true })
      .getByRole('link', { name: nb.portal.areas.resources, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${module}=`));
    await page.goto('/portal');
    await page.locator('.portal-guidance-toggle').click();
    await page
      .locator('#portal-guidance-menu')
      .getByRole('link', { name: /Fortsett veiledning/ })
      .click();
    await page.waitForURL(new RegExp(`${module}=${module === 'compute' ? 'vm' : 'inspect'}`));
    await page.reload();
    await expect(coach).toBeVisible();
    expect(await raw(page, key)).toBe(saved);
    expect(await raw(page, sandboxKey)).toBe(world);
    // An original validated UI start has a pinned technical attempt. Resetting only the technical
    // context must not reinterpret that saved guide as belonging to the new attempt.
    await page.getByRole('button', { name: nb.portal.limitations, exact: true }).click();
    await page.getByRole('button', { name: nb.portal.resetTechnical, exact: true }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: nb.portal.confirmReset, exact: true })
      .click();
    await page.locator('.portal-guidance-toggle').click();
    await expect(page.locator('#portal-guidance-menu')).toContainText(
      'Kontroller oppdragskonteksten',
    );
    await expect(page.locator('#portal-guidance-menu')).not.toContainText('Fortsett veiledning');
    expect(await raw(page, key)).toBe(saved);
  });
}
