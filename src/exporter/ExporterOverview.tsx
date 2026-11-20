import { useState } from 'react';
import { CopyButton, JsonView } from '../basic/JsonView';
import { OFFICIAL_CATALOG, OFFICIAL_COMPONENT_NAMES } from '../basic/schema';
import { SchemaTable } from '../basic/SchemaTable';
import { explorerHref } from '../basic/storyLinks';
import { SNAPSHOTS, type ExportReport } from './snapshots';

type Tab = 'single' | 'extension' | 'report' | 'official';

const TABS: { id: Tab; label: string }[] = [
  { id: 'single', label: '1 · One component' },
  { id: 'extension', label: '2 · Extension catalog' },
  { id: 'report', label: '3 · Export report' },
  { id: 'official', label: '4 · Official Basic Catalog (reference)' },
];

function Command({ text }: { text: string }) {
  return (
    <div className="command">
      <pre>{text}</pre>
      <CopyButton text={text} label="Copy" />
    </div>
  );
}

function ReportTable({ report }: { report: ExportReport }) {
  return (
    <table className="report-table">
      <thead>
        <tr>
          <th scope="col">Component</th>
          <th scope="col">Status</th>
          <th scope="col">Exported properties</th>
          <th scope="col">Blocking / omitted</th>
        </tr>
      </thead>
      <tbody>
        {report.components.map((entry) => (
          <tr key={entry.name}>
            <th scope="row">
              <code>{entry.name}</code>
            </th>
            <td className={`status status--${entry.status}`}>{entry.status}</td>
            <td>{entry.properties.map((property) => <code key={property} style={{ marginRight: 8 }}>{property}</code>)}</td>
            <td>
              {entry.blocking.length === 0 && entry.omittedKnown.length === 0 ? (
                <span className="muted">none reported (see notice: not proof of completeness)</span>
              ) : (
                [...entry.blocking.map((issue) => `${issue.code}: ${issue.message}`), ...entry.omittedKnown.map((item) => `omitted ${item.kind} ${item.name}: ${item.reason}`)].map(
                  (line) => <div key={line}>{line}</div>,
                )
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Presenter page for the Storybook → A2UI exporter, built from committed pre-generated snapshots. */
export function ExporterOverview() {
  const [tab, setTab] = useState<Tab>('single');
  const { provenance, extension, single } = SNAPSHOTS;
  const singleCommand = provenance?.artifacts['progress-indicator']?.producedBy;
  const extensionCommand = provenance?.artifacts.extension?.producedBy;
  const singleName = single.catalog ? Object.keys(single.catalog.components)[0] : undefined;

  if (!provenance || !extension.catalog || !extension.report || !single.catalog || !single.report) {
    return (
      <section className="exporter">
        <h1>Storybook → A2UI exporter</h1>
        <p className="provenance provenance--snapshot">
          No pre-generated snapshot found in <code>catalog-snapshots/</code>. Run <code>npm run catalog:all</code> and{' '}
          <code>npm run catalog:snapshot</code>, then reload.
        </p>
      </section>
    );
  }

  return (
    <section className="exporter">
      <p className="eyebrow">Exporter · new primitives only</p>
      <h1>Storybook → A2UI exporter</h1>
      <p className="lede">
        <code>storybook-a2ui</code> reads Storybook&rsquo;s component manifest for <strong>new React source primitives</strong> and
        writes an <em>additional</em> A2UI catalog. It does not re-export the SDK&rsquo;s Basic Catalog, and it blocks events,
        children, arrays and objects instead of guessing.
      </p>

      <div className="exporter-grid">
        <div className="exporter-card">
          <h3>1. React source</h3>
          <p>
            <code>src/extensions/*.tsx</code> with flat string / number / boolean / enum props.
          </p>
        </div>
        <div className="exporter-card">
          <h3>2. Storybook build</h3>
          <p>
            <code>npm run build-storybook</code> writes <code>index.json</code> and <code>manifests/components.json</code>.
          </p>
        </div>
        <div className="exporter-card">
          <h3>3. Exporter (strict)</h3>
          <p>Converts docgen props, validates against pinned A2UI v1.0 schemas, writes catalog + report.</p>
        </div>
      </div>

      <h2 style={{ marginTop: 28 }}>Live command (one component)</h2>
      {singleCommand && <Command text={singleCommand} />}
      <p className="small muted">
        Or <code>npm run catalog:export:one</code>, which clears the output folder, prints this command and runs it. Multi-component run:
      </p>
      {extensionCommand && <Command text={extensionCommand} />}

      <p className="provenance provenance--snapshot" style={{ marginTop: 20 }}>
        <strong>Pre-generated snapshot.</strong> The JSON below is committed in <code>catalog-snapshots/</code>, copied from a real
        run of the commands above ({provenance.tools['storybook-a2ui']?.replace(/^git\+ssh:\/\/git@|^git\+https:\/\//, '')}). Storybook
        cannot display fresh exporter output, because the exporter reads the finished Storybook build. Fresh results go to{' '}
        <code>a2ui-catalog/</code>; <code>npm run catalog:verify</code> fails if the snapshot drifts.
      </p>

      <div className="tabs-bar" role="tablist" aria-label="Catalog artifacts">
        {TABS.map(({ id, label }) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'single' && singleName && (
        <div role="tabpanel" aria-label="One-component catalog">
          <p className="provenance provenance--source">
            <strong>Exporter output.</strong> One component, <code>{singleName}</code>, catalog id <code>{single.catalog.catalogId}</code>.
            Result: <strong>{single.report.result}</strong>, A2UI v1.0 validation:{' '}
            <strong>{single.report.validation?.valid ? 'PASS' : 'FAIL'}</strong>.
          </p>
          <SchemaTable schema={single.catalog.components[singleName]} />
          <div style={{ marginTop: 16 }}>
            <JsonView value={single.catalog} title="progress-indicator/catalog.json" caption="exporter output · pre-generated" maxHeight="60vh" />
          </div>
        </div>
      )}

      {tab === 'extension' && (
        <div role="tabpanel" aria-label="Extension catalog">
          <p className="provenance provenance--source">
            <strong>Exporter output.</strong> {Object.keys(extension.catalog.components).length} components (
            {Object.keys(extension.catalog.components).join(', ')}), catalog id <code>{extension.catalog.catalogId}</code>. This is an{' '}
            <em>additional</em> catalog: a renderer must register implementations for these names before an agent can use them.
          </p>
          <JsonView value={extension.catalog} title="extension/catalog.json" caption="exporter output · pre-generated" maxHeight="70vh" />
        </div>
      )}

      {tab === 'report' && (
        <div role="tabpanel" aria-label="Export report">
          <p className="provenance provenance--source">
            <strong>Exporter report.</strong> Result <strong>{extension.report.result}</strong>, policy{' '}
            <code>unmappedEvents: {extension.report.policy.unmappedEvents}</code> (strict default), validator:{' '}
            {extension.report.validation?.validator} → <strong>{extension.report.validation?.valid ? 'PASS' : 'FAIL'}</strong>.
          </p>
          <ReportTable report={extension.report} />
          <p className="docs-note">{extension.report.notice}</p>
          <p className="provenance provenance--snapshot">
            <strong>Known finding (not patched here).</strong> Every exported component has <code>additionalProperties: false</code>,
            so a full wire component such as <code>{'{ "id": "p", "component": "ProgressIndicator", … }'}</code> fails the pinned
            A2UI v1.0 envelope schema because of its <code>id</code>, while the official Basic Catalog accepts the equivalent. The
            exporter&rsquo;s own validation (catalog structure and component bodies) still passes. Reproducer:{' '}
            <code>node scripts/repro-envelope-id.mjs</code>; details in <code>docs/EXPORTER_FINDINGS.md</code>.
          </p>
          <JsonView value={extension.report} title="extension/export-report.json" caption="exporter output · pre-generated" maxHeight="60vh" />
        </div>
      )}

      {tab === 'official' && (
        <div role="tabpanel" aria-label="Official Basic Catalog">
          <p className="provenance provenance--sdk">
            <strong>SDK-authored reference, not exporter output.</strong> {OFFICIAL_COMPONENT_NAMES.length} components from{' '}
            <code>basicCatalog.toJson()</code> in the installed SDK, catalog id <code>{OFFICIAL_CATALOG.catalogId}</code>. Browse it
            properly in the{' '}
            <a href={explorerHref()} target="_top">
              catalog explorer
            </a>
            .
          </p>
          <JsonView value={OFFICIAL_CATALOG} title="basicCatalog.toJson()" caption="SDK-authored · live from installed SDK" maxHeight="70vh" />
        </div>
      )}
    </section>
  );
}
