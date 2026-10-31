import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  storageNb as c,
  storageItemsNb,
  nb,
  serverlessNb,
  courseHubNb as h,
} from '../../src/content/nb';
import {
  storageKey,
  storageHref,
  storageFacts,
  freshStorage,
  applyStorage,
  type StorageSave,
  type StorageMission,
} from '../../src/domain/curriculum/storage';
import { SandboxStore, sandboxKey } from '../../src/domain/sandbox/store';
import { freshNetworking, networkingKey } from '../../src/domain/curriculum/networking';
import { openCoursePath } from './course-hub-actions';

const raw = (page: Page, key = storageKey) => page.evaluate((k) => localStorage.getItem(k), key);
const facts = async (page: Page) =>
  storageFacts(JSON.parse((await raw(page)) ?? JSON.stringify(freshStorage())) as StorageSave);
const workbench = (page: Page) => page.locator('.storage-workbench');
async function root(page: Page) {
  await page.goto('/learn');
  await page.locator('.learn-hub-module[data-module="storage"] a').click();
  await expect(page.locator('.storage-lesson [data-activity-heading]')).toHaveText(
    c.topics.introduction,
  );
}
async function lesson(page: Page, topic: keyof typeof c.topics) {
  await openCoursePath(page, 'architecture');
  await page.locator(`#course-activities-storage a[href="${storageHref(topic)}"]`).click();
  await expect(page.locator('.storage-lesson [data-activity-heading]')).toHaveText(c.topics[topic]);
}
async function studio(page: Page, mission: StorageMission) {
  await page.goto(storageHref('studio') + '&perspective=' + mission);
  await workbench(page).getByRole('button', { name: c.labels.begin, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: serverlessNb.start, exact: true })
    .click();
}
async function select(page: Page, label: string, value: string) {
  await workbench(page).getByRole('combobox', { name: label, exact: true }).selectOption(value);
}
async function run(page: Page, prediction = '1', close = true) {
  await select(page, c.labels.predict, prediction);
  await workbench(page).getByRole('button', { name: c.labels.run, exact: true }).click();
  await expect(workbench(page).locator('.compute-observation')).toBeVisible();
  if (close && (await page.getByRole('dialog').isVisible()))
    await page.getByRole('dialog').press('Escape');
}
async function explain(page: Page, mission: StorageMission, index: number) {
  await workbench(page).getByRole('radio', { name: c.causal[mission][index], exact: true }).check();
  await workbench(page).getByRole('button', { name: c.labels.explain, exact: true }).click();
  await expect(workbench(page).getByText(c.labels.done, { exact: true })).toBeVisible();
}
async function beginAssessment(page: Page) {
  await page
    .getByRole('button', { name: new RegExp(`^(${c.assessment.start}|${c.assessment.retry})$`) })
    .click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.assessment.start, exact: true })
    .click();
}
async function choose(page: Page, item: keyof typeof storageItemsNb, d: number, r: number) {
  const form = page.locator('.compute-assessment form');
  await form.getByRole('radio', { name: storageItemsNb[item].decisions[d], exact: true }).check();
  await form.getByRole('radio', { name: storageItemsNb[item].reasons[r], exact: true }).check();
}

test('ordinary Hub integrates Storage after Networking and client/history navigation retains exact active context', async ({
  page,
}) => {
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-path')).toHaveCount(3);
  await expect(page.locator('.course-hub .course-primary')).toHaveCount(1);
  const path = page
    .locator('.learn-hub-path')
    .filter({ has: page.getByRole('heading', { name: h.paths.architecture.title, exact: true }) });
  await expect(path.locator('.learn-hub-module[data-module="storage"]')).toBeVisible();
  await page.locator('.learn-hub-module[data-module="storage"] a').click();
  await expect(page.locator('.course-units a[aria-current="step"]')).toHaveText(
    c.topics.introduction,
  );
  for (const topic of ['blob', 'files', 'queues', 'tables', 'accounts', 'disks'] as const) {
    await lesson(page, topic);
    await expect(
      page.getByRole('heading', { name: c.sections[topic].title, exact: true }),
    ).toBeVisible();
  }
  await page.locator('.course-overview-link').click();
  await page.locator('.learn-hub-module[data-module="cost"] a').click();
  await expect(page.locator('button[aria-controls="course-path-management"]')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await page.goBack();
  await page.goBack();
  await expect(page).toHaveURL(storageHref('disks'));
  await expect(page.locator('.course-units a[aria-current="step"]')).toHaveText(c.topics.disks);
  await expect(page.locator('button[aria-controls="course-path-architecture"]')).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await page.goForward();
  await page.goForward();
  await expect(page).toHaveURL(/learn\/cost/);
  await page.locator('.course-overview-link').click();
  await page.locator('.learn-hub-module[data-module="storage"] a').click();
  await expect(page).toHaveURL(storageHref('disks'));
  await page.reload();
  await expect(page.locator('.course-units a[aria-current="step"]')).toHaveText(c.topics.disks);
  expect((await facts(page)).completed).toEqual([]);
});
test('four workload contracts and a changed image requirement need saved contrasts and a causal explanation', async ({
  page,
}) => {
  await root(page);
  await studio(page, 'design');
  for (const [field, value] of [
    ['documents', 'files'],
    ['jobs', 'queue'],
    ['metadata', 'table'],
  ] as const)
    await select(page, c.model.workloads[field], value);
  await run(page, '2');
  expect((await facts(page)).completed).toEqual([]);
  await select(page, c.labels.imageAccess, 'smb');
  await run(page);
  await expect(workbench(page).locator('.compute-observation')).toContainText(c.model.notMet);
  await select(page, c.model.workloads.images, 'files');
  await run(page, '2');
  await explain(page, 'design', 1);
  expect((await facts(page)).firsts).toEqual([]);
  const saved = await raw(page);
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await raw(page)).toBe(saved);
  await expect(workbench(page).getByText(c.labels.done, { exact: true })).toBeVisible();
  await page
    .locator('.storage-relationships')
    .getByRole('button', { name: c.model.services.table, exact: true })
    .click();
  await expect(page.locator('.storage-relationships table tbody tr')).toHaveCount(2);
  await expect(page.locator('.storage-relationships')).toContainText('PartitionKey');
  await lesson(page, 'summary');
  await expect(page.locator('.storage-summary')).toContainText('1/3');
});
test('account matrix rejects false premium support and distinguishes SSD NFS from unverified region assumptions', async ({
  page,
}) => {
  await studio(page, 'accounts');
  await run(page, '0');
  await expect(workbench(page).locator('.compute-observation')).toContainText(c.model.unsupported);
  await select(page, c.labels.account, 'gpv2');
  await run(page, '2', false);
  await expect(page.getByRole('dialog')).toContainText(c.milestone.accounts.text);
  await page.getByRole('dialog').press('Escape');
  await select(page, c.labels.requested, 'nfs');
  await run(page, '0');
  await select(page, c.labels.account, 'fileHdd');
  await run(page, '0');
  await select(page, c.labels.account, 'fileSsd');
  await run(page, '2');
  await workbench(page).getByRole('checkbox', { name: c.labels.region, exact: true }).uncheck();
  await run(page);
  await expect(workbench(page).locator('.compute-observation')).toContainText(c.model.unverified);
  await explain(page, 'accounts', 0);
  const saved = await raw(page);
  await page.reload();
  expect(await raw(page)).toBe(saved);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await workbench(page)
    .getByRole('button', { name: c.milestone.accounts.title, exact: true })
    .click();
  await expect(page.getByRole('dialog')).toContainText(c.milestone.accounts.text);
});
test('message lifecycle preserves two deliveries, changes only declared application effects and rejects oversized payload', async ({
  page,
}) => {
  await studio(page, 'delivery');
  const before = await raw(page, sandboxKey);
  await run(page);
  await expect(page.locator('.storage-queue-counts dd')).toHaveText(['2', '2']);
  await workbench(page)
    .getByRole('checkbox', { name: c.model.queueLabels.idempotent, exact: true })
    .check();
  await run(page, '2', false);
  await expect(page.getByRole('dialog')).toContainText(c.milestone.delivery.text);
  await page.getByRole('dialog').press('Escape');
  await expect(page.locator('.storage-queue-counts dd')).toHaveText(['2', '1']);
  await select(page, c.model.queueLabels.payload, 'large');
  await run(page, '0');
  await expect(workbench(page).locator('.compute-observation')).toContainText(
    c.model.queueLabels.rejected,
  );
  await explain(page, 'delivery', 2);
  expect(await raw(page, sandboxKey)).toBe(before);
  const saved = await raw(page);
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start a.course-primary')).toHaveAttribute(
    'href',
    storageHref('studio') + '&perspective=delivery',
  );
  await page.locator('.learn-hub-start a.course-primary').click();
  expect(await raw(page)).toBe(saved);
});
test('independent decision with wrong reason fails; durable Journal help and retry never upgrade the first', async ({
  page,
}) => {
  await page.goto(storageHref('assessment', 'sa01'));
  await beginAssessment(page);
  await choose(page, 'sa01', 1, 0);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.fail);
  const first = JSON.stringify((await facts(page)).firsts[0]);
  await beginAssessment(page);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.tables.title);
  expect((await facts(page)).assisted).toBe(true);
  await page.getByRole('dialog').press('Escape');
  await choose(page, 'sa01', 1, 2);
  await page.getByRole('button', { name: c.assessment.submit, exact: true }).click();
  await expect(page.locator('.compute-feedback')).toContainText(c.assessment.pass);
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
  await page.getByRole('combobox', { name: c.assessment.case, exact: true }).selectOption('sa03');
  await beginAssessment(page);
  expect((await facts(page)).current).toMatchObject({ item: 'sa03', retry: true, assisted: false });
  await page.goto('/learn');
  await expect(page.locator('.learn-hub-start a.course-primary')).toHaveAttribute(
    'href',
    storageHref('assessment', 'sa03'),
  );
  expect((await facts(page)).assisted).toBe(false);
  await page.locator('.learn-hub-start a.course-primary').click();
  await page
    .getByRole('combobox', { name: c.assessment.case, exact: true })
    .isDisabled()
    .then((x) => expect(x).toBe(true));
  await page.goto(storageHref('assessment', 'sa01'));
  await expect(page.locator('.compute-feedback')).toBeVisible();
  expect((await facts(page)).current).toMatchObject({ item: 'sa03', assisted: true });
  await page.reload();
  expect(JSON.stringify((await facts(page)).firsts[0])).toBe(first);
});
test('denied assistance withholds Journal and all teaching; already-open Journal withholds newer-tab conflict without merging', async ({
  page,
}) => {
  const seed = JSON.stringify(applyStorage(freshStorage(), { kind: 'begin', item: 'sa08' }));
  await page.addInitScript(
    ({ key, seed }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, seed);
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && sessionStorage.getItem('deny-storage-aid') === 'yes')
          throw Error('denied');
        return set.call(this, k, v);
      };
    },
    { key: storageKey, seed },
  );
  await page.goto(storageHref('assessment', 'sa08'));
  await page.evaluate(() => sessionStorage.setItem('deny-storage-aid', 'yes'));
  const before = await raw(page);
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.blob.title);
  expect(await raw(page)).toBe(before);
  expect((await facts(page)).assisted).toBe(false);
  await page.getByRole('dialog').press('Escape');
  await page.evaluate(() => sessionStorage.removeItem('deny-storage-aid'));
  await page.getByRole('button', { name: c.storage.reload, exact: true }).click();
  await page.getByRole('button', { name: nb.course.journal, exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText(c.sections.blob.title);
  expect((await facts(page)).assisted).toBe(true);
  const peer = await page.context().newPage();
  await peer.goto('/learn');
  const save = JSON.parse((await raw(page))!) as StorageSave;
  const newer = JSON.stringify(
    applyStorage(save, { kind: 'draft', answer: { decision: 0, reason: 1 } }),
  );
  await peer.evaluate(({ key, newer }) => localStorage.setItem(key, newer), {
    key: storageKey,
    newer,
  });
  await expect(page.getByRole('dialog')).not.toContainText(c.sections.blob.title);
  expect(await raw(page)).toBe(newer);
  await expect(
    page.getByRole('dialog').getByRole('button', { name: c.storage.reload, exact: true }),
  ).toBeVisible();
  await peer.close();
});
test('actual VM disks remain authoritative and conceptual Storage runs never create resources; scoped recovery retains older data', async ({
  page,
}) => {
  const values = new Map<string, string>(),
    store = new SandboxStore({
      getItem: (k) => values.get(k) ?? null,
      setItem: (k, v) => {
        values.set(k, v);
      },
      removeItem: (k) => {
        values.delete(k);
      },
    });
  store.load();
  for (const command of [
    {
      type: 'CreateGroup',
      name: 'rg-storage-context',
      subscriptionId: 'sub-shared',
      metadataRegion: 'norwayeast',
    },
    {
      type: 'CreateVmBundle',
      groupId: '',
      name: 'vm-storage',
      region: 'northeurope',
      image: 'ubuntu-22-04',
      profile: 'small',
      dataDiskGiB: '32',
      subnetId: '',
    },
  ] as const) {
    const v = store.getSnapshot();
    store.dispatch({
      kind: 'command',
      request: {
        commandId: 'storage-seed-' + v.attempt.engine.ledger.length,
        expectedWorldRevision: v.attempt.engine.world.revision,
        command:
          command.type === 'CreateVmBundle'
            ? { ...command, groupId: v.attempt.engine.world.groups[0]!.id }
            : command,
      },
      bindResult: false,
    });
  }
  expect(store.getSnapshot().attempt.engine.ledger.map((e) => e.receipt.outcome)).toEqual([
    'accepted',
    'accepted',
  ]);
  const technical = values.get(sandboxKey)!,
    older = JSON.stringify(freshNetworking());
  await page.addInitScript(
    ({ technical, older, key, net }) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, technical);
      if (!localStorage.getItem(net)) localStorage.setItem(net, older);
    },
    { technical, older, key: sandboxKey, net: networkingKey },
  );
  await page.goto(storageHref('disks'));
  await expect(page.locator('.storage-actual-context')).toContainText('vm-storage');
  await expect(page.locator('.storage-actual-context')).toContainText('OS disk');
  await expect(page.locator('.storage-actual-context')).not.toContainText(c.model.noDisk);
  await studio(page, 'delivery');
  await run(page);
  expect(await raw(page, sandboxKey)).toBe(technical);
  expect(await raw(page, networkingKey)).toBe(older);
  await page.evaluate((key) => localStorage.setItem(key, '{broken'), storageKey);
  await page.reload();
  await page.goto(storageHref('assessment'));
  await page.getByRole('button', { name: c.storage.recover, exact: true }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: c.storage.confirm, exact: true })
    .click();
  expect(await raw(page, networkingKey)).toBe(older);
  expect(await raw(page, sandboxKey)).toBe(technical);
  expect((await facts(page)).completed).toEqual([]);
});
test('Storage compact briefing, keyboard, reduced motion and semantic controls stay readable across desktop and short views', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await studio(page, 'accounts');
  await run(page, '0');
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1024, 768],
    [1024, 500],
    [800, 700],
  ] as const) {
    await page.setViewportSize({ width, height });
    const target = workbench(page).getByRole('combobox', { name: c.labels.account, exact: true });
    await target.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await target.focus();
    await expect(target).toBeFocused();
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);
    const primary = workbench(page).getByRole('button', { name: c.labels.run, exact: true });
    await primary.hover();
    await expect(primary).toHaveCSS('background-color', 'rgb(7, 85, 149)');
    await expect(primary).toHaveCSS('color', 'rgb(255, 255, 255)');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.mouse.move(0, 0);
    await primary.focus();
    await expect(primary).toBeFocused();
    await expect(primary).toHaveCSS('outline-style', 'solid');
    await expect(primary).toHaveCSS('outline-width', '3px');
  }
  await workbench(page).getByRole('button', { name: c.labels.recall, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('region')).toBeVisible();
  await dialog.getByRole('region').focus();
  await page.keyboard.press('End');
  await expect(
    dialog.locator('footer').getByRole('button', { name: serverlessNb.close, exact: true }),
  ).toBeVisible();
  await dialog.press('Escape');
  await expect(
    workbench(page).getByRole('button', { name: c.labels.recall, exact: true }),
  ).toBeFocused();
});
