import { defineConfig } from '@playwright/test';
import type { EvidenceOptions } from './tests/e2e/fixtures';

/**
 * End-to-end checks run against the static Storybook build (npm run build-storybook), served locally.
 * Set STORYBOOK_URL to test a running dev server instead, e.g. STORYBOOK_URL=http://localhost:6006.
 * Locally the installed Google Chrome is used (no browser download); CI uses Playwright's Chromium.
 */
const external = process.env.STORYBOOK_URL;

export default defineConfig<EvidenceOptions>({
  testDir: 'tests/e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: process.env.CI ? 2 : 3,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: external ?? 'http://127.0.0.1:6007',
    channel: process.env.CI ? undefined : 'chrome',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'e2e' },
    // Same tests, additionally writing the README/demo screenshots.
    { name: 'evidence', use: { shotDir: 'docs/screenshots/after' } },
  ],
  webServer: external
    ? undefined
    : {
        command: 'node scripts/serve-static.mjs storybook-static 6007',
        url: 'http://127.0.0.1:6007/index.json',
        reuseExistingServer: !process.env.CI,
      },
});
