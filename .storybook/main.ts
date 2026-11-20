import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  features: { componentsManifest: true },
  typescript: { reactDocgen: 'react-docgen' },
};

export default config;
