import type { ConsoleMessage } from '@playwright/test';
import { expect, test } from './fixtures';

/** basic-catalog-interactive-slider--stepped -> slider--stepped */
const shotName = (id: string) => id.replace(/^basic-catalog-(content|layout|interactive)-/, '');

/**
 * Loads EVERY story and docs page from the build's index.json in the preview iframe and fails on any uncaught
 * error, console error, or SDK validation error box. This is the "no console errors" gate.
 */
test('every story and docs page renders without errors', async ({ page, request, shotDir }) => {
  test.setTimeout(240_000);
  const index = (await (await request.get('/index.json')).json()) as { entries: Record<string, { id: string; type: string }> };
  const entries = Object.values(index.entries);
  expect(entries.length).toBeGreaterThan(50);

  const failures: string[] = [];
  for (const entry of entries) {
    const errors: string[] = [];
    const onPageError = (error: Error) => errors.push(`pageerror: ${error.message}`);
    const onConsole = (message: ConsoleMessage) => {
      if (message.type() === 'error' && !/favicon\.ico/.test(message.location().url ?? '')) errors.push(`console: ${message.text()}`);
    };
    page.on('pageerror', onPageError);
    page.on('console', onConsole);
    await page.goto(`/iframe.html?id=${entry.id}&viewMode=${entry.type === 'docs' ? 'docs' : 'story'}`);
    await page.locator(entry.type === 'docs' ? '#storybook-docs .sbdocs-content' : '#storybook-root > *').first().waitFor();
    await page.waitForTimeout(250);
    if (await page.locator('.sdk-error').count()) errors.push(`SDK validation error: ${await page.locator('.sdk-error').first().innerText()}`);
    page.off('pageerror', onPageError);
    page.off('console', onConsole);
    if (errors.length) failures.push(`${entry.id}\n  ${errors.join('\n  ')}`);
    if (shotDir && entry.type === 'story' && /^basic-catalog-/.test(entry.id))
      await page.screenshot({ path: `${shotDir}/stories/${shotName(entry.id)}.png`, fullPage: true });
  }
  expect(failures, failures.join('\n')).toEqual([]);
});
