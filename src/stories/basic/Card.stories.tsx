import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSurface, textNode } from '../../basic/messages';
import { SdkPreview, sdkParameters, setupArg } from '../../basic/storyKit';

type Args = { content: string; nested: boolean };

const build = ({ content, nested }: Args) =>
  createSurface(
    nested
      ? [
          { id: 'root', component: 'Card', child: 'layout' },
          { id: 'layout', component: 'Column', children: ['body', 'meta'] },
          textNode('body', content),
          { id: 'meta', component: 'Row', justify: 'spaceBetween', children: ['left', 'right'] },
          textNode('left', 'Groceries · 85% used', { variant: 'caption' }),
          textNode('right', '$340 / $400', { variant: 'caption' }),
        ]
      : [{ id: 'root', component: 'Card', child: 'body' }, textNode('body', content)],
  );

const meta = {
  title: 'Basic Catalog/Layout/Card',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Card',
    build,
    'A framed container with exactly one `child`. To put several elements in a Card, the child is a layout component such as Column — which is how the budget composition builds its summary tiles.',
  ),
  args: { content: '### Groceries\n$340 spent of a $400 budget.', nested: false },
  argTypes: {
    content: setupArg('Markdown for the child Text component (Card itself only has a `child` id).', 'text'),
    nested: setupArg('Use a Column (Text + Row) as the single child instead of one Text.', 'boolean'),
  },
  render: (args) => <SdkPreview message={build(args)} width="narrow" />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleText: Story = { name: 'Single Text child' };
export const NestedLayout: Story = { name: 'Nested Column child', args: { nested: true } };
