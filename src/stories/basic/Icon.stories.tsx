import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSurface, textNode, type ComponentNode } from '../../basic/messages';
import { officialEnum } from '../../basic/schema';
import { SdkPreview, a2uiArg, sdkParameters } from '../../basic/storyKit';

type Args = { name: string };

const build = ({ name }: Args) =>
  createSurface([
    { id: 'root', component: 'Row', align: 'center', justify: 'start', children: ['icon', 'caption'] },
    { id: 'icon', component: 'Icon', name },
    textNode('caption', `\`${name}\``),
  ]);

/** Every icon name the official schema allows, laid out with Row/Column so the gallery is itself A2UI. */
function buildGallery() {
  const names = officialEnum('Icon', 'name');
  const perRow = 6;
  const rows: string[] = [];
  const nodes: ComponentNode[] = [];
  for (let start = 0; start < names.length; start += perRow) {
    const rowId = `row_${start / perRow}`;
    const cells = names.slice(start, start + perRow).map((name) => {
      nodes.push(
        { id: `cell_${name}`, component: 'Column', align: 'center', weight: 1, children: [`icon_${name}`, `label_${name}`] },
        { id: `icon_${name}`, component: 'Icon', name },
        textNode(`label_${name}`, name, { variant: 'caption' }),
      );
      return `cell_${name}`;
    });
    nodes.push({ id: rowId, component: 'Row', justify: 'start', children: cells });
    rows.push(rowId);
  }
  return createSurface([{ id: 'root', component: 'Column', children: rows }, ...nodes]);
}

const meta = {
  title: 'Basic Catalog/Content/Icon',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Icon',
    build,
    'Shows one icon from the fixed set named in the official schema (or a custom `svgPath`). The select control lists exactly the names the SDK schema allows.',
  ),
  args: { name: 'shoppingCart' },
  argTypes: { name: a2uiArg('Icon', 'name', 'select') },
  render: (args) => <SdkPreview message={build(args)} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Gallery: Story = {
  name: 'All official icon names',
  parameters: {
    controls: { disable: true },
    docs: { source: { transform: () => JSON.stringify(buildGallery(), null, 2) } },
  },
  render: () => <SdkPreview message={buildGallery()} width="wide" />,
};
