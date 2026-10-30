import { expect, type Page } from '@playwright/test';
import { nb } from '../../src/content/nb';

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
