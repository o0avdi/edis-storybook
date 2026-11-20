/**
 * Read-only helpers over the OFFICIAL Basic Catalog JSON, serialized by the installed SDK
 * (`basicCatalog.toJson()` from `@a2ui/web_core`). Nothing here authors or edits schema;
 * it only reads what the SDK ships so explorer tables and story controls cannot drift from it.
 */
import { basicCatalog } from '@a2ui/web_core/catalogs/basic/v1';

export type JsonSchema = {
  type?: string | string[];
  enum?: unknown[];
  const?: unknown;
  default?: unknown;
  description?: string;
  $ref?: string;
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  items?: JsonSchema;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  minimum?: number;
  [key: string]: unknown;
};

export type CatalogJson = {
  catalogId: string;
  title?: string;
  description?: string;
  components: Record<string, JsonSchema>;
  functions: Record<string, JsonSchema>;
  $defs?: Record<string, JsonSchema>;
};

export const OFFICIAL_CATALOG = basicCatalog.toJson() as CatalogJson;
export const OFFICIAL_COMPONENT_NAMES = Object.keys(OFFICIAL_CATALOG.components);
export const OFFICIAL_FUNCTION_NAMES = Object.keys(OFFICIAL_CATALOG.functions);

export type PropertyRow = {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: unknown;
  description: string;
  schema: JsonSchema;
};

/** Short, human-readable type label for one property schema. */
export function typeLabel(schema: JsonSchema | undefined): string {
  if (!schema) return 'unknown';
  if (schema.const !== undefined) return JSON.stringify(schema.const);
  if (schema.enum) {
    const values = schema.enum.map((value) => JSON.stringify(value));
    return values.length > 8 ? `${values.slice(0, 4).join(' | ')} | … (${values.length} values)` : values.join(' | ');
  }
  if (schema.$ref) return refName(schema.$ref);
  if (schema.oneOf) return schema.oneOf.map(typeLabel).join(' | ');
  if (schema.anyOf) return schema.anyOf.map(typeLabel).join(' | ');
  if (schema.allOf) return schema.allOf.map(typeLabel).filter((label) => label !== 'unknown').join(' & ') || 'unknown';
  if (schema.type === 'array') return `${typeLabel(schema.items)}[]`;
  if (schema.type === 'object' && schema.properties) return `{ ${Object.keys(schema.properties).join(', ')} }`;
  if (Array.isArray(schema.type)) return schema.type.join(' | ');
  return schema.type ?? 'unknown';
}

export const refName = (ref: string) => ref.split('/').pop() ?? ref;

/** Resolves `#/$defs/...` references inside the official catalog document (local refs only). */
function resolveLocal(schema: JsonSchema): JsonSchema {
  if (schema.$ref?.startsWith('#/$defs/')) {
    const target = OFFICIAL_CATALOG.$defs?.[refName(schema.$ref)];
    if (target) return { ...target, ...schema, $ref: undefined, description: schema.description ?? target.description };
  }
  return schema;
}

/** Flattens a component definition (including `allOf` mixins) into table rows. */
export function propertyRows(schema: JsonSchema | undefined): PropertyRow[] {
  if (!schema) return [];
  const parts = [schema, ...(schema.allOf ?? [])];
  const required = new Set(parts.flatMap((part) => part.required ?? []));
  const mixins = (schema.allOf ?? []).filter((part) => part.$ref).map((part) => refName(part.$ref!));
  const rows: PropertyRow[] = [];
  for (const part of parts) {
    for (const [name, raw] of Object.entries(part.properties ?? {})) {
      const property = resolveLocal(raw);
      rows.push({
        name,
        type: raw.$ref?.startsWith('#/') ? typeLabel(property) : typeLabel(raw),
        required: required.has(name),
        defaultValue: property.default,
        description: property.description ?? '',
        schema: property,
      });
    }
  }
  for (const mixin of mixins) {
    rows.push({
      name: `…${mixin}`,
      type: mixin,
      required: false,
      description: MIXIN_NOTES[mixin] ?? `Inherits properties from common_types.json#/$defs/${mixin}.`,
      schema: { $ref: mixin },
    });
  }
  return rows;
}

const MIXIN_NOTES: Record<string, string> = {
  Checkable: 'Inherits `checks` (renderer-side validation rules) from the shared A2UI common types.',
};

export const componentRows = (name: string) => propertyRows(OFFICIAL_CATALOG.components[name]);

/** Official schema for one property of one component (after flattening). */
export function officialProperty(component: string, property: string): PropertyRow | undefined {
  return componentRows(component).find((row) => row.name === property);
}

/** Enum values declared by the SDK for a component property (used for Storybook select controls). */
export function officialEnum(component: string, property: string): string[] {
  const schema = officialProperty(component, property)?.schema;
  const values = schema?.enum ?? schema?.oneOf?.find((option) => option.enum)?.enum ?? [];
  return values.filter((value): value is string => typeof value === 'string');
}

/**
 * One-line summaries of shared A2UI v1.0 types that the Basic Catalog references via `common_types.json`.
 * Wording condensed from the definitions in `@a2ui/web_core/src/v1_0/schemas/common_types.json`.
 */
export const COMMON_TYPES: Record<string, string> = {
  DynamicString: 'A literal string, a data binding ({ "@path": "/x" }), or a function call returning a string.',
  DynamicNumber: 'A literal number, a data binding, or a function call returning a number.',
  DynamicBoolean: 'A literal boolean, a data binding, or a function call returning a boolean / validation result.',
  DynamicStringList: 'A literal string array, a binding to a string array, or a function call returning one.',
  Child: 'The id of a single child component defined elsewhere in the same surface.',
  ChildList: 'An array of child ids, or a template object that generates children from a data list.',
  Action: 'An interaction handler: an agent-side event ({ event: { name, context } }) or a renderer-side function call.',
  Checkable: 'Mixin adding renderer-side validation `checks` to input-like components.',
  Weight: 'Relative flex-grow weight; only valid on a direct child of a Row or Column.',
};
