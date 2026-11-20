import { basicCatalog } from '@a2ui/web_core/catalogs/basic/v1';

export type ComponentNode = { id: string; component: string; [key: string]: unknown };

export function createSurface(components: ComponentNode[], dataModel: Record<string, unknown> = {}) {
  return {
    version: '1.0',
    createSurface: {
      surfaceId: 'storybook-basic',
      catalogId: basicCatalog.id,
      components,
      dataModel,
    },
  };
}

export const textNode = (id: string, text: string): ComponentNode => ({ id, component: 'Text', text });
