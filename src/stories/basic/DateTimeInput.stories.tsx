import type { Meta, StoryObj } from '@storybook/react-vite';
import { bind, createSurface } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters, setupArg } from '../../basic/storyKit';

type Args = { label: string; enableDate: boolean; enableTime: boolean; date: string; time: string };

/** ISO 8601 initial value matching the enabled parts: date, time, or date-time. */
const initialValue = ({ enableDate, enableTime, date, time }: Args) =>
  enableDate && enableTime ? `${date}T${time}` : enableDate ? date : enableTime ? time : '';

const build = (args: Args) =>
  createSurface(
    [{ id: 'root', component: 'DateTimeInput', label: args.label, enableDate: args.enableDate, enableTime: args.enableTime, value: bind('/when') }],
    { when: initialValue(args) },
  );

const meta = {
  title: 'Basic Catalog/Interactive/DateTimeInput',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'DateTimeInput',
    build,
    'Captures a date, a time, or both as an ISO 8601 string bound to `/when`. Toggle `enableDate` / `enableTime` to change the input; **edit it in the preview** to see the stored string update.',
  ),
  args: { label: 'Payment due', enableDate: true, enableTime: false, date: '2026-11-30', time: '09:30' },
  argTypes: {
    label: a2uiArg('DateTimeInput', 'label', 'text'),
    enableDate: a2uiArg('DateTimeInput', 'enableDate', 'boolean'),
    enableTime: a2uiArg('DateTimeInput', 'enableTime', 'boolean'),
    date: setupArg('Initial date (YYYY-MM-DD) used to build the ISO value at /when.', 'text'),
    time: setupArg('Initial time (HH:MM) used to build the ISO value at /when.', 'text'),
  },
  render: (args) => <SdkPreview message={build(args)} watch={['/when']} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateOnly: Story = { name: 'Date' };
export const TimeOnly: Story = { name: 'Time', args: { label: 'Reminder time', enableDate: false, enableTime: true } };
export const DateAndTime: Story = { name: 'Date and time', args: { label: 'Appointment', enableTime: true } };
