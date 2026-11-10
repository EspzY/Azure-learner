import { type Page } from '@playwright/test';
import { cloudNavigationTopic } from '../../src/features/course/cloud-computing-chapters';
/** The ordinary sidebar opens the owning session. Original parts are read by
 * scrolling; historical URL/history tests exercise their addresses separately. */
export async function openCloudPart(page: Page, topic: string) {
  const destination = cloudNavigationTopic(topic);
  await page
    .locator(`.course-units a[href="/learn/computing?topic=${destination}"]`)
    .last()
    .click();
}
