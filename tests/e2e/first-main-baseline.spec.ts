import { test, expect } from '@playwright/test';
import { migrationNb as c, migrationItemsNb } from '../../src/content/nb';

type Frame = { disabled: boolean; foreground: string; background: string; opacity: string };
declare global {
  interface Window {
    baselineContrastFrames: Frame[];
  }
}
const luminance = (color: string) => {
  const rgb = color
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map(Number);
  const linear = rgb.map((value) => {
    value /= 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
};

test('integrated baseline enabled primary actions retain contrast throughout state changes in both themes without submitting an assessment', async ({
  browser,
  baseURL,
}, info) => {
  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({
      baseURL,
      viewport: { width: 800, height: 700 },
      reducedMotion: 'no-preference',
    });
    try {
      const page = await context.newPage();
      await page.goto('/');
      await page.getByLabel('Utseende', { exact: true }).selectOption(theme);
      await page.addInitScript(() => {
        const state = window;
        state.baselineContrastFrames = [];
        const sample = () => {
          const button = document.querySelector<HTMLButtonElement>(
            '.migration-lesson .compute-assessment form button.compute-primary',
          );
          if (button) {
            const style = getComputedStyle(button);
            state.baselineContrastFrames.push({
              disabled: button.disabled,
              foreground: style.color,
              background: style.backgroundColor,
              opacity: style.opacity,
            });
          }
          if (state.baselineContrastFrames.length < 600) requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      });
      await page.goto('/learn/migration?topic=assessment&case=fm10');
      await page
        .getByRole('button', {
          name: new RegExp(`^(${c.assessment.start}|${c.assessment.retry})$`),
        })
        .click();
      await page
        .getByRole('dialog')
        .getByRole('button', { name: c.assessment.start, exact: true })
        .click();
      const form = page.locator('.migration-lesson .compute-assessment form');
      const submit = form.getByRole('button', { name: c.assessment.submit, exact: true });
      await expect(submit).toBeDisabled();
      await form
        .getByRole('radio', { name: migrationItemsNb.fm10.decisions[2], exact: true })
        .check();
      await form
        .getByRole('radio', { name: migrationItemsNb.fm10.reasons[2], exact: true })
        .check();
      await expect(submit).toBeEnabled();
      // Observe actual animation frames starting at activation, rather than
      // delaying Axe until an inaccessible transition happens to finish.
      await page.waitForFunction(
        () => window.baselineContrastFrames.filter((frame) => !frame.disabled).length >= 16,
      );
      const frames = await page.evaluate(() => window.baselineContrastFrames);
      const enabled = frames.filter((frame) => !frame.disabled);
      expect(enabled.length).toBeGreaterThanOrEqual(16);
      for (const frame of enabled) {
        expect(frame.opacity).toBe('1');
        const foreground = luminance(frame.foreground),
          background = luminance(frame.background);
        const ratio =
          (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
        expect(ratio, `${theme} enabled frame ${JSON.stringify(frame)}`).toBeGreaterThanOrEqual(
          4.5,
        );
      }
      await expect(page.locator('.compute-feedback')).toHaveCount(0);
      await info.attach(`${theme}-enabled-state-frames`, {
        body: JSON.stringify(frames),
        contentType: 'application/json',
      });
      await submit.scrollIntoViewIfNeeded();
      await page.screenshot({ path: info.outputPath(`action-enabled-${theme}.png`) });
    } finally {
      await context.close();
    }
  }
});
