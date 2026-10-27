import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { transferNb as c, managementNb, nb, labsNb } from '../../src/content/nb';
import {
  applyTransfer,
  freshTransfer,
  transferFacts,
  transferItems,
  transferKey,
  transferHref,
  type TransferSave,
  type TransferItemId,
} from '../../src/domain/curriculum/transfer';
import { fresh as freshExpansion, expansionKeys } from '../../src/domain/curriculum/expansion';
import {
  freshPractical,
  applyPractical,
  practicalKey,
  type LabKind,
} from '../../src/domain/sandbox/practical';
import { courseKey, freshCourse } from '../../src/domain/course/model';
test.setTimeout(90000);
const add = (s: TransferSave, e: unknown) => applyTransfer(s, e)!;
const practicalFixture = (kind: LabKind, mode: 'guided' | 'independent') =>
  applyPractical(freshPractical(), {
    type: 'start',
    kind,
    mode,
    origin: { module: 'services', topic: kind === 'vm' ? 'iaas' : kind },
    attempt: 1,
    boundary: null,
  })!;
async function state(page: Page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), transferKey);
}
async function start(page: Page, id: TransferItemId) {
  await page.goto('/');
  await page
    .locator('.transfer-entry')
    .getByRole('link', {
      name: new RegExp(
        ` · ${transferItems[id].module === 'computing' ? '01' : transferItems[id].module === 'benefits' ? '02' : '03'}$`,
      ),
    })
    .click();
  await page
    .getByRole('navigation', { name: c.choose })
    .getByRole('link', { name: c.items[id].title, exact: true })
    .click();
  await expect(page.getByText(c.items[id].situation, { exact: true })).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page
    .locator('.transfer-workspace')
    .getByRole('button', { name: c.start, exact: true })
    .click();
  const dialog = page.getByRole('dialog', { name: c.briefingTitle });
  await expect(dialog).toContainText(c.rules);
  await dialog.getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.locator('.transfer-workspace')).toContainText(c.draft);
  if (transferItems[id].module === 'services') {
    await expect(page.locator('.course-guide-note')).toHaveCount(0);
    await expect(page.getByText(nb.course.theoryGuide, { exact: true })).toHaveCount(0);
  }
}
async function answer(page: Page, id: TransferItemId, decision: number, reason: number) {
  await page.getByRole('radio', { name: c.items[id].decisions[decision], exact: true }).check();
  await page.getByRole('radio', { name: c.items[id].reasons[reason], exact: true }).check();
  await page.getByRole('button', { name: c.submit, exact: true }).click();
}
test('root → computing transfer → draft reload → correct first → exact repetition → family retry', async ({
  page,
}) => {
  await start(page, 'public-information');
  await expect(page.locator('.transfer-workspace')).not.toContainText(
    c.items['public-information'].decisive,
  );
  await page
    .getByRole('radio', { name: c.items['public-information'].decisions[1], exact: true })
    .check();
  await page.reload();
  await expect(
    page.getByRole('radio', { name: c.items['public-information'].decisions[1], exact: true }),
  ).toBeChecked();
  await answer(page, 'public-information', 1, 2);
  await expect(page.locator('.transfer-feedback')).toContainText(c.passed);
  const first = transferFacts(await state(page)).submitted[0]!;
  expect(first).toMatchObject({ assisted: false, retry: false });
  await page
    .locator('.transfer-feedback')
    .getByRole('link', { name: c.repeat, exact: true })
    .click();
  await expect(page).toHaveURL(/topic=v2-models/);
  await page.goto(transferHref('exclusive-research'));
  await page
    .locator('.transfer-workspace')
    .getByRole('button', { name: c.start, exact: true })
    .click();
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  expect(transferFacts(await state(page)).current?.retry).toBe(true);
  await page.getByRole('button', { name: c.abandon, exact: true }).click();
  expect(transferFacts(await state(page)).submitted[0]).toEqual(first);
});
test('Benefits wrong first has selected-specific feedback, then durable theory help and retry without XP', async ({
  page,
}) => {
  await start(page, 'accepted-configuration');
  const old = await page.evaluate(() =>
    Object.fromEntries(
      Object.entries(localStorage).filter(
        ([k]) => k !== 'azurelab.learning.cloud-transfer.v1' && k !== 'azurelab.course.v1',
      ),
    ),
  );
  await answer(page, 'accepted-configuration', 1, 0);
  await expect(page.locator('.transfer-feedback')).toContainText(c.failed);
  await expect(page.locator('.transfer-feedback')).toContainText(
    c.items['accepted-configuration'].decisionFeedback[1],
  );
  const first = transferFacts(await state(page)).submitted[0];
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('link', { name: c.help, exact: true }).click();
  await expect(page).toHaveURL(/topic=governance/);
  expect(transferFacts(await state(page)).current?.assisted).toBe(true);
  await page.goto(transferHref('accepted-configuration'));
  await answer(page, 'accepted-configuration', 0, 1);
  expect(transferFacts(await state(page)).submitted[0]).toEqual(first);
  expect(transferFacts(await state(page)).submitted[1]).toMatchObject({
    assisted: true,
    retry: true,
  });
  expect(
    await page.evaluate(
      (keys) => Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)])),
      Object.keys(old),
    ),
  ).toEqual(old);
});
test('Service Types accepts both valid hosts with matching reasons and preserves wrong pair feedback', async ({
  page,
}) => {
  await start(page, 'two-valid-hosts');
  await answer(page, 'two-valid-hosts', 1, 1);
  await expect(page.locator('.transfer-feedback')).toContainText(c.failed);
  for (const [d, r] of [
    [1, 0],
    [2, 1],
  ]) {
    await page.getByRole('button', { name: c.start, exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
    await expect(page.locator('.transfer-scenario h3')).toBeFocused();
    await answer(page, 'two-valid-hosts', d!, r!);
    await expect(page.locator('.transfer-feedback')).toContainText(c.passed);
  }
  expect(transferFacts(await state(page)).submitted.map((a) => a.answer)).toEqual([
    { decision: 1, reason: 1 },
    { decision: 1, reason: 0 },
    { decision: 2, reason: 1 },
  ]);
  await page.getByRole('button', { name: c.history, exact: true }).click();
  const history = page.locator('.transfer-history');
  await expect(
    history.getByRole('combobox', { name: c.selectSubmission, exact: true }),
  ).toHaveValue('1');
  await expect(history.locator('.transfer-feedback')).toContainText(c.failed);
  await history.getByRole('combobox', { name: c.selectSubmission, exact: true }).selectOption('3');
  await expect(history.locator('.transfer-feedback')).toContainText(c.passed);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
test('historical transfer feedback is withheld on denied old-context assistance and after an open cross-tab conflict', async ({
  page,
  context,
}) => {
  let s = add(freshTransfer(), { kind: 'begin', item: 'public-information' });
  s = add(s, { kind: 'draft', answer: { decision: 1, reason: 2 } });
  s = add(s, { kind: 'submit' });
  const raw = JSON.stringify(s),
    benefitRaw = JSON.stringify({ ...freshExpansion('benefits'), events: [{ kind: 'begin' }] });
  await page.addInitScript(
    ({ key, raw, bkey, br }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, raw);
      if (!localStorage.getItem(bkey)) localStorage.setItem(bkey, br);
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === bkey) throw new DOMException('denied', 'QuotaExceededError');
        original.call(this, k, v);
      };
    },
    { key: transferKey, raw, bkey: expansionKeys.benefits, br: benefitRaw },
  );
  await page.goto(transferHref('public-information'));
  await expect(page.locator('.transfer-feedback')).toHaveCount(0);
  await expect(page.getByText(c.items['public-information'].decisive, { exact: true })).toHaveCount(
    0,
  );
  expect(await page.evaluate((k) => localStorage.getItem(k), expansionKeys.benefits)).toBe(
    benefitRaw,
  );
  expect(JSON.stringify(await state(page))).toBe(raw);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const other = await context.newPage();
  await other.goto('/');
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: expansionKeys.benefits,
    raw: JSON.stringify({
      ...freshExpansion('benefits'),
      events: [{ kind: 'begin' }, { kind: 'abandon' }],
    }),
  });
  await page.getByRole('button', { name: managementNb.accessReload, exact: true }).first().click();
  await expect(page.locator('.transfer-feedback')).toBeVisible();
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
    key: expansionKeys.benefits,
    raw: benefitRaw,
  });
  await expect(page.locator('.transfer-feedback')).toHaveCount(0);
  await expect(page.getByText(c.items['public-information'].decisive, { exact: true })).toHaveCount(
    0,
  );
  expect(JSON.stringify(await state(page))).toBe(raw);
  await other.close();
});
test('own history, Journal and old theory require durable aid; rejected writes never expose solutions', async ({
  page,
}) => {
  await start(page, 'public-information');
  await answer(page, 'public-information', 1, 2);
  await page.goto(transferHref('exclusive-research'));
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  const before = await state(page);
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new DOMException('denied', 'QuotaExceededError');
      original.call(this, k, v);
    };
  }, transferKey);
  await page.getByRole('button', { name: c.history, exact: true }).click();
  await expect(page.locator('.transfer-feedback')).toHaveCount(0);
  expect(await state(page)).toEqual(before);
  await page.reload();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(transferFacts(await state(page)).assisted).toBe(true);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: c.history, exact: true }).click();
  await expect(page.locator('.transfer-feedback')).toBeVisible();
  expect(transferFacts(await state(page)).assisted).toBe(true);
});
test('remaining unfamiliar contexts render and evaluate their actual structured relationships', async ({
  page,
}) => {
  const cases: [TransferItemId, number, number][] = [
    ['exclusive-research', 0, 0],
    ['integrated-production', 2, 1],
    ['campaign-pricing', 1, 2],
    ['baseline-pricing', 0, 1],
    ['batch-pricing', 2, 0],
    ['memory-capacity', 1, 2],
    ['route-replica', 0, 1],
    ['shared-payment', 2, 1],
    ['parallel-demand', 0, 1],
    ['recovery-evidence', 1, 0],
    ['forecast-change', 2, 0],
    ['signed-in-operator', 1, 2],
    ['manual-drift', 2, 0],
    ['repeatable-error', 0, 1],
    ['kernel-workload', 1, 2],
    ['ready-collaboration', 0, 1],
  ];
  for (const [id, d, r] of cases) {
    await page.goto(transferHref(id));
    await page
      .locator('.transfer-workspace')
      .getByRole('button', { name: c.start, exact: true })
      .click();
    await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
    await expect(page.locator('.transfer-workspace')).not.toContainText(c.items[id].decisive);
    await answer(page, id, d, r);
    await expect(page.locator('.transfer-feedback')).toContainText(c.passed);
    await expect(page.locator('.transfer-feedback')).toContainText(c.items[id].reasonFeedback[r]!);
  }
  expect(transferFacts(await state(page)).submitted).toHaveLength(cases.length);
});
test('another module cannot silently move an active draft or render a different problem', async ({
  page,
}) => {
  await start(page, 'public-information');
  const before = await state(page);
  await page.goto('/learn/benefits?topic=transfer');
  await expect(page.locator('.transfer-workspace')).toContainText(c.activeElsewhere);
  await expect(page.getByRole('radio')).toHaveCount(0);
  expect(await state(page)).toEqual(before);
  await page
    .locator('.transfer-workspace')
    .getByRole('link', { name: c.resume, exact: true })
    .click();
  await expect(page).toHaveURL(/learn\/computing\?topic=transfer&case=cc01/);
  await expect(page.getByRole('radio')).toHaveCount(6);
  expect(await state(page)).toEqual(before);
});
test('existing all-data deletion still requires confirmation and includes only the intended transfer lifecycle', async ({
  page,
}) => {
  await start(page, 'public-information');
  const before = await state(page);
  await page.goto('/progress');
  await page.getByRole('button', { name: nb.progress.reset, exact: true }).click();
  await page.getByRole('button', { name: nb.progress.cancel, exact: true }).click();
  expect(await state(page)).toEqual(before);
  await page.getByRole('button', { name: nb.progress.reset, exact: true }).click();
  await page.getByRole('button', { name: nb.progress.confirm, exact: true }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), transferKey)).toBeNull();
  await page.goto(transferHref('public-information'));
  await expect(page.getByRole('button', { name: c.start, exact: true })).toBeVisible();
  await expect(page.getByRole('radio')).toHaveCount(0);
  await page.reload();
  expect(await page.evaluate((k) => localStorage.getItem(k), transferKey)).toBeNull();
});
test('a historical Service Types preference does not hide the new explicit transfer route or rewrite that choice', async ({
  page,
}) => {
  const key = expansionKeys.services,
    raw = JSON.stringify({
      ...freshExpansion('services'),
      events: [{ kind: 'choose', version: 'v1' }],
    });
  await page.addInitScript(
    ({ key, raw }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, raw);
    },
    { key, raw },
  );
  await start(page, 'two-valid-hosts');
  await expect(page).toHaveURL(/learn\/services\?topic=transfer/);
  expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(raw);
  expect(transferFacts(await state(page)).active).toBe(true);
});
test('briefing cancel and recall preserve records; keyboard submission and post-result contrast remain accessible', async ({
  page,
}) => {
  await page.goto(transferHref('public-information'));
  const before = await page.evaluate((k) => localStorage.getItem(k), transferKey);
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.cancel, exact: true }).click();
  expect(await page.evaluate((k) => localStorage.getItem(k), transferKey)).toBe(before);
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  const begun = await state(page);
  await page.getByRole('button', { name: c.briefingOpen, exact: true }).click();
  await page.keyboard.press('Escape');
  expect(await state(page)).toEqual(begun);
  await page
    .getByRole('radio', { name: c.items['public-information'].decisions[1], exact: true })
    .focus();
  await page.keyboard.press('Space');
  await page
    .getByRole('radio', { name: c.items['public-information'].reasons[2], exact: true })
    .focus();
  await page.keyboard.press('Space');
  await page.getByRole('button', { name: c.submit, exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.transfer-feedback')).toContainText(c.passed);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(transferFacts(await state(page)).submitted[0]).toMatchObject({
    assisted: false,
    retry: false,
  });
  const durable = await state(page);
  await page.goto(transferHref('campaign-pricing'));
  await page.getByRole('button', { name: c.start, exact: true }).click();
  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new DOMException('denied', 'QuotaExceededError');
      original.call(this, k, v);
    };
  }, transferKey);
  await page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText(c.issue);
  await expect(
    page.getByRole('dialog').getByRole('button', { name: c.start, exact: true }),
  ).toBeDisabled();
  expect(await state(page)).toEqual(durable);
  await page.getByRole('dialog').getByRole('button', { name: c.cancel, exact: true }).click();
  await expect(page.getByRole('button', { name: c.load, exact: true })).toBeFocused();
});
test('cross-tab stale drafts hold; scoped corrupt recovery cannot remove another valid record', async ({
  page,
  context,
}) => {
  await start(page, 'public-information');
  const other = await context.newPage();
  await other.goto(transferHref('public-information'));
  await other
    .getByRole('radio', { name: c.items['public-information'].decisions[1], exact: true })
    .check();
  await expect(page.locator('.transfer-recovery')).toContainText('conflict');
  await page.getByRole('button', { name: c.load, exact: true }).click();
  await expect(
    page.getByRole('radio', { name: c.items['public-information'].decisions[1], exact: true }),
  ).toBeChecked();
  const valid = JSON.stringify(await state(page));
  await page.evaluate((k) => localStorage.setItem(k, 'broken'), transferKey);
  await page.reload();
  await page.getByRole('button', { name: c.recovery, exact: true }).click();
  await other.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: transferKey, v: valid });
  await expect(page.getByRole('button', { name: c.confirm, exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: c.load, exact: true }).click();
  expect(JSON.stringify(await state(page))).toBe(valid);
  await expect(
    page.getByRole('radio', { name: c.items['public-information'].decisions[1], exact: true }),
  ).toBeChecked();
  await other.close();
});
for (const older of ['benefits', 'practical', 'none'] as const) {
  test(`root Resume preserves active ${older} priority before inactive exact transfer fallback`, async ({
    page,
  }) => {
    let saved = add(freshTransfer(), { kind: 'begin', item: 'baseline-pricing' });
    saved = add(saved, { kind: 'draft', answer: { decision: 0, reason: 1 } });
    saved = add(saved, { kind: 'submit' });
    const raw = JSON.stringify(saved),
      course = JSON.stringify({
        ...freshCourse(),
        resume: { module: 'computing', topic: 'transfer' },
      }),
      benefits =
        older === 'benefits'
          ? JSON.stringify({ ...freshExpansion('benefits'), events: [{ kind: 'begin' }] })
          : null,
      practical =
        older === 'practical' ? JSON.stringify(practicalFixture('vm', 'independent')) : null;
    await page.addInitScript(
      ({ key, raw, ckey, course, bkey, benefits, pkey, practical }) => {
        localStorage.setItem(key, raw);
        localStorage.setItem(ckey, course);
        if (benefits) localStorage.setItem(bkey, benefits);
        if (practical) localStorage.setItem(pkey, practical);
      },
      {
        key: transferKey,
        raw,
        ckey: courseKey,
        course,
        bkey: expansionKeys.benefits,
        benefits,
        pkey: practicalKey,
        practical,
      },
    );
    await page.goto('/');
    const href =
      older === 'benefits'
        ? '/learn/benefits?topic=assessment'
        : older === 'practical'
          ? '/portal?area=home&practice=vm'
          : transferHref('baseline-pricing');
    const resume = page.locator('.course-intro .course-primary');
    await expect(resume).toHaveAttribute('href', href);
    expect(JSON.stringify(await state(page))).toBe(raw);
    if (benefits)
      expect(await page.evaluate((k) => localStorage.getItem(k), expansionKeys.benefits)).toBe(
        benefits,
      );
    if (practical)
      expect(await page.evaluate((k) => localStorage.getItem(k), practicalKey)).toBe(practical);
    await resume.click();
    await expect(page).toHaveURL(href);
    expect(JSON.stringify(await state(page))).toBe(raw);
    if (benefits)
      expect(await page.evaluate((k) => localStorage.getItem(k), expansionKeys.benefits)).toBe(
        benefits,
      );
    if (practical)
      expect(await page.evaluate((k) => localStorage.getItem(k), practicalKey)).toBe(practical);
  });
}

test('blocked course Summary retains a semantic page heading without exposing answers or changing denied storage', async ({
  page,
}) => {
  const raw = JSON.stringify(add(freshTransfer(), { kind: 'begin', item: 'public-information' }));
  await page.addInitScript(
    ({ key, raw }) => {
      localStorage.setItem(key, raw);
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key) throw new DOMException('denied', 'QuotaExceededError');
        original.call(this, k, v);
      };
    },
    { key: transferKey, raw },
  );
  await page.goto('/learn/benefits?topic=summary');
  await expect(
    page.getByRole('heading', { level: 1, name: managementNb.accessTitle, exact: true }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(JSON.stringify(await state(page))).toBe(raw);
});

test('standalone SaaS withholds authored guidance on denied aid and already-open cross-tab conflicts', async ({
  page,
  context,
}) => {
  const raw = JSON.stringify(add(freshTransfer(), { kind: 'begin', item: 'ready-collaboration' })),
    practical = JSON.stringify(practicalFixture('saas', 'guided'));
  await page.addInitScript(
    ({ key, raw, pkey, practical }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, raw);
      if (localStorage.getItem(pkey) === null) localStorage.setItem(pkey, practical);
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key) throw new DOMException('denied', 'QuotaExceededError');
        original.call(this, k, v);
      };
    },
    { key: transferKey, raw, pkey: practicalKey, practical },
  );
  await page.goto('/labs/saas');
  await expect(page.locator('.saas-admin-section')).not.toHaveCount(0);
  await expect(page.getByText(labsNb.saas.retained, { exact: true })).toHaveCount(0);
  await expect(page.locator('.saas-learning .savvy')).toHaveCount(0);
  await expect(page.locator('.practical-criteria')).toHaveCount(0);
  expect(JSON.stringify(await state(page))).toBe(raw);
  expect(await page.evaluate((k) => localStorage.getItem(k), practicalKey)).toBe(practical);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const other = await context.newPage();
  await other.goto('/');
  await other.evaluate(
    (key) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          schema: 1,
          content: '1.0.0',
          model: '1.0.0',
          rubric: '1.0.0',
          events: [],
        }),
      ),
    transferKey,
  );
  await page.getByRole('button', { name: managementNb.accessReload, exact: true }).first().click();
  await expect(page.getByText(labsNb.saas.retained, { exact: true })).toBeVisible();
  await expect(page.locator('.saas-learning .savvy')).toBeVisible();
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: transferKey, raw });
  await expect(page.getByText(labsNb.saas.retained, { exact: true })).toHaveCount(0);
  await expect(page.locator('.saas-learning .savvy')).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await expect(page.locator('.practical-criteria')).toHaveCount(0);
  expect(await page.evaluate((k) => localStorage.getItem(k), practicalKey)).toBe(practical);
  await other.close();
});

test('corrupt SaaS transfer context recovers only its key and active assistance never re-enables automatic hints', async ({
  page,
}) => {
  const practical = JSON.stringify(practicalFixture('saas', 'guided'));
  await page.addInitScript(
    ({ key, pkey, practical }) => {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, 'broken');
      if (localStorage.getItem(pkey) === null) localStorage.setItem(pkey, practical);
    },
    { key: transferKey, pkey: practicalKey, practical },
  );
  await page.goto('/labs/saas');
  await expect(page.getByText(labsNb.saas.retained, { exact: true })).toHaveCount(0);
  await expect(page.locator('.saas-learning .savvy')).toHaveCount(0);
  await page.getByRole('button', { name: c.recovery, exact: true }).first().click();
  await page.getByRole('button', { name: c.confirm, exact: true }).first().click();
  await expect(page.getByText(labsNb.saas.retained, { exact: true })).toBeVisible();
  const active = JSON.stringify(
    add(freshTransfer(), { kind: 'begin', item: 'ready-collaboration' }),
  );
  await page.evaluate(({ key, active }) => localStorage.setItem(key, active), {
    key: transferKey,
    active,
  });
  await page.reload();
  await expect.poll(async () => transferFacts(await state(page)).assisted).toBe(true);
  await expect(page.getByText(labsNb.saas.retained, { exact: true })).toBeVisible();
  await expect(page.locator('.saas-learning .savvy')).toHaveCount(0);
  expect(await page.evaluate((k) => localStorage.getItem(k), practicalKey)).toBe(practical);
});

test('old aided Portal practical feedback cannot bypass transfer preflight while own terminal controls remain available', async ({
  page,
}) => {
  const session = applyPractical(practicalFixture('paas', 'independent'), { type: 'aid' })!,
    practical = JSON.stringify(applyPractical(session, { type: 'reason', value: 'customer-code' })),
    raw = JSON.stringify(add(freshTransfer(), { kind: 'begin', item: 'two-valid-hosts' }));
  await page.addInitScript(
    ({ key, raw, pkey, practical }) => {
      localStorage.setItem(key, raw);
      localStorage.setItem(pkey, practical);
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key) throw new DOMException('denied', 'QuotaExceededError');
        original.call(this, k, v);
      };
    },
    { key: transferKey, raw, pkey: practicalKey, practical },
  );
  await page.goto('/portal?area=home&mode=independent&practice=paas');
  await expect(page.locator('.portal-independent-practical')).toBeVisible();
  await expect(page.getByText(labsNb.feedback.paas, { exact: true })).toHaveCount(0);
  await expect(page.locator('.practical-criteria')).toHaveCount(0);
  await expect(
    page.getByRole('radio', { name: labsNb.reasons.paas[0][1], exact: true }),
  ).toBeChecked();
  await expect(page.getByRole('button', { name: labsNb.abandon, exact: true })).toBeEnabled();
  expect(JSON.stringify(await state(page))).toBe(raw);
  expect(await page.evaluate((k) => localStorage.getItem(k), practicalKey)).toBe(practical);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('full valid history explains its bound, preserves firsts and keeps submitted feedback accessible', async ({
  page,
}) => {
  let save = freshTransfer();
  for (let i = 0; i < 399; i++) {
    save = add(save, { kind: 'begin', item: 'public-information' });
    save = add(save, { kind: 'draft', answer: { decision: 1, reason: 2 } });
    save = add(save, { kind: 'submit' });
  }
  const raw = JSON.stringify(save);
  await page.addInitScript(({ key, raw }) => localStorage.setItem(key, raw), {
    key: transferKey,
    raw,
  });
  await page.goto('/');
  await page
    .locator('.transfer-entry')
    .getByRole('link', { name: / · 01$/ })
    .click();
  await expect(page.getByText(c.capacityStart, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: c.start, exact: true })).toBeDisabled();
  await page.getByRole('button', { name: c.history, exact: true }).click();
  await expect(page.locator('.transfer-history .transfer-feedback')).toContainText(c.passed);
  await expect(page.locator('.transfer-history .transfer-feedback')).toHaveCount(1);
  expect(JSON.stringify(await state(page))).toBe(raw);
  await page.getByRole('link', { name: c.previous, exact: true }).click();
  await expect(page).toHaveURL(/topic=v2-models/);
  expect(JSON.stringify(await state(page))).toBe(raw);
});

test('desktop compositions, short-window briefing, keyboard, reduced motion and Axe retain visible instructions', async ({
  page,
  baseURL,
}, info) => {
  const external: string[] = [];
  const origin = new URL(baseURL!).origin;
  page.on('request', (r) => {
    if (/^https?:/.test(r.url()) && new URL(r.url()).origin !== origin) external.push(r.url());
  });
  await start(page, 'route-replica');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 560],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await expect(page.getByRole('button', { name: c.submit, exact: true })).toBeAttached();
    await page.getByRole('button', { name: c.abandon, exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: c.abandon, exact: true })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: info.outputPath(`transfer-${width}-${height}.png`),
      fullPage: false,
    });
  }
  await page.getByRole('button', { name: c.briefingOpen, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: c.briefingOpen, exact: true })).toBeFocused();
  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
  expect(external).toEqual([]);
});
