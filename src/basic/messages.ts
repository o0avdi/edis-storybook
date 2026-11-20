import { basicCatalog } from '@a2ui/web_core/catalogs/basic/v1';

/** One entry of a createSurface `components` array (flat A2UI v1.0 adjacency-list form). */
export type ComponentNode = { id: string; component: string; [key: string]: unknown };

export type CreateSurfaceMessage = {
  version: '1.0';
  createSurface: {
    surfaceId: string;
    catalogId: string;
    components: ComponentNode[];
    dataModel: Record<string, unknown>;
  };
};

/** Wraps components in a standard A2UI v1.0 `createSurface` message that targets the official Basic Catalog. */
export function createSurface(
  components: ComponentNode[],
  dataModel: Record<string, unknown> = {},
  surfaceId = 'storybook-basic',
): CreateSurfaceMessage {
  return {
    version: '1.0',
    createSurface: { surfaceId, catalogId: basicCatalog.id, components, dataModel },
  };
}

export const textNode = (id: string, text: string, extra: Record<string, unknown> = {}): ComponentNode => ({
  id,
  component: 'Text',
  text,
  ...extra,
});

/** A2UI v1.0 data binding to a JSON-pointer path in the surface data model. */
export const bind = (path: string) => ({ '@path': path });

/** Counts component types in a message, e.g. to show what a composition is built from. */
export function componentCounts(message: CreateSurfaceMessage): [string, number][] {
  const counts = new Map<string, number>();
  for (const { component } of message.createSurface.components) counts.set(component, (counts.get(component) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
