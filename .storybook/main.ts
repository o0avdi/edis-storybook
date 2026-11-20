import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  // Exporter stories (the React source primitives and the generated-catalog page) are hidden from the sidebar for the
  // showcase. They are still built, still reachable by URL, and still listed in manifests/components.json, which is
  // what the exporter CLI reads. The live exporter demo runs in a terminal instead (npm run export:demo).
  tags: { 'exporter-internal': { excludeFromSidebar: true } },
  // componentsManifest: writes manifests/components.json for the exporter (React source primitives only;
  // SDK preview stories opt out with the `!manifest` tag). The onboarding checklist is hidden for demos.
  features: { componentsManifest: true, sidebarOnboardingChecklist: false },
  typescript: { reactDocgen: 'react-docgen' },
};

export default config;
