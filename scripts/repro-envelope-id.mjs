// Reproducer for an exporter interoperability finding (docs/EXPORTER_FINDINGS.md). Read-only: writes nothing.
//
// The pinned A2UI v1.0 envelope (spec/v1_0/agent_to_renderer.json#/$defs/Component) is
//   allOf: [ common_types.json#/$defs/ComponentCommon (declares "id"), catalog.json#/$defs/anyComponent ]
//   unevaluatedProperties: false
// storybook-a2ui emits every component with `additionalProperties: false`. In JSON Schema 2020-12 that keyword only
// sees the properties declared in its own subschema, so the envelope's "id" counts as "additional" and is rejected.
// Official Basic Catalog components omit additionalProperties and rely on the envelope's unevaluatedProperties.
//
// Usage: node scripts/repro-envelope-id.mjs [path/to/exported/catalog.json]
import { readFileSync } from 'node:fs';
import { envelopeCheck, officialSpecCatalog, withoutAdditionalPropertiesFalse } from './lib/envelope-check.mjs';

const exportedPath = process.argv[2] ?? 'a2ui-catalog/progress-indicator/catalog.json';
const exported = JSON.parse(readFileSync(exportedPath, 'utf8'));
const progress = { id: 'progress', component: 'ProgressIndicator', label: 'Budget used', value: 74 };

const cases = [
  ['official Basic Catalog (exporter spec/v1_0/basic_catalog.json)', officialSpecCatalog(), { id: 'greeting', component: 'Text', text: 'Hello' }],
  [`exported catalog as written (${exportedPath})`, exported, progress],
  ['CONTROL: same exported catalog, additionalProperties:false removed in memory', withoutAdditionalPropertiesFalse(exported), progress],
  ['CONTROL: same, plus an undeclared property (must still be rejected)', withoutAdditionalPropertiesFalse(exported), { ...progress, color: 'red' }],
];

const results = cases.map(([label, catalog, instance]) => {
  const { valid, errors } = envelopeCheck(catalog, instance);
  console.log(`${valid ? 'VALID  ' : 'INVALID'}  ${label}\n         ${JSON.stringify(instance)}`);
  for (const error of errors.filter((line) => /additional|unevaluated/.test(line)).slice(0, 2)) console.log(`         ${error}`);
  return valid;
});

const reproduced = results[0] && !results[1] && results[2] && !results[3];
console.log(reproduced
  ? '\nReproduced: the exported catalog rejects a standard wire component because of additionalProperties:false;\n' +
    'without it, the envelope\'s unevaluatedProperties:false still rejects undeclared properties.'
  : '\nNot reproduced with this catalog (the exporter behavior may have changed).');
