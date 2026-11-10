import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  accessNb as c,
  accessItemsNb,
  nb,
  serverlessNb,
  transferNb,
  managementNb,
} from '../../src/content/nb';
import {
  accessHref,
  accessKey,
  accessFacts,
  freshAccess,
  applyAccess,
  accessGuidedAnswer,
  type AccessSave,
  type AccessMission,
} from '../../src/domain/curriculum/access-control';
import { type AccessInput } from '../../src/domain/curriculum/access-control-model';
import { conditional, accessContrasts } from '../fixtures/access';
import {
  freshIdentity,
  applyIdentity,
  identityKey,
} from '../../src/domain/curriculum/identity-foundations';
import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import {
  freshTransfer,
  applyTransfer,
  transferKey,
  transferFacts,
  transferHref,
} from '../../src/domain/curriculum/transfer';
const bench = (p: Page) => p.locator('.access-workbench');
const raw = (p: Page, key = accessKey) => p.evaluate((k) => localStorage.getItem(k), key);
const facts = async (p: Page) =>
  accessFacts(JSON.parse((await raw(p)) ?? JSON.stringify(freshAccess())) as AccessSave);
async function studio(p: Page, mission: AccessMission) {
  await p.goto(accessHref('studio') + '&perspective=' + mission);
  await bench(p).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await p
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function run(p: Page, input: AccessInput) {
  for (const [key, value] of Object.entries(input)) {
    if (['kind', 'context'].includes(key)) continue;
    if (key === 'policyA' || key === 'policyB') {
      const label = `${c.visual.policy} ${key === 'policyA' ? 'A' : 'B'}`;
      for (const [field, v] of Object.entries(value)) {
        const title =
          field === 'app'
            ? c.controls.policyApp
            : field === 'location'
              ? c.controls.policyLocation
              : c.controls[field as keyof typeof c.controls];
        const control = bench(p).getByRole(typeof v === 'boolean' ? 'checkbox' : 'combobox', {
          name: `${label} · ${title}`,
          exact: true,
        });
        if (typeof v === 'boolean') {
          if ((await control.isChecked()) !== v) await control.setChecked(v);
        } else if ((await control.inputValue()) !== v) await control.selectOption(v as string);
      }
      continue;
    }
    if (
      input.kind === 'rbac' &&
      ['second', 'route', 'deny'].includes(key) &&
      !(await bench(p)
        .locator('.access-advanced')
        .evaluate((el) => (el as HTMLDetailsElement).open))
    )
      await bench(p).locator('.access-advanced summary').click();
    const title =
      input.kind === 'conditional' && key === 'member'
        ? c.controls.teamMember
        : c.controls[key as keyof typeof c.controls];
    const control = bench(p).getByRole(typeof value === 'boolean' ? 'checkbox' : 'combobox', {
      name: title,
      exact: true,
    });
    if (typeof value === 'boolean') {
      if ((await control.isChecked()) !== value) {
        if (!(await control.isVisible()))
          await bench(p).locator('.access-advanced summary').click();
        await control.setChecked(value);
      }
    } else if ((await control.inputValue()) !== String(value)) {
      if (!(await control.isVisible())) await bench(p).locator('.access-advanced summary').click();
      await control.selectOption(String(value));
    }
  }
  await bench(p).getByRole('combobox', { name: c.labels.predict, exact: true }).selectOption('1');
  await bench(p).getByRole('button', { name: c.labels.run, exact: true }).click();
  await expect(bench(p).locator('.compute-observation')).toBeVisible();
  if (await p.getByRole('dialog').isVisible()) await p.getByRole('dialog').press('Escape');
  expect((await facts(p)).guide?.runs.at(-1)?.input).toEqual(input);
}
async function explain(p: Page, mission: AccessMission) {
  await bench(p)
    .getByRole('radio', { name: c.causal[mission][accessGuidedAnswer[mission]], exact: true })
    .check();
  await bench(p).getByRole('button', { name: c.labels.explain, exact: true }).click();
  await expect(bench(p).getByText(c.labels.done, { exact: true })).toBeVisible();
}
async function begin(p: Page) {
  await p
    .getByRole('button', { name: new RegExp(`^(${c.assessment.start}|${c.assessment.retry})$`) })
    .click();
  await p
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
}
async function choose(p: Page, id: keyof typeof accessItemsNb, d: number, r: number) {
  const f = p.locator('.access-lesson .compute-assessment form');
  await f.getByRole('radio', { name: accessItemsNb[id].decisions[d]!, exact: true }).check();
  await f.getByRole('radio', { name: accessItemsNb[id].reasons[r]!, exact: true }).check();
}

test('Part B follows unchanged Identity Part A in the existing path with deep links, history and exact resume', async ({
  page,
}) => {
  await page.goto('/learn/identity?topic=summary');
  await page
    .locator('.course-step-navigation')
    .getByRole('link', { name: new RegExp(c.title) })
    .click();
  await expect(page).toHaveURL(accessHref('introduction'));
  await expect(page.locator('.course-navigation-content')).toContainText(
    c.title.replace('Azure ', ''),
  );
  await page.goto(accessHref('assessment', 'ab01'));
  await begin(page);
  await choose(page, 'ab01', 1, 0);
  const before = await raw(page);
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start a.course-primary')).toHaveAttribute(
    'href',
    accessHref('assessment', 'ab01'),
  );
  expect(await raw(page)).toBe(before);
  await page.locator('.learn-hub-start a.course-primary').click();
  await expect(page).toHaveURL(accessHref('assessment', 'ab01'));
  await expect(page.locator('.compute-assessment h3')).toHaveText(accessItemsNb.ab01.title);
  await page.reload();
  expect((await facts(page)).current).toMatchObject({
    item: 'ab01',
    assisted: false,
    answer: { decision: 1, reason: 0 },
  });
  await expect(page.locator('.compute-assessment h3')).toHaveText(accessItemsNb.ab01.title);
  await page.getByRole('link', { name: 'Fri Portal-sandbox', exact: true }).click();
  await expect(page).toHaveURL(/\/portal/);
  expect(await raw(page)).toBe(before);
  await page.goBack();
  await expect(page).toHaveURL(accessHref('assessment', 'ab01'));
  await expect(page.locator('.compute-feedback')).toHaveCount(0);
});
test('RBAC guide saves permission and inheritance contrasts while actual Sandbox and prior firsts remain read-only', async ({
  page,
}) => {
  let old = applyIdentity(freshIdentity(), { kind: 'begin', item: 'if01' })!;
  old = applyIdentity(old, { kind: 'draft', answer: { decision: 1, reason: 2 } })!;
  old = applyIdentity(old, { kind: 'submit' })!;
  const oldBytes = JSON.stringify(old),
    io = new Map<string, string>(),
    store = new SandboxStore({
      getItem: (k) => io.get(k) ?? null,
      setItem: (k, v) => {
        io.set(k, v);
      },
      removeItem: (k) => {
        io.delete(k);
      },
    });
  store.load();
  expect(
    store.dispatch({
      kind: 'command',
      request: {
        commandId: 'prior-access-group',
        expectedWorldRevision: store.getSnapshot().attempt.engine.world.revision,
        command: {
          type: 'CreateGroup',
          subscriptionId: 'sub-app',
          metadataRegion: 'norwayeast',
          name: 'rg-access-context',
        },
      },
    }),
  ).toBe(true);
  const technical = io.get(sandboxKey)!,
    xp = JSON.stringify({ version: 1, completed: ['organization-mission-v1'] });
  await page.addInitScript(
    ({ oldBytes, key, technical, technicalKey, xp }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, oldBytes);
      if (!localStorage.getItem(technicalKey)) localStorage.setItem(technicalKey, technical);
      if (!localStorage.getItem('azurelab.progress.v1'))
        localStorage.setItem('azurelab.progress.v1', xp);
    },
    { oldBytes, key: identityKey, technical, technicalKey: sandboxKey, xp },
  );
  await page.goto(accessHref('studio') + '&perspective=rbac');
  await bench(page).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await page.getByRole('dialog').press('Escape');
  expect((await facts(page)).guided).toEqual([]);
  await studio(page, 'rbac');
  for (const input of accessContrasts.rbac) await run(page, input);
  await explain(page, 'rbac');
  expect((await facts(page)).completed).toEqual(['rbac']);
  // A known Reader grant must survive the companion role's narrower model boundary.
  for (const [role, second] of [
    ['vm-contributor', 'reader'],
    ['reader', 'vm-contributor'],
  ] as const) {
    await run(page, {
      ...accessContrasts.rbac[0]!,
      role,
      second,
      scope: 'rg-app',
      target: 'account',
      action: 'view',
    });
    await expect(bench(page).locator('.access-flow')).toContainText(c.visual.cause.allowed);
  }
  await bench(page).getByRole('button', { name: c.sandbox.use, exact: true }).click();
  await bench(page)
    .getByRole('combobox', { name: c.labels.predict, exact: true })
    .selectOption('1');
  await bench(page).getByRole('button', { name: c.labels.run, exact: true }).click();
  if (await page.getByRole('dialog').isVisible()) await page.getByRole('dialog').press('Escape');
  expect((await facts(page)).guide?.runs.at(-1)?.input).toMatchObject({
    context: { origin: 'sandbox' },
  });
  await expect(bench(page).locator('.compute-observation')).toContainText('rg-access-context');
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await raw(page, identityKey)).toBe(oldBytes);
  expect(await raw(page, sandboxKey)).toBe(technical);
  expect(await raw(page, 'azurelab.progress.v1')).toBe(xp);
  await page.setViewportSize({ width: 1024, height: 768 });
  await bench(page).locator('.access-result details summary').click();
  const region = bench(page).getByRole('region', { name: c.visual.permission, exact: true });
  await region.focus();
  await expect(region).toBeFocused();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
test('Conditional Access guide distinguishes combined policies, report-only, targeting and four CA/RBAC states', async ({
  page,
}) => {
  await studio(page, 'conditional');
  for (const input of accessContrasts.conditional) await run(page, input);
  await explain(page, 'conditional');
  expect((await facts(page)).completed).toEqual(['conditional']);
  await run(
    page,
    conditional({
      subject: 'managed',
      mfa: true,
      compliant: true,
      authorization: 'vm-contributor',
    }),
  );
  await expect(bench(page).locator('.compute-observation')).toContainText(
    c.visual.caStatus.outside,
  );
  expect((await facts(page)).completed).toEqual(['conditional']);
});
test('paired first, durable Journal help, retry, previous feedback shielding and reload retain their classifications', async ({
  page,
}) => {
  await page.goto(accessHref('assessment', 'ab01'));
  await begin(page);
  await choose(page, 'ab01', 1, 0);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.fail);
  const first = JSON.stringify((await facts(page)).firsts[0]);
  await begin(page);
  await choose(page, 'ab01', 1, 2);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.roles.title);
  expect((await facts(page)).assisted).toBe(true);
  await page.getByRole('dialog').press('Escape');
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.pass);
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
  await page.goto(accessHref('assessment', 'ab02'));
  await begin(page);
  await page.goto(accessHref('assessment', 'ab01'));
  await expect(page.locator('.compute-feedback')).toHaveCount(0);
  expect((await facts(page)).assisted).toBe(false);
  await page.reload();
  expect((await facts(page)).current?.item).toBe('ab02');
});
test('denied assistance, already-open cross-tab Journal, Portal shielding and scoped recovery remain fail-closed', async ({
  page,
}) => {
  const seed = JSON.stringify(applyAccess(freshAccess(), { kind: 'begin', item: 'ab01' }));
  await page.addInitScript(
    ({ key, seed }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, seed);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && sessionStorage.getItem('deny-access') === 'yes') throw Error('denied');
        return set.call(this, k, v);
      };
    },
    { key: accessKey, seed },
  );
  await page.goto(accessHref('assessment', 'ab01'));
  await page.evaluate(() => sessionStorage.setItem('deny-access', 'yes'));
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.roles.title);
  expect(await raw(page)).toBe(seed);
  await page.getByRole('dialog').press('Escape');
  await page.evaluate(() => sessionStorage.removeItem('deny-access'));
  await page.getByRole('button', { name: c.storage.reload, exact: true }).click();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.roles.title);
  const peer = await page.context().newPage();
  await peer.goto('/learn');
  const newer = JSON.stringify(
    applyAccess(JSON.parse((await raw(page))!), {
      kind: 'draft',
      answer: { decision: 2, reason: 1 },
    }),
  );
  await peer.evaluate(({ key, newer }) => localStorage.setItem(key, newer), {
    key: accessKey,
    newer,
  });
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.roles.title);
  expect(await raw(page)).toBe(newer);
  await page.getByRole('dialog').press('Escape');
  await page.goto('/portal');
  await expect(page.locator('.guidance-window')).toHaveCount(0);
  await expect(page.locator('[data-guide-state]')).toHaveCount(0);
  await peer.close();
  await page.evaluate((key) => localStorage.setItem(key, '{broken'), accessKey);
  await page.goto(accessHref('assessment', 'ab01'));
  await page.getByRole('button', { name: c.storage.recover, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.storage.confirm, exact: true })
    .click();
  expect((await facts(page)).attempts).toEqual([]);
});
test('Access Control keyboard, semantic flow, short native briefing, reduced motion and compact views remain readable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await studio(page, 'conditional');
  await run(page, conditional({ compliant: true, authorization: 'vm-contributor' }));
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ] as const) {
    await page.setViewportSize({ width, height });
    const control = bench(page).getByRole('combobox', {
      name: c.controls.authorization,
      exact: true,
    });
    await control.focus();
    await expect(control).toBeFocused();
    await page.keyboard.press('Tab');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
  await bench(page).locator('.access-result details summary').click();
  const region = bench(page).getByRole('region', { name: c.visual.status, exact: true });
  await region.focus();
  await expect(region).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await bench(page).getByRole('button', { name: c.labels.recall, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('region').focus();
  await page.keyboard.press('End');
  await expect(
    dialog.locator('footer').getByRole('button', { name: serverlessNb.close, exact: true }),
  ).toBeVisible();
  await dialog.press('Escape');
  await expect(
    bench(page).getByRole('button', { name: c.labels.recall, exact: true }),
  ).toBeFocused();
});
test('shared teaching preflight hides Benefits before durable aid even when the URL commits first', async ({
  browser,
  baseURL,
}) => {
  for (const denied of [false, true]) {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    const seed = JSON.stringify(
      applyTransfer(freshTransfer(), { kind: 'begin', item: 'accepted-configuration' }),
    );
    await page.addInitScript(
      ({ key, seed, denied }) => {
        localStorage.setItem(key, seed);
        const set = Storage.prototype.setItem;
        Storage.prototype.setItem = function (k, v) {
          if (denied && k === key) throw Error('denied');
          return set.call(this, k, v);
        };
      },
      { key: transferKey, seed, denied },
    );
    await page.goto(transferHref('accepted-configuration'));
    await expect(page.locator('.transfer-workspace')).toBeVisible();
    await page.evaluate((key) => {
      const state = window as unknown as { flush: () => void; unsafe: number };
      const original = window.requestAnimationFrame,
        frames: FrameRequestCallback[] = [];
      state.unsafe = 0;
      window.requestAnimationFrame = (cb) => {
        frames.push(cb);
        return frames.length;
      };
      state.flush = () => {
        window.requestAnimationFrame = original;
        for (const cb of frames) original(cb);
      };
      new MutationObserver(() => {
        if (
          document.querySelector('.expanded-module') &&
          !JSON.parse(localStorage.getItem(key)!).events.some(
            (e: { kind: string }) => e.kind === 'aid',
          )
        )
          state.unsafe++;
      }).observe(document.body, { childList: true, subtree: true });
    }, transferKey);
    await page.getByRole('link', { name: transferNb.help, exact: true }).click();
    await expect(page).toHaveURL(/topic=governance/);
    await expect(
      page.getByRole('heading', { name: managementNb.accessTitle, exact: true }),
    ).toBeVisible();
    await expect(page.locator('.expanded-module')).toHaveCount(0);
    expect(transferFacts(JSON.parse((await raw(page, transferKey))!)).assisted).toBe(false);
    await page.evaluate(() => {
      (window as unknown as { flush: () => void }).flush();
    });
    if (denied) {
      await expect(page.locator('.expanded-module')).toHaveCount(0);
      expect(await raw(page, transferKey)).toBe(seed);
    } else {
      await expect(page.locator('.expanded-module')).toBeVisible();
      expect(transferFacts(JSON.parse((await raw(page, transferKey))!)).assisted).toBe(true);
    }
    expect(await page.evaluate(() => (window as unknown as { unsafe: number }).unsafe)).toBe(0);
    await context.close();
  }
});
