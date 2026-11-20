# Verification record

## EDIS final preparation (branch `feat/edis-final-demo`)

Local run on 2026-11-20: Windows 11, Node 24.20.0, npm 11.19.0, Google Chrome via Playwright. Started from clean
`storybook-static/`, `a2ui-catalog/` and `demo-output/` folders. **Not run on macOS** (see "macOS" below).

| Check | Command / method | Result |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | PASS |
| Build + full catalog pipeline | `npm run catalog:all` | PASS. Same `PASS`/`KNOWN` lines as below, plus both frozen examples `unchanged ... valid A2UI v1.0 catalog`. Build output has one existing Vite chunk-size notice, also present on the baseline branch |
| Manifest after hiding exporter stories | Playwright: `GET /manifests/components.json` | Exactly `MetricLabel`, `ProgressIndicator`, `StatusBadge`. Hidden stories still listed in `index.json` |
| Sidebar | Playwright: sidebar roots | Exactly `Start Here`, `Basic Catalog`, `Composed Example`; no "Exporter" text |
| Explorer | Playwright | 18 components, no Functions list or count; filtering `format` returns no entries; raw JSON still contains `functions` / `formatCurrency` |
| Live export, twice | `npm run export:demo` ×2 | Both exit 0 with `EXPORT SUCCEEDED`; created `demo-output/run-001/` and `run-002/`, each with `catalog.json` + `export-report.json`; policy `unmappedEvents: fail` |
| Frozen examples unchanged | SHA-256 before/after both exports | Byte-identical (`ce91ee5b...` and `8599d65b...`). Run output also byte-identical to example 1 |
| Missing build | `export:demo` with `manifests/` renamed | Friendly "run npm run build-storybook" message, exit 2, no run folder created |
| Tamper detection | append one byte to example 1, `npm run examples:verify` | FAIL with old/new hashes and restore instruction; PASS after restore |
| Clean install without SSH | fresh clone + `npm ci` with SSH disabled and an empty npm cache | PASS: the pinned exporter installs over HTTPS (public repo), so no GitHub SSH key is needed |
| E2E + screenshots | `npm run screenshots` (same tests as `test:e2e`) | **24 passed**: the 22 original tests (Actions, bindings, budget flow, JSON view, explorer, all-stories smoke) + sidebar and manifest checks |

### macOS

Not tested on a Mac. Reviewed for portability: every npm script is plain Node.js (no PowerShell/Bash), paths are
relative, `package-lock.json` contains the `darwin-arm64` and `darwin-x64` native packages (esbuild, rolldown,
lightningcss, oxc, TypeScript), and `.gitattributes` keeps the frozen JSON bytes identical across platforms. Eric
should run the README's macOS commands once before the showcase and confirm `npm run examples:verify` prints two
`PASS` lines and `npm run export:demo` prints `EXPORT SUCCEEDED`.

## Earlier record (branch `feat/storybook-demo-polish`)

Local run on 2026-11-19: Windows 11, Node 24.20.0, npm 11.19.0, Google Chrome (via Playwright `channel: 'chrome'`).
Branch `feat/storybook-demo-polish`. The commands are the ones in `package.json`; results are copied from the actual output.

| Gate | Command | Result |
| --- | --- | --- |
| 1. Typecheck | `npm run typecheck` | PASS (no diagnostics) |
| 2. Static build | `npm run build-storybook` | PASS. `storybook-static/index.json` has 74 entries (54 stories, 20 docs pages); `manifests/components.json` has exactly `StatusBadge`, `MetricLabel`, `ProgressIndicator` |
| 3. Inspect + strict export | `npm run catalog:inspect`, `npm run catalog:export` | PASS. Inspect: `OK` for all 3, 0 blocked. Both exports (3-component and 1-component) print `official A2UI v1.0 validation: PASS` with the default `--unmapped-events fail` |
| 4. Schema validation | `npm run catalog:verify` | PASS (see output below). Also one `KNOWN` finding, reported and not hidden |
| 5. Runtime errors | `npm run test:e2e` → `smoke.spec.ts` | PASS. All 74 stories and docs pages load with no uncaught errors, no console errors, and no SDK validation error boxes |
| 6. Actions + interactive controls | `npm run test:e2e` → `interactions.spec.ts`, `composition-and-catalogs.spec.ts` | PASS (22/22 tests). Screenshots in `docs/screenshots/after/` |
| 7. Provenance documented | README, `docs/DEMO_WALKTHROUGH.md`, `catalog-snapshots/README.md`, `docs/EXPORTER_FINDINGS.md` | Done |

Also checked:

- `npm ci --dry-run` succeeds on the committed lockfile.
- The README's raw PowerShell `npx storybook-a2ui export … --out a2ui-catalog/live` command works as written, and its
  `catalog.json` is byte-identical to `catalog-snapshots/progress-indicator/catalog.json` (the output is deterministic).
- `npm run catalog:show` falls back to `catalog-snapshots/` and labels the output `[PRE-GENERATED SNAPSHOT]`
  when `a2ui-catalog/` is absent.

## `npm run catalog:verify`

```
PASS  official Basic Catalog: 18 components, 14 functions (SDK-authored)
PASS  Exporter-generated extension catalog (3 new React primitives): MetricLabel(label, value, format, trend); ProgressIndicator(label, value, max, tone, showValue); StatusBadge(label, status)
PASS    re-validated against pinned A2UI v1.0 schemas; sample component bodies accepted, broken ones rejected
PASS  Exporter-generated one-component catalog (ProgressIndicator): ProgressIndicator(label, value, max, tone, showValue)
PASS    re-validated against pinned A2UI v1.0 schemas; sample component bodies accepted, broken ones rejected
KNOWN exporter finding: additionalProperties:false rejects the envelope "id" in extension, progress-indicator (wire-level validation of { id, component, ... }). Not patched here; see docs/EXPORTER_FINDINGS.md and scripts/repro-envelope-id.mjs.
PASS  pre-generated snapshots in catalog-snapshots/ match the fresh output
```

## `npm run test:e2e` (22 passed)

| Spec | Test |
| --- | --- |
| interactions | Button click is logged in the native Storybook Actions panel (`onAction: ["save_budget", {surfaceId, sourceComponentId, …}]`) |
| interactions | Event context resolves a data-model binding at click time (typed note appears in `context.note`) |
| interactions | Controls change the SDK preview (label text, `variant: borderless`); `message` / `onAction` are not exposed |
| interactions | ×8: Text, Slider, TextField, CheckBox, ChoicePicker, DateTimeInput, Row, Column expose user-level controls only |
| interactions | Slider writes its value to the SDK data model (400 → 500 with keyboard) |
| interactions | TextField, CheckBox, ChoicePicker update their bindings |
| interactions | TextField `checks` with the official `required` function shows and clears its message |
| composition | Budget at 1920×1080 and 1280×800: equal summary tiles, no horizontal scroll, category → transactions, edit amounts → coverage result, Actions log, JSON toggle |
| composition | Official catalog explorer: filter, property table, Official JSON, Copy |
| composition | Exporter page: one-component command, extension tab, report (`unmappedEvents: fail`, 3 exported), official tab labeled SDK-authored |
| composition | Source primitive docs page shows the exported schema |
| composition | Welcome and docs pages render (presentation screenshots) |
| composition | In-preview links navigate the manager: Welcome → explorer → "Live SDK preview" → Slider docs |
| smoke | Every story and docs page renders without errors |

## Screenshots

- `docs/screenshots/before/`: the original project (generic `message`/`onAction` controls, action log under the
  preview, budget hugging the left edge, horizontally scrolling schema JSON).
- `docs/screenshots/after/`: generated by `npm run screenshots`. Numbered presentation shots, plus `stories/`, which has
  one full-page capture of every Basic Catalog story.
