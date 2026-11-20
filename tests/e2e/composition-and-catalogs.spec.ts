import { actionsPanel, docs, expect, openAddonTab, openStory, preview, test } from './fixtures';

const BUDGET = 'composed-example-november-budget--budget-tracker';

for (const viewport of [
  { width: 1920, height: 1080 },
  { width: 1280, height: 800 },
]) {
  test(`budget composition works at ${viewport.width}x${viewport.height}`, async ({ page, shot, consoleErrors }) => {
    await page.setViewportSize(viewport);
    const frame = await openStory(page, BUDGET);
    const size = `${viewport.width}x${viewport.height}`;
    await expect(frame.getByRole('heading', { name: 'November budget' })).toBeVisible();

    // Summary tiles share the row width (weight: 1) and the surface is not hugging the left edge.
    const tiles = frame.locator('[data-surface-id="november-budget"] a2ui-basic-row').first().locator(':scope > a2ui-card');
    await expect(tiles).toHaveCount(3);
    const widths = await tiles.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width));
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(2);
    const body = await frame.locator('body').evaluate((element) => ({ scroll: element.scrollWidth, client: element.clientWidth }));
    expect(body.scroll).toBeLessThanOrEqual(body.client); // no horizontal scrolling
    await shot(`11-budget-${size}`);

    // Category -> agent-style event -> new createSurface message.
    await frame.getByRole('button', { name: 'Dining out' }).click();
    await expect(frame.getByRole('heading', { name: /Dining out · Recent transactions/ })).toBeVisible();
    await expect(frame.getByText('Nov 10 · Dinner · $68')).toBeVisible();
    await expect(frame.getByText('Last event → sample logic: select_category')).toBeVisible();
    await openAddonTab(page, 'Actions');
    await expect(actionsPanel(page)).toContainText('select_category');

    // Edit amounts through bound TextFields and check coverage.
    await frame.getByRole('button', { name: 'Show emergency fund' }).click();
    await frame.getByRole('button', { name: 'Edit amounts' }).click();
    await frame.locator('a2ui-basic-textfield', { hasText: 'Emergency fund balance' }).locator('input').fill('5000');
    await frame.locator('a2ui-basic-textfield', { hasText: 'Estimated repair cost' }).locator('input').fill('1350');
    if (viewport.width === 1920) await shot('12-budget-editing-amounts');
    await frame.getByRole('button', { name: 'Check coverage' }).click();
    await expect(frame.getByText('$3,650 left in your emergency fund after the repair.')).toBeVisible();

    // JSON view shows the exact message the renderer received.
    await frame.getByRole('button', { name: 'Show createSurface JSON' }).click();
    const json = frame.locator('.json-view__code');
    await expect(json).toContainText('"surfaceId": "november-budget"');
    await expect(json).toContainText('"expenseCost": 1350');
    await shot(`13-budget-json-${size}`);
    await frame.getByRole('button', { name: 'Hide createSurface JSON' }).click();
    await expect(json).toHaveCount(0);
    expect(consoleErrors).toEqual([]);
  });
}

test('official catalog explorer: search, property table, JSON, copy', async ({ page, context, shot }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const frame = await openStory(page, 'start-here-official-basic-catalog--explore');
  await expect(frame.getByText('Provenance: SDK-authored.')).toBeVisible();
  await shot('02-official-catalog-explorer');

  await frame.getByPlaceholder(/Filter/).fill('slid');
  await expect(frame.getByRole('option')).toHaveCount(1);
  await frame.getByRole('option', { name: 'Slider' }).click();
  await expect(frame.getByRole('heading', { name: 'Slider', level: 2 })).toBeVisible();
  await expect(frame.locator('.schema-table')).toContainText('steps');
  await frame.getByRole('tab', { name: 'Official JSON' }).click();
  await expect(frame.locator('.json-view__code')).toContainText('"const": "Slider"');
  await frame.getByRole('button', { name: 'Copy JSON' }).click();
  await expect(frame.getByRole('button', { name: 'Copied ✓' })).toBeVisible();
  await shot('03-explorer-slider-json');

  await frame.getByPlaceholder(/Filter/).fill('format');
  await expect(frame.getByRole('option')).toHaveCount(0); // functions are not included in the visual component explorer
});

test('exporter page separates exporter output from the official catalog', async ({ page, shot }) => {
  const frame = await openStory(page, 'exporter-generated-catalogs--overview');
  await expect(frame.getByText('Pre-generated snapshot.')).toBeVisible();
  await expect(frame.locator('.command').first()).toContainText('npx storybook-a2ui export --storybook storybook-static --components ProgressIndicator');
  await shot('15-exporter-one-component');

  await frame.getByRole('tab', { name: /Extension catalog/ }).click();
  await expect(frame.getByRole('tabpanel')).toContainText('3 components (MetricLabel, ProgressIndicator, StatusBadge)');
  await frame.getByRole('tab', { name: /Export report/ }).click();
  const report = frame.getByRole('tabpanel');
  await expect(report).toContainText('unmappedEvents: fail');
  await expect(report.locator('td.status--exported')).toHaveCount(3);
  await shot('16-exporter-report');

  await frame.getByRole('tab', { name: /Official Basic Catalog/ }).click();
  await expect(frame.getByRole('tabpanel')).toContainText('SDK-authored reference, not exporter output.');
});

test('exporter source primitive docs show docgen controls and the exported schema', async ({ page, shot }) => {
  await openStory(page, 'exporter-source-primitives-progressindicator--docs', 'docs');
  await expect(docs(page).getByText('Different from the Basic Catalog pages.')).toBeVisible();
  await expect(docs(page).locator('.schema-table').first()).toContainText('showValue');
  await shot('17-source-primitive-docs');
});

test('welcome and docs pages (presentation screenshots)', async ({ page, shot }) => {
  await openStory(page, 'start-here-welcome--docs', 'docs');
  await expect(docs(page).getByRole('heading', { name: 'Two-minute route' })).toBeVisible();
  await expect(docs(page).locator('table').first()).toContainText('Official Basic Catalog');
  await shot('01-welcome');

  await openStory(page, 'basic-catalog-interactive-slider--docs', 'docs');
  await expect(docs(page).getByText('What you are looking at.')).toBeVisible();
  await expect(docs(page).getByRole('heading', { name: 'Official schema · Slider' })).toBeVisible();
  await shot('04-slider-docs-page');
  await docs(page).getByRole('heading', { name: 'Official schema · Slider' }).scrollIntoViewIfNeeded();
  await shot('04b-slider-docs-official-schema');
});

test('in-preview links navigate the Storybook manager (demo route)', async ({ page }) => {
  await openStory(page, 'start-here-welcome--docs', 'docs');
  await docs(page).getByRole('link', { name: 'Official Basic Catalog' }).click();
  await expect(page).toHaveURL(/path=\/story\/start-here-official-basic-catalog--explore/);
  const frame = preview(page);
  await frame.getByPlaceholder(/Filter/).fill('slider');
  await frame.getByRole('option', { name: 'Slider' }).click();
  await frame.getByRole('link', { name: 'Live SDK preview →' }).click();
  await expect(page).toHaveURL(/path=\/docs\/basic-catalog-interactive-slider--docs/);
  await expect(docs(page).getByRole('heading', { name: 'Official schema · Slider' })).toBeVisible();
});
