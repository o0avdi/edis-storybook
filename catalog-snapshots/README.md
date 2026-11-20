# Pre-generated catalog snapshots

> **These files are PRE-GENERATED.** They were copied from a real run of the commands in `PROVENANCE.json`, and they
> are committed so a presenter has a reliable offline fallback and the Storybook "Exporter" pages have something to
> show. (A Storybook build cannot display *fresh* exporter output, because the exporter reads that finished build.)

| Folder | What it is | Produced by |
| --- | --- | --- |
| `official-basic/` | The **official** A2UI Basic Catalog, SDK-authored. **Not** exporter output. | `npm run catalog:basic` → `basicCatalog.toJson()` |
| `extension/` | Exporter-generated catalog + report for `StatusBadge`, `MetricLabel`, `ProgressIndicator` | `storybook-a2ui export … --components StatusBadge,MetricLabel,ProgressIndicator` |
| `progress-indicator/` | Exporter-generated one-component catalog + report | `storybook-a2ui export … --components ProgressIndicator` |

Fresh output goes to `a2ui-catalog/` (gitignored). To refresh these copies after changing a source primitive:

```powershell
npm run catalog:all        # build Storybook, sync official catalog, inspect, export, verify
npm run catalog:snapshot   # copy a2ui-catalog/* here and rewrite PROVENANCE.json
```

`npm run catalog:verify` fails when these snapshots no longer match a fresh export. The comparison ignores only the
build hashes in `export-report.json` (`indexSha256`, `manifestSha256`), which change with any story edit.
