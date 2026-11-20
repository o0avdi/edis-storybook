// Verifies the catalog artifacts and keeps their provenance separate:
//  1. official Basic Catalog (SDK) is intact,
//  2. each exporter run succeeded strictly, and independently re-validates against the pinned A2UI v1.0 schemas,
//  3. sample component bodies validate (and broken ones are rejected); the known envelope-"id" finding is reported,
//  4. official and exported catalogs are not conflated,
//  5. committed pre-generated snapshots match the fresh output (so their label stays true).
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createComponentInstanceValidator, validateV1Export } from 'storybook-a2ui/src/a2ui/validate.mjs';
import { EXPORTS, OFFICIAL, SNAPSHOT_ROOT } from './catalog-config.mjs';
import { envelopeCheck } from './lib/envelope-check.mjs';

const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const ok = (message) => console.log(`PASS  ${message}`);

// 1. Official Basic Catalog
const official = read(`${OFFICIAL.dir}/catalog.json`);
assert.equal(official.catalogId, 'https://a2ui.org/specification/v1_0/catalogs/basic/catalog.json');
const officialNames = Object.keys(official.components);
assert.ok(officialNames.length >= 18, 'Expected the SDK Basic Catalog components');
for (const name of ['Text', 'Row', 'Column', 'Card', 'Button', 'TextField']) assert.ok(official.components[name], `${name} missing`);
ok(`official Basic Catalog: ${officialNames.length} components, ${Object.keys(official.functions).length} functions (SDK-authored)`);

// 2-4. Exporter outputs. Samples are component BODIES (no envelope "id"), which is what the exporter's
// createComponentInstanceValidator checks against $defs/anyComponent.
const samples = {
  StatusBadge: { valid: { component: 'StatusBadge', label: 'Synced', status: 'success' }, invalid: { component: 'StatusBadge', label: 'Synced', status: 'error' } },
  MetricLabel: { valid: { component: 'MetricLabel', label: 'Spent', value: 1780, format: 'currency' }, invalid: { component: 'MetricLabel', label: 'Spent' } },
  ProgressIndicator: { valid: { component: 'ProgressIndicator', label: 'Budget used', value: 74, tone: 'warning' }, invalid: { component: 'ProgressIndicator', value: 74, color: 'red' } },
};
const knownFindings = new Set();

for (const target of Object.values(EXPORTS)) {
  const catalog = read(`${target.out}/catalog.json`);
  const report = read(`${target.out}/export-report.json`);
  const names = Object.keys(catalog.components);

  assert.equal(report.result, 'exported', `${target.key}: exporter result is ${report.result}`);
  assert.equal(report.policy.unmappedEvents, 'fail', `${target.key}: export must use the strict default policy`);
  assert.equal(report.validation?.valid, true, `${target.key}: exporter validation did not pass`);
  assert.deepEqual(names.sort(), [...target.components].sort(), `${target.key}: unexpected component set`);
  for (const entry of report.components) {
    assert.equal(entry.status, 'exported', `${target.key}: ${entry.name} is ${entry.status}`);
    assert.deepEqual(entry.blocking, [], `${target.key}: ${entry.name} has blocking issues`);
  }
  assert.equal(catalog.catalogId, target.catalogId);
  assert.notEqual(catalog.catalogId, official.catalogId, 'exported catalog must not reuse the official catalog id');
  for (const name of names) assert.ok(!officialNames.includes(name), `${name} collides with an official Basic Catalog component`);

  validateV1Export(catalog); // throws on failure; same pinned schemas the exporter uses
  const validateInstance = createComponentInstanceValidator(catalog);
  for (const name of names) {
    assert.equal(validateInstance(samples[name].valid).valid, true, `${name}: valid sample rejected`);
    assert.equal(validateInstance(samples[name].invalid).valid, false, `${name}: invalid sample accepted`);
  }
  const props = report.components.map((entry) => `${entry.name}(${entry.properties.join(', ')})`).join('; ');
  ok(`${target.label}: ${props}`);
  ok(`  re-validated against pinned A2UI v1.0 schemas; sample component bodies accepted, broken ones rejected`);

  // Known exporter finding (docs/EXPORTER_FINDINGS.md): reported, not hidden, and not "fixed" by editing output.
  const wire = { id: 'sample', ...samples[names[0]].valid };
  if (!envelopeCheck(catalog, wire).valid) knownFindings.add(target.key);
}
if (knownFindings.size)
  console.log(`KNOWN exporter finding: additionalProperties:false rejects the envelope "id" in ${[...knownFindings].join(', ')} ` +
    '(wire-level validation of { id, component, ... }). Not patched here; see docs/EXPORTER_FINDINGS.md and scripts/repro-envelope-id.mjs.');
else console.log('INFO  envelope "id" finding no longer reproduces; update docs/EXPORTER_FINDINGS.md.');

// 5. Snapshot drift
const withoutBuildHashes = (report) => ({ ...report, builds: report.builds.map(({ indexSha256, manifestSha256, ...rest }) => rest) });
const snapshots = [
  [`${OFFICIAL.dir}/catalog.json`, `${SNAPSHOT_ROOT}/${OFFICIAL.key}/catalog.json`, (value) => value],
  ...Object.values(EXPORTS).flatMap((target) => [
    [`${target.out}/catalog.json`, `${SNAPSHOT_ROOT}/${target.key}/catalog.json`, (value) => value],
    [`${target.out}/export-report.json`, `${SNAPSHOT_ROOT}/${target.key}/export-report.json`, withoutBuildHashes],
  ]),
];
const missing = snapshots.filter(([, snapshot]) => !existsSync(snapshot));
if (missing.length) {
  console.warn(`WARN  no pre-generated snapshot yet (${missing.map(([, file]) => file).join(', ')}). Run: npm run catalog:snapshot`);
} else {
  for (const [fresh, snapshot, normalize] of snapshots)
    assert.deepEqual(normalize(read(snapshot)), normalize(read(fresh)),
      `${snapshot} is out of date with ${fresh}. Review the change, then run: npm run catalog:snapshot`);
  ok(`pre-generated snapshots in ${SNAPSHOT_ROOT}/ match the fresh output`);
}
console.log('\nNOTE: the official Basic Catalog is copied from the SDK, not produced by the Storybook exporter.');
