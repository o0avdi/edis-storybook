import { test as base, expect, type FrameLocator, type Page } from '@playwright/test';

export type EvidenceOptions = { shotDir: string | undefined };

/** Preview iframe inside the Storybook manager. */
export const preview = (page: Page): FrameLocator => page.frameLocator('#storybook-preview-iframe');
/** Storybook's addon panel (Controls / Actions). */
export const panel = (page: Page) => page.locator('#storybook-panel-root');

export const test = base.extend<EvidenceOptions & { shot: (name: string) => Promise<void>; consoleErrors: string[] }>({
  shotDir: [undefined, { option: true }],
  /** Saves a full-window screenshot when the "evidence" project runs; a no-op otherwise. */
  shot: async ({ page, shotDir }, use) => {
    await use(async (name) => {
      if (shotDir) await page.screenshot({ path: `${shotDir}/${name}.png` });
    });
  },
  /** Uncaught errors and console errors from the page and the preview iframe (favicon 404s excluded). */
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error' && !/favicon\.ico/.test(message.location().url ?? '')) errors.push(`console: ${message.text()}`);
    });
    await use(errors);
  },
});

export { expect };

/** Opens a story in the full manager UI and waits until the preview has rendered. */
export async function openStory(page: Page, id: string, view: 'story' | 'docs' = 'story') {
  await page.goto(`/?path=/${view}/${id}`);
  const frame = preview(page);
  // Docs: scope to #storybook-docs; the iframe also keeps a hidden "preparing docs" skeleton with a placeholder table.
  await frame.locator(view === 'docs' ? '#storybook-docs .sbdocs-content' : '#storybook-root > *').first().waitFor();
  return frame;
}

/** Content root of a docs page inside the preview iframe. */
export const docs = (page: Page) => preview(page).locator('#storybook-docs');

/** The Actions tab panel only (the panel root also contains the hidden Controls table). */
export const actionsPanel = (page: Page) => page.getByRole('tabpanel', { name: /^Actions/ });

/**
 * Expands the newest `onAction(eventName, payload)` entry in the Actions panel down to the SDK payload,
 * optionally also one nested key (e.g. "context").
 */
export async function expandLatestAction(page: Page, nested?: string) {
  const tabpanel = actionsPanel(page);
  await tabpanel.getByRole('treeitem', { name: /1: Object/ }).last().click();
  if (nested) await tabpanel.getByRole('treeitem', { name: new RegExp(`${nested}: Object`) }).last().click();
  return tabpanel;
}

export async function openAddonTab(page: Page, name: 'Controls' | 'Actions') {
  await page.getByRole('tab', { name: new RegExp(`^${name}`) }).click();
}
