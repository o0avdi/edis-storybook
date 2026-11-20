import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSurface, textNode } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters } from '../../basic/storyKit';

type Args = { justify: string; align: string };

const build = ({ justify, align }: Args) =>
  createSurface(
    [
      { id: 'root', component: 'Column', justify, align, children: ['title', 'first', 'second'] },
      textNode('title', '### Column'),
      { id: 'first', component: 'Card', child: 'first_text' },
      textNode('first_text', 'First item'),
      { id: 'second', component: 'Card', child: 'second_text' },
      textNode('second_text', 'Second item · a little wider'),
    ],
    {},
    'column-demo',
  );

const meta = {
  title: 'Basic Catalog/Layout/Column',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Column',
    build,
    'Lays out children vertically. `align` positions children horizontally (default `stretch`). `justify` only shows when the column is taller than its content, so this preview frame gives the column a fixed height of 320px with CSS.',
  ),
  args: { justify: 'start', align: 'start' },
  argTypes: { justify: a2uiArg('Column', 'justify'), align: a2uiArg('Column', 'align') },
  render: (args) => <SdkPreview message={build(args)} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Start: Story = {};
export const Stretch: Story = { args: { align: 'stretch' } };
export const CenteredSpaceBetween: Story = { name: 'Centered, space between', args: { align: 'center', justify: 'spaceBetween' } };
