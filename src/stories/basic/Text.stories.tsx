import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSurface, textNode } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters } from '../../basic/storyKit';

type Args = { text: string; variant: string };

const build = ({ text, variant }: Args) => createSurface([textNode('root', text, { variant })]);

const meta = {
  title: 'Basic Catalog/Content/Text',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Text',
    build,
    'Displays a string. `text` accepts simple Markdown (headings, emphasis, lists) and can be bound to the data model; `variant` switches between body copy and a smaller caption.',
  ),
  args: { text: 'A2UI text can be **bold**, *italic*, or a `code` span — and it can come from the data model.', variant: 'body' },
  argTypes: { text: a2uiArg('Text', 'text', 'text'), variant: a2uiArg('Text', 'variant') },
  render: (args) => <SdkPreview message={build(args)} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};

export const Caption: Story = {
  args: { text: 'Updated 2 minutes ago · sample data', variant: 'caption' },
};

export const MarkdownHeadings: Story = {
  name: 'Markdown headings',
  args: {
    text: '# November budget\n## Spending by category\n### Dining out\n\nBody copy follows the headings.\n\n- Groceries\n- Transport',
  },
};
