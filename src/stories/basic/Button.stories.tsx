import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { bind, createSurface, textNode } from '../../basic/messages';
import { A2UI_CATEGORY, SdkPreview, a2uiArg, actionArg, sdkParameters, setupArg, type WithAction } from '../../basic/storyKit';

type Args = WithAction & { label: string; variant: string; eventName: string };

const build = ({ label, variant, eventName }: Args) =>
  createSurface([
    { id: 'root', component: 'Button', child: 'label', variant, action: { event: { name: eventName, context: { label } } } },
    textNode('label', label),
  ]);

/** The event context can carry data-model bindings; the SDK resolves them at click time. */
const buildWithBoundContext = ({ label, variant, eventName }: Args) =>
  createSurface(
    [
      { id: 'root', component: 'Column', align: 'start', children: ['note', 'submit'] },
      { id: 'note', component: 'TextField', label: 'Note sent with the event', value: bind('/note') },
      { id: 'submit', component: 'Button', child: 'submit_label', variant, action: { event: { name: eventName, context: { note: bind('/note') } } } },
      textNode('submit_label', label),
    ],
    { note: 'Move $50 from Dining out to Groceries' },
  );

const meta = {
  title: 'Basic Catalog/Interactive/Button',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Button',
    build,
    'A clickable control whose `action` dispatches an agent-side event. **Click it and open the Actions panel:** each click is logged as `onAction` with the event name, then the full SDK payload (surfaceId, sourceComponentId, resolved context). The label is a separate child Text component.',
  ),
  args: { variant: 'primary', eventName: 'save_budget', label: 'Save budget', onAction: fn() },
  argTypes: {
    variant: a2uiArg('Button', 'variant'),
    eventName: {
      name: 'action.event.name',
      description: 'Name of the agent-side event dispatched on click (the Button’s `action: { event: { name, context } }`).',
      control: 'text',
      table: { category: A2UI_CATEGORY, type: { summary: 'string' } },
    },
    label: setupArg('Text of the child Text component (Button.child → Text). Also sent as `context.label`.', 'text'),
    onAction: actionArg,
  },
  render: (args) => <SdkPreview message={build(args)} onAction={args.onAction} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Default: Story = { args: { variant: 'default', label: 'Cancel', eventName: 'cancel' } };
export const Borderless: Story = { args: { variant: 'borderless', label: 'View all transactions', eventName: 'view_transactions' } };

export const WithBoundContext: Story = {
  name: 'Event with bound context',
  args: { label: 'Send note', eventName: 'send_note' },
  parameters: {
    docs: {
      description: { story: 'Edit the note, then click **Send note**: the Actions panel shows `context.note` resolved from `/note` at click time.' },
      source: { transform: (_: string, { args }: { args: Args }) => JSON.stringify(buildWithBoundContext(args), null, 2) },
    },
  },
  render: (args) => <SdkPreview message={buildWithBoundContext(args)} onAction={args.onAction} watch={['/note']} />,
};
