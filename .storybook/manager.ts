import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
  theme: create({ base: 'light', brandTitle: 'A2UI Basic Catalog · Storybook', fontBase: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }),
  sidebar: { showRoots: true },
});
