import { expect, type Page } from '@playwright/test';
import { nb, labsNb, courseHubNb } from '../../src/content/nb';

export async function openPathActivities(
  page: Page,
  path: 'cloud' | 'architecture' | 'management',
) {
  const details = page.locator(`.learn-hub-path:has(#learn-hub-${path}-title) details`);
  if (!(await details.getAttribute('open'))) {
    if (!(await details.evaluate((el) => (el as HTMLDetailsElement).open)))
      await details.locator('summary').click();
  }
  await expect(details).toHaveAttribute('open', '');
}

export async function openCoursePath(page: Page, path: 'cloud' | 'architecture' | 'management') {
  const toggle = page.locator(`button[aria-controls="course-path-${path}"]`);
  if (!(await toggle.isVisible()))
    await page.getByRole('button', { name: nb.course.learning, exact: true }).click();
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
}

/** The existing current lab is now discovered inside its learning path. */
export async function openServiceLab(page: Page, kind: 'iaas' | 'paas' | 'saas') {
  await openPathActivities(page, 'cloud');
  const link = page
    .getByRole('navigation', { name: courseHubNb.serviceLabs, exact: true })
    .getByRole('link', { name: `${labsNb.models[kind]} · ${labsNb.title}`, exact: true });
  await expect(link).toHaveAttribute(
    'href',
    `/learn/services?topic=${kind}&activity=practical&version=2`,
  );
  await link.click();
}
