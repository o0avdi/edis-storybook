import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExporterOverview } from '../../exporter/ExporterOverview';

const meta = {
  title: 'Exporter/Generated Catalogs',
  component: ExporterOverview,
  tags: ['!manifest', 'exporter-internal'],
  parameters: { layout: 'fullscreen', controls: { disable: true }, actions: { disable: true } },
} satisfies Meta<typeof ExporterOverview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
