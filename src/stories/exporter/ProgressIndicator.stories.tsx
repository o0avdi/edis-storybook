import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressIndicator } from '../../extensions/ProgressIndicator';
import { sourceParameters, sourceStage } from './sourceStory';

const meta = {
  title: 'Exporter/Source Primitives/ProgressIndicator',
  component: ProgressIndicator,
  tags: ['autodocs', 'exporter-internal'],
  decorators: [sourceStage],
  parameters: sourceParameters('ProgressIndicator'),
  args: { label: 'Groceries budget used', value: 340, max: 400, tone: 'neutral', showValue: true },
  argTypes: { value: { control: { type: 'range', min: 0, max: 600, step: 5 } } },
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const OverBudget: Story = { name: 'Over budget (danger)', args: { label: 'Dining out budget used', value: 285, max: 250, tone: 'danger' } };
export const OnTrack: Story = { name: 'On track (success)', args: { label: 'Transport budget used', value: 120, max: 200, tone: 'success' } };
export const ValueHidden: Story = { name: 'Value hidden', args: { label: 'Emergency fund goal', value: 3000, max: 5000, tone: 'warning', showValue: false } };
