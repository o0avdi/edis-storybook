import type { Meta, StoryObj } from '@storybook/react-vite';
import { createSurface } from '../../basic/messages';
import { SdkPreview, a2uiArg, sdkParameters } from '../../basic/storyKit';

type Args = { url: string; description: string; fit: string; variant: string };

const build = ({ url, description, fit, variant }: Args) =>
  createSurface([{ id: 'root', component: 'Image', url, description, fit, variant }]);

const meta = {
  title: 'Basic Catalog/Content/Image',
  tags: ['autodocs', '!manifest'],
  parameters: sdkParameters(
    'Image',
    build,
    'Displays an image from a URL with alt text (`description`). `variant` is a size hint and `fit` maps to CSS `object-fit`. The sample is a local SVG served by Storybook, so the story works offline.',
  ),
  args: { url: './sample-chart.svg', description: 'Bar chart of November spending by category', fit: 'contain', variant: 'mediumFeature' },
  argTypes: {
    url: a2uiArg('Image', 'url', 'text'),
    description: a2uiArg('Image', 'description', 'text'),
    variant: a2uiArg('Image', 'variant'),
    fit: a2uiArg('Image', 'fit'),
  },
  render: (args) => <SdkPreview message={build(args)} />,
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MediumFeature: Story = { name: 'Medium feature' };
export const Avatar: Story = { args: { variant: 'avatar', fit: 'cover' } };
