import { fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSurface, textNode } from '../../basic/messages';
import { SdkPreview, actionArg, sdkParameters, setupArg, type WithAction } from '../../basic/storyKit';

type Args = WithAction & { triggerLabel: string; content: string };

const build = ({ triggerLabel, content }: Args) =>
  createSurface([
    { id: 'root', component: 'Modal', trigger: 'open', content: 'dialog' },
    { id: 'open', component: 'Button', child: 'open_label', variant: 'primary', action: { event: { name: 'open_details', context: {} } } },
    textNode('open_label', triggerLabel),
    { id: 'dialog', component: 'Card', child: 'dialog_text' },
    textNode('dialog_text', content),
  ]);

const meta = {
  title: 'Basic Catalog/Layout/Modal',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Modal',
    build,
    'Opens `content` in an overlay when the `trigger` component is activated. Both are ids of other components; here the trigger is a Button and the content is a Card.',
  ),
  args: { triggerLabel: 'View details', content: '### Dining out\nYou are **$35 over** this month’s $250 budget.', onAction: fn() },
  argTypes: {
    triggerLabel: setupArg('Text of the trigger Button’s child Text.', 'text'),
    content: setupArg('Markdown for the Text inside the modal’s content Card.', 'text'),
    onAction: actionArg,
  },
  render: (args) => <SdkPreview message={build(args)} onAction={args.onAction} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonTrigger: Story = { name: 'Button trigger' };
