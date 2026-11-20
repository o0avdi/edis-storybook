import type { Meta, StoryObj } from '@storybook/react-vite';
import { bind, createSurface } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters, setupArg } from '../../basic/storyKit';

type Args = { label: string; checked: boolean };

const build = ({ label, checked }: Args) =>
  createSurface([{ id: 'root', component: 'CheckBox', label, value: bind('/checked') }], { checked });

const meta = {
  title: 'Basic Catalog/Interactive/CheckBox',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'CheckBox',
    build,
    'A labeled boolean toggle. `value` is bound to `/checked`; **click it in the preview** and the live data-model panel flips between `true` and `false`.',
  ),
  args: { label: 'Include recurring transactions', checked: true },
  argTypes: {
    label: a2uiArg('CheckBox', 'label', 'text'),
    checked: setupArg('Initial boolean at /checked in the data model (`value` is bound to that path).', 'boolean'),
  },
  render: (args) => <SdkPreview message={build(args)} watch={['/checked']} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {};
export const Unchecked: Story = { args: { checked: false, label: 'Round amounts to the nearest dollar' } };
