import type { Meta, StoryObj } from '@storybook/react-vite';
import { bind, createSurface } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters, setupArg } from '../../basic/storyKit';

type Args = { label: string; variant: string; displayStyle: string; filterable: boolean; options: string; selected: string };

const split = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);
const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const build = ({ label, variant, displayStyle, filterable, options, selected }: Args) =>
  createSurface(
    [
      {
        id: 'root',
        component: 'ChoicePicker',
        label,
        variant,
        displayStyle,
        filterable,
        options: split(options).map((option) => ({ label: option, value: slug(option) })),
        value: bind('/selected'),
      },
    ],
    { selected: split(selected).map(slug) },
  );

const meta = {
  title: 'Basic Catalog/Interactive/ChoicePicker',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'ChoicePicker',
    build,
    'Selects one or several values from `options`. `value` is bound to a string array (`/selected`); **pick options in the preview** and the live data-model panel shows the stored values. `variant` controls single vs. multiple selection.',
  ),
  args: {
    label: 'Expense categories',
    variant: 'mutuallyExclusive',
    displayStyle: 'chips',
    filterable: false,
    options: 'Groceries, Dining out, Transport, Other',
    selected: 'Groceries',
  },
  argTypes: {
    label: a2uiArg('ChoicePicker', 'label', 'text'),
    variant: a2uiArg('ChoicePicker', 'variant'),
    displayStyle: a2uiArg('ChoicePicker', 'displayStyle'),
    filterable: a2uiArg('ChoicePicker', 'filterable', 'boolean'),
    options: setupArg('Comma-separated option labels; the preview builds `options: [{ label, value }]` with slug values.', 'text'),
    selected: setupArg('Comma-separated labels selected initially (written to /selected).', 'text'),
  },
  render: (args) => <SdkPreview message={build(args)} watch={['/selected']} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleChoiceChips: Story = { name: 'Single choice · chips' };
export const MultipleCheckboxes: Story = {
  name: 'Multiple selection · checkboxes',
  args: { variant: 'multipleSelection', displayStyle: 'checkbox', selected: 'Groceries, Transport' },
};
export const Filterable: Story = {
  args: {
    variant: 'multipleSelection',
    filterable: true,
    options: 'Groceries, Dining out, Coffee, Transport, Fuel, Parking, Rent, Utilities, Insurance',
    selected: 'Coffee',
  },
};
