import { type Page } from '@playwright/test';
import { cloudChapterFor } from '../../src/features/course/cloud-computing-chapters';
/** Use the actual secondary part entry, retaining historical URL tests. */
export async function openCloudPart(page: Page, topic: string) {
  const chapter = cloudChapterFor(topic);
  if (chapter) {
    const item = page
      .locator(`#course-activities-computing > li`)
      .filter({ has: page.locator(`a[href="/learn/computing?topic=${chapter.topic}"]`).first() })
      .first();
    const parts = item.locator('.cloud-chapter-subtopics');
    if ((await parts.count()) && !((await parts.getAttribute('open')) !== null))
      await parts.locator('summary').click();
  }
  await page.locator(`.course-units a[href="/learn/computing?topic=${topic}"]`).last().click();
}
