import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSurface, textNode } from '../../basic/messages';
import { SdkPreview, sdkParameters, setupArg } from '../../basic/storyKit';

type Args = { titles: string };

const split = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

const build = ({ titles }: Args) => {
  const names = split(titles);
  return createSurface([
    { id: 'root', component: 'Tabs', tabs: names.map((title, index) => ({ title, child: `panel_${index}` })) },
    ...names.map((title, index) => textNode(`panel_${index}`, `### ${title}\nContent for the **${title}** tab is a separate Text component (\`panel_${index}\`).`)),
  ]);
};

const meta = {
  title: 'Basic Catalog/Layout/Tabs',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Tabs',
    build,
    'Shows one child at a time. `tabs` is an array of `{ title, child }` objects, so each panel is any component referenced by id. Click a tab header in the preview to switch panels.',
  ),
  args: { titles: 'Overview, Transactions, Settings' },
  argTypes: { titles: setupArg('Comma-separated tab titles; the preview builds the `tabs` array and one Text panel per title.', 'text') },
  render: (args) => <SdkPreview message={build(args)} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeTabs: Story = { name: 'Three tabs' };
