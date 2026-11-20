import type { Meta, StoryObj } from '@storybook/react-vite';
import { bind, createSurface } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters, setupArg } from '../../basic/storyKit';

type Args = { direction: string; align: string; items: string };

const split = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

/** Uses a ChildList *template*: one Card per entry of /items in the data model. */
const build = ({ direction, align, items }: Args) =>
  createSurface(
    [
      { id: 'root', component: 'List', direction, align, children: { path: '/items', componentId: 'item_card' } },
      { id: 'item_card', component: 'Card', child: 'item_text' },
      { id: 'item_text', component: 'Text', text: bind('label') },
    ],
    { items: split(items).map((label) => ({ label })) },
  );

const meta = {
  title: 'Basic Catalog/Layout/List',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'List',
    build,
    'Repeats children vertically or horizontally. This preview uses a ChildList template: `children: { path: "/items", componentId: "item_card" }` renders one Card per data-model entry, with each Text bound to the relative path `label`.',
  ),
  args: { direction: 'vertical', align: 'stretch', items: 'Groceries, Dining out, Transport, Other spending' },
  argTypes: {
    direction: a2uiArg('List', 'direction'),
    align: a2uiArg('List', 'align'),
    items: setupArg('Comma-separated labels written to /items in the data model (the template repeats per entry).', 'text'),
  },
  render: (args) => <SdkPreview message={build(args)} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};
export const Horizontal: Story = { args: { direction: 'horizontal', align: 'center' } };
