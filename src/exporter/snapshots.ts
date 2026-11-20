/**
 * Committed, PRE-GENERATED exporter output (catalog-snapshots/), loaded for display in Storybook.
 *
 * Storybook cannot show *fresh* exporter output: the exporter reads the finished Storybook build, so the
 * build cannot depend on its result. These files are copied from a real run by `npm run catalog:snapshot`,
 * and `npm run catalog:verify` fails if they drift from a fresh export.
 */
import type { CatalogJson } from '../basic/schema';

const files = import.meta.glob('../../catalog-snapshots/**/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;

export type ExportReport = {
  generator: string;
  protocolVersion: string;
  catalogId: string;
  policy: { unmappedEvents: string };
  notice: string;
  result: string;
  validation?: { validator: string; valid: boolean };
  builds: { directory: string; adapter: string; manifestVersion: number; docgen: string | null }[];
  components: {
    name: string;
    id: string;
    status: 'exported' | 'blocked';
    properties: string[];
    contract: Record<string, unknown>;
    omittedKnown: { kind: string; name: string; reason: string }[];
    blocking: { code: string; subject: string; message: string }[];
    warnings: { code: string; message: string }[];
  }[];
};

export type Provenance = {
  notice: string;
  tools: Record<string, string | null>;
  artifacts: Record<string, { label: string; producedBy: string; files: string[] }>;
};

const get = <T>(path: string) => files[`../../catalog-snapshots/${path}`] as T | undefined;

export const SNAPSHOTS = {
  provenance: get<Provenance>('PROVENANCE.json'),
  extension: { catalog: get<CatalogJson>('extension/catalog.json'), report: get<ExportReport>('extension/export-report.json') },
  single: {
    catalog: get<CatalogJson>('progress-indicator/catalog.json'),
    report: get<ExportReport>('progress-indicator/export-report.json'),
  },
};

export const exportedComponent = (name: string) => SNAPSHOTS.extension.catalog?.components[name];
