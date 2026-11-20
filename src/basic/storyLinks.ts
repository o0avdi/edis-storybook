/**
 * Where each official Basic Catalog component has a live preview story.
 * Story titles are `Basic Catalog/<Group>/<Component>`; Storybook derives ids from them.
 */
export const PREVIEW_GROUPS = {
  Content: ['Text', 'Icon', 'Image', 'Divider'],
  Layout: ['Row', 'Column', 'Card', 'List', 'Tabs', 'Modal'],
  Interactive: ['Button', 'TextField', 'CheckBox', 'ChoicePicker', 'Slider', 'DateTimeInput'],
} as const;

/** Official components shown in the schema explorer only (they need external media URLs to preview). */
export const SCHEMA_ONLY = ['Video', 'AudioPlayer'] as const;

const groupOf = new Map<string, string>(
  Object.entries(PREVIEW_GROUPS).flatMap(([group, names]) => names.map((name) => [name, group] as const)),
);

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const previewTitle = (component: string) => `Basic Catalog/${groupOf.get(component)}/${component}`;

/** Manager URL for a component's docs page. Use with target="_top" from inside the preview iframe. */
export function previewDocsHref(component: string): string | undefined {
  const group = groupOf.get(component);
  return group ? `./?path=/docs/basic-catalog-${slug(group)}-${slug(component)}--docs` : undefined;
}

export const explorerHref = (component?: string) =>
  `./?path=/story/start-here-official-basic-catalog--explore${component ? `&args=selected:${component}` : ''}`;
