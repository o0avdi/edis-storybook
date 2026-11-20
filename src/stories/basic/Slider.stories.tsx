import type { Meta, StoryObj } from '@storybook/react-vite';
import { bind, createSurface } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters, setupArg } from '../../basic/storyKit';

type Args = { label: string; min: number; max: number; steps?: number; initialValue: number };

const build = ({ label, min, max, steps, initialValue }: Args) =>
  createSurface(
    [{ id: 'root', component: 'Slider', label, min, max, ...(steps ? { steps } : {}), value: bind('/value') }],
    { value: initialValue },
  );

const meta = {
  title: 'Basic Catalog/Interactive/Slider',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Slider',
    build,
    'Picks a number between `min` and `max`; `steps` snaps it to discrete divisions. `value` is bound to `/value`; **drag the slider** and the live data-model panel follows.',
  ),
  args: { label: 'Monthly savings goal ($)', min: 0, max: 1000, steps: 20, initialValue: 400 },
  argTypes: {
    label: a2uiArg('Slider', 'label', 'text'),
    min: a2uiArg('Slider', 'min', 'number'),
    max: a2uiArg('Slider', 'max', 'number'),
    steps: a2uiArg('Slider', 'steps', { type: 'number', min: 1 }),
    initialValue: setupArg('Initial number at /value in the data model (`value` is bound to that path).', 'number'),
  },
  render: (args) => <SdkPreview message={build(args)} watch={['/value']} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stepped: Story = {};
export const Continuous: Story = { args: { label: 'Dining-out budget used (%)', min: 0, max: 100, steps: undefined, initialValue: 64 } };
