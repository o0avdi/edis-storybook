// Copies fresh catalog output from a2ui-catalog/ into catalog-snapshots/ as clearly labeled, committed,
// PRE-GENERATED fallbacks (used by the Storybook "Exporter" pages and as a no-network presenter backup).
// Run after `npm run demo:export`. The content is deterministic: no timestamps are added.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { EXPORTS, OFFICIAL, SNAPSHOT_ROOT, displayCommand, exportArgs } from './catalog-config.mjs';

const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const version = (name) => lock.packages[`node_modules/${name}`]?.version;

const copy = (from, to) => {
  if (!existsSync(from)) throw new Error(`Missing ${from}. Run "npm run demo:export" first.`);
  copyFileSync(from, to);
  console.log(`snapshot  ${from}  ->  ${to}`);
};

mkdirSync(`${SNAPSHOT_ROOT}/${OFFICIAL.key}`, { recursive: true });
copy(`${OFFICIAL.dir}/catalog.json`, `${SNAPSHOT_ROOT}/${OFFICIAL.key}/catalog.json`);
for (const target of Object.values(EXPORTS)) {
  mkdirSync(`${SNAPSHOT_ROOT}/${target.key}`, { recursive: true });
  copy(`${target.out}/catalog.json`, `${SNAPSHOT_ROOT}/${target.key}/catalog.json`);
  copy(`${target.out}/export-report.json`, `${SNAPSHOT_ROOT}/${target.key}/export-report.json`);
}

const provenance = {
  notice: 'PRE-GENERATED SNAPSHOT. Copied from a real run; regenerate with "npm run demo:export && npm run catalog:snapshot".',
  generatedBy: 'scripts/snapshot-catalogs.mjs',
  tools: {
    'storybook-a2ui': lock.packages['node_modules/storybook-a2ui']?.resolved ?? null,
    storybook: version('storybook'),
    '@a2ui/web_core': version('@a2ui/web_core'),
  },
  artifacts: {
    [OFFICIAL.key]: {
      label: OFFICIAL.label,
      producedBy: 'npm run catalog:basic  (node scripts/sync-basic.mjs -> basicCatalog.toJson())',
      files: ['catalog.json'],
    },
    ...Object.fromEntries(Object.values(EXPORTS).map((target) => [target.key, {
      label: target.label,
      producedBy: displayCommand(exportArgs(target)),
      files: ['catalog.json', 'export-report.json'],
    }])),
  },
};
writeFileSync(`${SNAPSHOT_ROOT}/PROVENANCE.json`, JSON.stringify(provenance, null, 2) + '\n');
console.log(`wrote     ${SNAPSHOT_ROOT}/PROVENANCE.json`);
