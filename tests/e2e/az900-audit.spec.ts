import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { nb } from '../../src/content/nb';
import { auditReviewHref } from '../../src/features/course/audit-review';

test('ordinary course stays unchanged and preview audit navigation cannot write learning records', async ({
  page,
}, info) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/learn$/);
  await expect(page.getByRole('heading', { name: nb.course.title, exact: true })).toBeVisible();
  const before = await page.evaluate(() => ({ ...localStorage }));
  const review = page.getByRole('complementary', { name: nb.auditReview.title, exact: true });
  const href = auditReviewHref(
    process.env.VERCEL_ENV,
    process.env.VERCEL_GIT_COMMIT_REF,
    process.env.VERCEL_GIT_COMMIT_SHA,
  );
  if (href) {
    await expect(review).toBeVisible();
    const link = review.getByRole('link', { name: nb.auditReview.open, exact: true });
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
    await link.focus();
    await expect(link).toBeFocused();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  } else {
    await expect(review).toHaveCount(0);
  }
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(before);
  await page.reload();
  await expect(page).toHaveURL(/\/learn$/);
  expect(await page.evaluate(() => ({ ...localStorage }))).toEqual(before);
  await page.screenshot({ path: info.outputPath('audit-course-entry.png') });
});
