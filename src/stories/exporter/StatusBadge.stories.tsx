import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from '../../extensions/StatusBadge';
import { sourceParameters, sourceStage } from './sourceStory';

const meta = {
  title: 'Exporter/Source Primitives/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs', 'exporter-internal'],
  decorators: [sourceStage],
  parameters: sourceParameters('StatusBadge'),
  args: { label: 'All checks passing', status: 'success' },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};
export const Warning: Story = { args: { label: 'Dining out over budget', status: 'warning' } };
export const Info: Story = { args: { label: 'Sync in progress', status: 'info' } };
