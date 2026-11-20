import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const official = read('a2ui-catalog/basic/catalog.json');
assert.equal(official.catalogId, 'https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json');
assert.ok(Object.keys(official.components).length >= 18, 'Expected SDK Basic Catalog components');
assert.ok(official.components.Text && official.components.Row && official.components.Column && official.components.Button);
console.log(`SDK Basic Catalog: ${Object.keys(official.components).length} components, ${Object.keys(official.functions).length} functions`);

const extension = read('a2ui-catalog/extension/catalog.json');
const report = read('a2ui-catalog/extension/export-report.json');
assert.ok(extension.components.StatusBadge, 'StatusBadge was not exported from Storybook');
assert.equal(report.result, 'exported');
assert.equal(report.validation?.valid, true, 'Exporter validation did not pass');
assert.equal(report.components.find((c) => c.name === 'StatusBadge')?.status, 'exported');
console.log('Storybook-exported extension: StatusBadge; official A2UI v1.0 schema validation PASS');
console.log('NOTE: SDK Basic Catalog is copied from its authoritative source, not produced by this exporter.');
