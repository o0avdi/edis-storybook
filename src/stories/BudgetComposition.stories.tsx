import type { Meta, StoryObj } from '@storybook/react-vite';
import { BudgetSurface } from '../examples/BudgetSurface';

const meta = {
  title: 'Agent Composition/November budget',
  component: BudgetSurface,
  parameters: { docs: { description: { component: 'This dashboard is composed at runtime from Text, Row, Column, Card, Button and TextField using A2UI JSON. No React BudgetDashboard, StatCard or BudgetTable is used. The sample message is adapted from the capstone showcase branch; it is deterministic sample logic rather than a live AI call.' } } },
} satisfies Meta<typeof BudgetSurface>;
export default meta;
type Story = StoryObj<typeof meta>;
export const BudgetTracker: Story = {};
