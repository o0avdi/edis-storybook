// Single source of truth for catalog locations and the exporter invocations used by the demo.

export const STORYBOOK_DIR = 'storybook-static';
export const OUTPUT_ROOT = 'a2ui-catalog';          // fresh results (gitignored)
export const SNAPSHOT_ROOT = 'catalog-snapshots';   // committed, clearly labeled pre-generated copies

export const OFFICIAL = {
  key: 'official-basic',
  dir: `${OUTPUT_ROOT}/basic`,
  label: 'Official A2UI Basic Catalog (SDK-authored via basicCatalog.toJson(); NOT exporter output)',
};

/** Real `storybook-a2ui export` runs. Explicit --components lists make each export all-or-nothing (strict). */
export const EXPORTS = {
  extension: {
    key: 'extension',
    label: 'Exporter-generated extension catalog (3 new React primitives)',
    components: ['StatusBadge', 'MetricLabel', 'ProgressIndicator'],
    catalogId: 'https://o0avdi.github.io/a2ui-basic-storybook/catalogs/extension/v1',
    title: 'Storybook Primitive Extension',
    out: `${OUTPUT_ROOT}/extension`,
  },
  single: {
    key: 'progress-indicator',
    label: 'Exporter-generated one-component catalog (ProgressIndicator)',
    components: ['ProgressIndicator'],
    catalogId: 'https://o0avdi.github.io/a2ui-basic-storybook/catalogs/progress-indicator/v1',
    out: `${OUTPUT_ROOT}/progress-indicator`,
  },
};

/** CLI arguments exactly as a developer would type them after `npx storybook-a2ui`. */
export function exportArgs(target) {
  return [
    'export',
    '--storybook', STORYBOOK_DIR,
    '--components', target.components.join(','),
    '--catalog-id', target.catalogId,
    '--out', target.out,
    ...(target.title ? ['--title', target.title] : []),
  ];
}

export const quote = (arg) => (/[\s"']/.test(arg) ? JSON.stringify(arg) : arg);
export const displayCommand = (args) => `npx storybook-a2ui ${args.map(quote).join(' ')}`;
