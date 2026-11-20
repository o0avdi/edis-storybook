import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSurface, textNode, type ComponentNode } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters, setupArg } from '../../basic/storyKit';

type Args = { justify: string; align: string; items: number; childWeight: boolean };

const LABELS = ['**Budget**  \n$2,400', '**Spent**  \n$1,780  \n74% of plan', '**Remaining**  \n$620', '**Saved**  \n$300', '**Goal**  \n$5,000'];

const build = ({ justify, align, items, childWeight }: Args) => {
  const ids = LABELS.slice(0, items).map((_, index) => `card_${index}`);
  const children: ComponentNode[] = ids.flatMap((id, index) => [
    { id, component: 'Card', child: `${id}_text`, ...(childWeight ? { weight: 1 } : {}) },
    textNode(`${id}_text`, LABELS[index]),
  ]);
  return createSurface([{ id: 'root', component: 'Row', justify, align, children: ids }, ...children]);
};

const meta = {
  title: 'Basic Catalog/Layout/Row',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Row',
    build,
    'Lays out children horizontally. `justify` distributes them along the row, `align` positions them vertically. Children are referenced by id, so any component (here: Cards) can sit in a Row.',
  ),
  args: { justify: 'spaceBetween', align: 'start', items: 3, childWeight: false },
  argTypes: {
    justify: a2uiArg('Row', 'justify'),
    align: a2uiArg('Row', 'align'),
    items: setupArg('How many child Cards the preview message contains.', { type: 'range', min: 1, max: 5, step: 1 }),
    childWeight: setupArg('Adds `weight: 1` to every child Card (an A2UI property of the child, valid inside Row/Column), so they share the width equally.', 'boolean'),
  },
  render: (args) => <SdkPreview message={build(args)} width="wide" />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpaceBetween: Story = { name: 'Space between' };
export const CenteredAndAligned: Story = { name: 'Centered, vertically centered', args: { justify: 'center', align: 'center' } };
export const EqualWeights: Story = { name: 'Equal weights', args: { childWeight: true, items: 4 } };
