import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  // Source stories remain available to the manifest and exporter CLI, but are hidden in the demo sidebar.
  tags: { 'exporter-internal': { defaultFilterSelection: 'exclude' } },
  // componentsManifest: writes manifests/components.json for the exporter (React source primitives only;
  // SDK preview stories opt out with the `!manifest` tag). The onboarding checklist is hidden for demos.
  features: { componentsManifest: true, sidebarOnboardingChecklist: false },
  typescript: { reactDocgen: 'react-docgen' },
};

export default config;
