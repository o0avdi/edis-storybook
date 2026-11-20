import type { Meta, StoryObj } from '@storybook/react-vite';
import { BasicSurface } from '../basic/BasicSurface';
import { EXAMPLES } from '../basic/examples';

const meta = {
  title: 'Basic Catalog/Primitives',
  component: BasicSurface,
  parameters: { docs: { description: { component: 'Every preview uses an A2UI createSurface message and the official SDK renderer. The Storybook story is a visualization harness, not source metadata for these SDK components.' } } },
} satisfies Meta<typeof BasicSurface>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Text: Story = { args: { message: EXAMPLES.Text } };
export const Card: Story = { args: { message: EXAMPLES.Card } };
export const Row: Story = { args: { message: EXAMPLES.Row } };
export const Column: Story = { args: { message: EXAMPLES.Column } };
export const Button: Story = { args: { message: EXAMPLES.Button } };
export const Divider: Story = { args: { message: EXAMPLES.Divider } };
export const TextField: Story = { args: { message: EXAMPLES.TextField } };
export const CheckBox: Story = { args: { message: EXAMPLES.CheckBox } };
export const ChoicePicker: Story = { args: { message: EXAMPLES.ChoicePicker } };
export const Slider: Story = { args: { message: EXAMPLES.Slider } };
export const DateTimeInput: Story = { args: { message: EXAMPLES.DateTimeInput } };
export const Tabs: Story = { args: { message: EXAMPLES.Tabs } };
export const List: Story = { args: { message: EXAMPLES.List } };
export const Icon: Story = { args: { message: EXAMPLES.Icon } };
