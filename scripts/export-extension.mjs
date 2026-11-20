// Runs the real, unmodified storybook-a2ui CLI (pinned in package.json) and prints the exact command.
//
//   node scripts/export-extension.mjs inspect      -> storybook-a2ui inspect
//   node scripts/export-extension.mjs extension    -> 3-component extension catalog
//   node scripts/export-extension.mjs single       -> 1-component catalog (ProgressIndicator)
//   node scripts/export-extension.mjs all          -> extension + single
//
// The only convenience added here: the target --out directory (always inside a2ui-catalog/) is cleared first,
// because the CLI requires a new or empty directory. Exit codes and CLI output are passed through unchanged.
import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { EXPORTS, OUTPUT_ROOT, STORYBOOK_DIR, displayCommand, exportArgs } from './catalog-config.mjs';

const cli = resolve('node_modules/storybook-a2ui/bin/storybook-a2ui.mjs');
const manifest = resolve(STORYBOOK_DIR, 'manifests/components.json');
const mode = process.argv[2] ?? 'all';
const plans = { inspect: [], extension: [EXPORTS.extension], single: [EXPORTS.single], all: [EXPORTS.extension, EXPORTS.single] };

if (!(mode in plans)) {
  console.error(`Unknown mode "${mode}". Use one of: ${Object.keys(plans).join(', ')}.`);
  process.exit(2);
}
if (!existsSync(cli)) {
  console.error('storybook-a2ui is not installed. Run "npm ci" first.');
  process.exit(2);
}
if (!existsSync(manifest)) {
  console.error(`Missing ${STORYBOOK_DIR}/manifests/components.json. Run "npm run build-storybook" first ` +
    '(a static build is required even while "npm run storybook" is running).');
  process.exit(2);
}

function run(args) {
  console.log(`\n$ ${displayCommand(args)}`);
  console.log('  (runs node_modules/storybook-a2ui/bin/storybook-a2ui.mjs, the binary npx resolves to)\n');
  const result = spawnSync(process.execPath, [cli, ...args], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 2);
}

if (mode === 'inspect') {
  run(['inspect', '--storybook', STORYBOOK_DIR]);
} else {
  const root = resolve(OUTPUT_ROOT) + sep;
  for (const target of plans[mode]) {
    const out = resolve(target.out);
    if (!out.startsWith(root)) throw new Error(`Refusing to clear ${out}: outside ${OUTPUT_ROOT}/`);
    rmSync(out, { recursive: true, force: true });
    console.log(`\n== ${target.label}`);
    run(exportArgs(target));
  }
  console.log('\nOfficial Basic Catalog is NOT part of this conversion; it comes from the SDK (npm run catalog:basic).');
}
