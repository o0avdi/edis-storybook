import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';
import '@fontsource-variable/material-symbols-outlined/index.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    options: { storySort: { order: ['Start Here', 'Basic Catalog', 'Agent Composition', 'Exporter Extension'] } },
  },
};

export default preview;
