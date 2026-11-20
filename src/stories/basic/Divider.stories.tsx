import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSurface, textNode } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters } from '../../basic/storyKit';

type Args = { axis: string };

/** A horizontal divider separates Column items; a vertical one separates Row items. */
const build = ({ axis }: Args) =>
  createSurface([
    { id: 'root', component: axis === 'vertical' ? 'Row' : 'Column', align: 'stretch', children: ['first', 'divider', 'second'] },
    textNode('first', '**Budget**  \n$2,400'),
    { id: 'divider', component: 'Divider', axis },
    textNode('second', '**Spent**  \n$1,780'),
  ]);

const meta = {
  title: 'Basic Catalog/Content/Divider',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Divider',
    build,
    'A thin separator line. Use `axis: "horizontal"` between Column items and `axis: "vertical"` between Row items; the preview switches the parent layout to match.',
  ),
  args: { axis: 'horizontal' },
  argTypes: { axis: a2uiArg('Divider', 'axis') },
  render: (args) => <SdkPreview message={build(args)} width="narrow" />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};
export const Vertical: Story = { args: { axis: 'vertical' } };
