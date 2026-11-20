import { actionsPanel, expandLatestAction, expect, openAddonTab, openStory, panel, test } from './fixtures';

test.describe('Basic Catalog primitives (official SDK renderer)', () => {
  test('Button click is logged in the native Storybook Actions panel', async ({ page, shot, consoleErrors }) => {
    const frame = await openStory(page, 'basic-catalog-interactive-button--primary');
    await frame.getByRole('button', { name: 'Save budget' }).click();
    await openAddonTab(page, 'Actions');
    const actions = actionsPanel(page);
    await expect(actions.getByRole('treeitem', { name: /onAction: \(2\) \["save_budget", Object\]/ })).toBeVisible();
    await expandLatestAction(page);
    await expect(actions).toContainText('surfaceId: "storybook-basic"'); // SDK ActionPayload fields
    await expect(actions).toContainText('sourceComponentId: "root"');
    // The preview no longer prints its own action log under the component.
    await expect(frame.locator('.action-log')).toHaveCount(0);
    await shot('05-button-click-in-actions-panel');
    expect(consoleErrors).toEqual([]);
  });

  test('event context resolves a data-model binding at click time', async ({ page, shot }) => {
    const frame = await openStory(page, 'basic-catalog-interactive-button--with-bound-context');
    const note = frame.locator('a2ui-basic-textfield', { hasText: 'Note sent with the event' }).locator('input');
    await note.fill('Pay the car repair from savings');
    await expect(frame.getByTestId('data-model:/note')).toHaveText('"Pay the car repair from savings"');
    await frame.getByRole('button', { name: 'Send note' }).click();
    await openAddonTab(page, 'Actions');
    await expect(actionsPanel(page)).toContainText('send_note');
    const actions = await expandLatestAction(page, 'context');
    await expect(actions).toContainText('note: "Pay the car repair from savings"');
    await shot('06-bound-context-in-actions-panel');
  });

  test('Controls change the SDK preview; harness internals are not exposed', async ({ page, shot }) => {
    const frame = await openStory(page, 'basic-catalog-interactive-button--primary');
    await openAddonTab(page, 'Controls');
    const names = await panel(page).locator('tbody tr td:first-child').allInnerTexts();
    expect(names.join('|')).not.toMatch(/\bmessage\b|onAction/);
    expect(names.map((name) => name.trim())).toEqual(expect.arrayContaining(['variant', 'action.event.name', 'label']));

    await panel(page).locator('#control-label').fill('Approve plan');
    await expect(frame.getByRole('button', { name: 'Approve plan' })).toBeVisible();
    await panel(page).getByLabel('borderless').check();
    await expect(frame.locator('button.a2ui-button-borderless')).toBeVisible();
    await shot('07-controls-change-preview');
  });

  for (const id of [
    'basic-catalog-content-text--body',
    'basic-catalog-interactive-slider--stepped',
    'basic-catalog-interactive-textfield--short-text',
    'basic-catalog-interactive-checkbox--checked',
    'basic-catalog-interactive-choicepicker--single-choice-chips',
    'basic-catalog-interactive-datetimeinput--date-only',
    'basic-catalog-layout-row--space-between',
    'basic-catalog-layout-column--start',
  ]) {
    test(`Controls for ${id.split('--')[0].split('-').pop()} are user-level, not the generic harness`, async ({ page }) => {
      await openStory(page, id);
      await openAddonTab(page, 'Controls');
      const names = (await panel(page).locator('tbody tr td:first-child').allInnerTexts()).map((name) => name.trim());
      expect(names.length).toBeGreaterThan(0);
      expect(names).not.toContain('message');
      expect(names).not.toContain('onAction');
    });
  }

  test('Slider writes its value back to the SDK data model', async ({ page, shot }) => {
    const frame = await openStory(page, 'basic-catalog-interactive-slider--stepped');
    const value = frame.getByTestId('data-model:/value');
    await expect(value).toHaveText('400');
    await frame.locator('input[type=range]').focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(value).toHaveText('500'); // steps: 20 over 0..1000 -> increments of 50
    await expect(frame.locator('.a2ui-slider-value')).toHaveText('500');
    await shot('08-slider-live-data-model');
  });

  test('TextField, CheckBox and ChoicePicker update their bindings', async ({ page, shot }) => {
    let frame = await openStory(page, 'basic-catalog-interactive-textfield--short-text');
    await frame.locator('a2ui-basic-textfield input').fill('Dining out');
    await expect(frame.getByTestId('data-model:/value')).toHaveText('"Dining out"');
    await shot('09-textfield-live-data-model');

    frame = await openStory(page, 'basic-catalog-interactive-checkbox--checked');
    await expect(frame.getByTestId('data-model:/checked')).toHaveText('true');
    await frame.getByRole('checkbox').click();
    await expect(frame.getByTestId('data-model:/checked')).toHaveText('false');

    frame = await openStory(page, 'basic-catalog-interactive-choicepicker--single-choice-chips');
    await frame.getByRole('button', { name: 'Transport' }).click();
    await expect(frame.getByTestId('data-model:/selected')).toHaveText('["transport"]');
    await shot('10-choicepicker-live-data-model');
  });

  test('TextField validation check uses the official required function', async ({ page }) => {
    const frame = await openStory(page, 'basic-catalog-interactive-textfield--required-empty');
    await expect(frame.getByText('Category name is required.')).toBeVisible();
    await frame.locator('a2ui-basic-textfield input').fill('Groceries');
    await expect(frame.getByText('Category name is required.')).toHaveCount(0);
  });
});
