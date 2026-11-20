import type { Meta, StoryObj } from '@storybook/react-vite';
import { BasicCatalogExplorer } from '../basic/BasicCatalogExplorer';

const meta = {
  title: 'Start Here/Official catalog schema',
  component: BasicCatalogExplorer,
  parameters: { docs: { description: { component: 'The 18 standard A2UI Basic Catalog schemas are read directly from the installed SDK, not reconstructed by our exporter.' } } },
} satisfies Meta<typeof BasicCatalogExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Explore: Story = {};
