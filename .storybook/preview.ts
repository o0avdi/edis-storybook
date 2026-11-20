import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';
import '@fontsource-variable/material-symbols-outlined/index.css';

const preview: Preview = {
  parameters: {
    // Stories render their own framed stage; fullscreen avoids Storybook's extra padding around it.
    layout: 'fullscreen',
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Start Here', ['Welcome', 'Official Basic Catalog'],
          'Basic Catalog', ['Content', 'Layout', 'Interactive'],
          'Composed Example',
        ],
      },
    },
  },
};

export default preview;
