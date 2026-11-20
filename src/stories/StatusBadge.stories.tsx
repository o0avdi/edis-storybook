import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from '../extensions/StatusBadge';

const meta = {
  title: 'Exporter Extension/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: { label: 'All checks passing', status: 'success' },
} satisfies Meta<typeof StatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Success: Story = {};
export const Warning: Story = { args: { label: 'Budget exceeded', status: 'warning' } };
export const Info: Story = { args: { label: 'Processing', status: 'info' } };
