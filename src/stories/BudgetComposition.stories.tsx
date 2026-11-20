import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BudgetSurface } from '../examples/BudgetSurface';

const meta = {
  title: 'Composed Example/November Budget',
  component: BudgetSurface,
  tags: ['!manifest'],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Composed at runtime from Text, Row, Column, Card, Button and TextField using one A2UI `createSurface` message. No React BudgetDashboard, StatCard or BudgetTable exists. The message builder is adapted from the capstone showcase branch and is deterministic sample logic, not a live AI call. Button events appear in the Actions panel as `onAction`.',
      },
    },
  },
  args: { onAction: fn() },
  argTypes: { onAction: { table: { disable: true } } },
} satisfies Meta<typeof BudgetSurface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BudgetTracker: Story = { name: 'Budget tracker' };
