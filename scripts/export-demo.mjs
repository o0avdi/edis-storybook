// npm run export:demo
//
// The live showcase command. Runs the real, unmodified storybook-a2ui CLI on the already-built Storybook and exports
// ONLY ProgressIndicator with the exporter's strict defaults (no policy flags). Every run writes to a brand-new folder,
// demo-output/run-001, run-002, ..., so nothing is ever overwritten, and demo-examples/ is never touched.
// Plain Node.js: works the same on macOS, Linux and Windows.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { EXPORTS, STORYBOOK_DIR, displayCommand, exportArgs } from './catalog-config.mjs';

const OUTPUT_ROOT = 'demo-output';
const FROZEN_EXAMPLE = 'demo-examples/01-single-component/catalog.json';
const cli = resolve('node_modules/storybook-a2ui/bin/storybook-a2ui.mjs');
const manifest = `${STORYBOOK_DIR}/manifests/components.json`;

if (!existsSync(cli)) stop('The exporter is not installed. Run "npm ci" once, then try again.');
if (!existsSync(manifest))
  stop(`No Storybook build found (${manifest} is missing).\n` +
    'Run "npm run build-storybook" once before the demo (about a minute), then run "npm run export:demo" again.\n' +
    'The exporter reads the static build; "npm run storybook" alone does not create it.');

// Claim the next unused run folder. mkdirSync without { recursive } fails if the folder exists, so a run can never
// reuse (or overwrite) an earlier one, even if two commands start at the same moment.
mkdirSync(OUTPUT_ROOT, { recursive: true });
const used = readdirSync(OUTPUT_ROOT).map((name) => /^run-(\d+)$/.exec(name)?.[1]).filter(Boolean).map(Number);
let number = Math.max(0, ...used) + 1;
let out;
for (;; number += 1) {
  out = `${OUTPUT_ROOT}/run-${String(number).padStart(3, '0')}`;
  try {
    mkdirSync(out);
    break;
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}
if (!resolve(out).startsWith(resolve(OUTPUT_ROOT) + sep)) stop(`Refusing to write outside ${OUTPUT_ROOT}/: ${out}`);

const args = exportArgs({ ...EXPORTS.single, out });
console.log('Live export: Storybook build -> A2UI catalog for ONE component (ProgressIndicator), strict defaults.\n');
console.log('The command a developer would run:\n');
console.log(`  ${displayCommand(args)}\n`);

const result = spawnSync(process.execPath, [cli, ...args], { stdio: 'inherit' });
const reportFile = `${out}/export-report.json`;
const report = existsSync(reportFile) ? JSON.parse(readFileSync(reportFile, 'utf8')) : null;

if (result.status !== 0 || report?.result !== 'exported') {
  console.log(`\nEXPORT FAILED (exit code ${result.status ?? 'none'}). Output folder: ${out}/`);
  console.log(`The frozen examples are unaffected and can still be shown: demo-examples/ (npm run examples:show).`);
  process.exit(result.status || 1);
}

const fresh = readFileSync(`${out}/catalog.json`);
const sameAsFrozen = existsSync(FROZEN_EXAMPLE) && fresh.equals(readFileSync(FROZEN_EXAMPLE));
console.log('\nEXPORT SUCCEEDED');
console.log(`  components:   ${report.components.map((entry) => `${entry.name} (${entry.properties.join(', ')})`).join('; ')}`);
console.log(`  validation:   ${report.validation?.valid ? 'PASS against the official A2UI v1.0 schemas' : 'not passed'}`);
console.log(`  policy:       strict default (unmapped events: ${report.policy?.unmappedEvents})`);
console.log(`  catalog:      ${out}/catalog.json`);
console.log(`  report:       ${out}/export-report.json`);
console.log(`  frozen copy:  ${FROZEN_EXAMPLE} (${sameAsFrozen ? 'identical to this run' : 'differs from this run; the frozen file was not changed'})`);

function stop(message) {
  console.error(`\n${message}\n`);
  process.exit(2);
}
