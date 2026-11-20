import type { Meta, StoryObj } from '@storybook/react-vite';
import { BasicCatalogExplorer } from '../basic/BasicCatalogExplorer';
import { OFFICIAL_COMPONENT_NAMES } from '../basic/schema';

type Args = { selected: string };

const meta = {
  title: 'Start Here/Official Basic Catalog',
  tags: ['!manifest'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The official A2UI Basic Catalog schemas, read directly from the installed SDK (`basicCatalog.toJson()`), not reconstructed by our exporter.',
      },
    },
  },
  args: { selected: 'Button' },
  argTypes: {
    selected: {
      description: 'Initially selected catalog entry (deep-linkable via `&args=selected:Slider`).',
      control: 'select',
      options: OFFICIAL_COMPONENT_NAMES,
    },
  },
  render: ({ selected }) => <BasicCatalogExplorer key={selected} initialSelection={selected} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Explore: Story = {};
