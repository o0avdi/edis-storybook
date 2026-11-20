import type { Decorator } from '@storybook/react-vite';
import { Stage } from '../../basic/storyKit';
import { SourceDocsPage } from '../../exporter/SourceDocsPage';

/** Frames exporter source primitives in the same stage as SDK previews, but labeled as source components. */
export const sourceStage: Decorator = (Story) => (
  <Stage tone="source" width="narrow">
    <Story />
  </Stage>
);

/** `exportedAs` names the component in the exported catalog (minification-safe). */
export const sourceParameters = (exportedAs: string) => ({
  exportedAs,
  docs: { page: SourceDocsPage },
});
