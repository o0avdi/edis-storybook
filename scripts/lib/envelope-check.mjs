// Validates one wire component ({ id, component, ...props }) against the pinned A2UI v1.0 envelope definition
// spec/v1_0/agent_to_renderer.json#/$defs/Component, with `catalog` standing in for catalog.json.
// Uses the exporter's own pinned spec files and its Ajv dependency; changes nothing on disk.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const exporterDir = dirname(require.resolve('storybook-a2ui/package.json'));
export const SPEC_DIR = join(exporterDir, 'spec/v1_0');
const Ajv2020Module = require(require.resolve('ajv/dist/2020', { paths: [exporterDir] }));
const Ajv2020 = Ajv2020Module.default ?? Ajv2020Module;
const readSpec = (file) => JSON.parse(readFileSync(join(SPEC_DIR, file), 'utf8'));

/**
 * The `discriminator` keyword is left to plain oneOf semantics: Ajv's discriminator support rejects the official
 * catalog's allOf-based components (an unrelated Ajv limitation), and oneOf gives the same answer here.
 */
export function envelopeCheck(catalog, instance) {
  const ajv = new Ajv2020({ strict: false, allErrors: true, validateFormats: false, logger: false });
  ajv.addSchema(readSpec('common_types.json'));
  ajv.addSchema({ ...catalog, $id: 'https://a2ui.org/specification/v1_0/catalog.json' });
  ajv.addSchema(readSpec('agent_to_renderer.json'));
  const validate = ajv.compile({ $ref: 'https://a2ui.org/specification/v1_0/agent_to_renderer.json#/$defs/Component' });
  const valid = validate(instance);
  return { valid, errors: (validate.errors ?? []).map((error) => `${error.schemaPath} ${error.message} ${JSON.stringify(error.params)}`) };
}

export const officialSpecCatalog = () => readSpec('basic_catalog.json');

/** In-memory copy with `additionalProperties: false` removed from every component (diagnostic only). */
export function withoutAdditionalPropertiesFalse(catalog) {
  const copy = structuredClone(catalog);
  for (const component of Object.values(copy.components)) delete component.additionalProperties;
  return copy;
}
