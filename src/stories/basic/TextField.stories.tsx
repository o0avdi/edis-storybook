import type { Meta, StoryObj } from '@storybook/react-vite';
import { bind, createSurface } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters, setupArg } from '../../basic/storyKit';

type Args = { label: string; placeholder: string; variant: string; initialValue: string; required: boolean };

const build = ({ label, placeholder, variant, initialValue, required }: Args) =>
  createSurface(
    [
      {
        id: 'root',
        component: 'TextField',
        label,
        placeholder,
        variant,
        value: bind('/value'),
        ...(required
          ? { checks: [{ condition: { '@call': 'required', args: { value: bind('/value') } }, message: `${label} is required.` }] }
          : {}),
      },
    ],
    { value: variant === 'number' && initialValue !== '' && Number.isFinite(Number(initialValue)) ? Number(initialValue) : initialValue },
  );

const meta = {
  title: 'Basic Catalog/Interactive/TextField',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'TextField',
    build,
    'A text input whose `value` is bound to the data model (`{ "@path": "/value" }`). **Type in the preview** — the live data-model panel updates as the SDK writes the value back. `checks` adds renderer-side validation using catalog functions such as `required`.',
  ),
  args: { label: 'Category name', placeholder: 'e.g. Groceries', variant: 'shortText', initialValue: 'Groceries', required: false },
  argTypes: {
    label: a2uiArg('TextField', 'label', 'text'),
    placeholder: a2uiArg('TextField', 'placeholder', 'text'),
    variant: a2uiArg('TextField', 'variant'),
    initialValue: setupArg('Initial value at /value in the data model (`value` is bound to that path).', 'text'),
    required: setupArg('Adds a `checks` rule that calls the official `required` function.', 'boolean'),
  },
  render: (args) => <SdkPreview message={build(args)} watch={['/value']} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShortText: Story = { name: 'Short text' };
export const NumberInput: Story = { name: 'Number', args: { label: 'Estimated repair cost', variant: 'number', initialValue: '1200', placeholder: '0' } };
export const LongText: Story = { name: 'Long text', args: { label: 'Notes', variant: 'longText', initialValue: 'Car repair quote from Main St. Garage.\nValid until Nov 30.' } };
export const Obscured: Story = { args: { label: 'Account PIN', variant: 'obscured', initialValue: '1234', placeholder: '••••' } };
export const RequiredEmpty: Story = { name: 'Required (validation check)', args: { label: 'Category name', initialValue: '', required: true } };
