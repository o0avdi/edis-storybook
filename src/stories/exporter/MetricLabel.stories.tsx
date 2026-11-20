import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricLabel } from '../../extensions/MetricLabel';
import { sourceParameters, sourceStage } from './sourceStory';

const meta = {
  title: 'Exporter/Source Primitives/MetricLabel',
  component: MetricLabel,
  tags: ['autodocs'],
  decorators: [sourceStage],
  parameters: sourceParameters('MetricLabel'),
  args: { label: 'Spent this month', value: 1780, format: 'currency', trend: 'neutral' },
} satisfies Meta<typeof MetricLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Currency: Story = {};
export const Percent: Story = { args: { label: 'Budget used', value: 74.2, format: 'percent' } };
export const PositiveTrend: Story = { name: 'Positive trend', args: { label: 'Remaining', value: 620, format: 'currency', trend: 'positive' } };
export const PlainNumber: Story = { name: 'Plain number', args: { label: 'Transactions', value: 42, format: 'number' } };
