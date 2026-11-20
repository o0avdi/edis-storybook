# Frozen exporter examples (EDIS showcase)

These are the two exported catalog files we open during the presentation. They are **real output** from our
Storybook-to-A2UI exporter (`storybook-a2ui`, commit `142dd7b`), copied unchanged from a successful strict export.
They are committed and **frozen**: no npm script writes to this folder, and the live demo (`npm run export:demo`) writes
to `demo-output/run-NNN/` instead.

| File | Contains | Exporter command that produced it |
| --- | --- | --- |
| `01-single-component/catalog.json` | `ProgressIndicator` only | `npx storybook-a2ui export --storybook storybook-static --components ProgressIndicator --catalog-id https://o0avdi.github.io/edis-storybook/catalogs/progress-indicator/v1 --out <folder>` |
| `02-full-exported-catalog/catalog.json` | `StatusBadge`, `MetricLabel`, `ProgressIndicator` | `npx storybook-a2ui export --storybook storybook-static --components StatusBadge,MetricLabel,ProgressIndicator --catalog-id https://o0avdi.github.io/edis-storybook/catalogs/extension/v1 --title "Storybook Primitive Extension" --out <folder>` |

Both exports ran with the exporter's strict default policy and passed its validation against the official A2UI v1.0
schemas. The files are byte-identical to the verified snapshots in `catalog-snapshots/`, and example 1 is
byte-identical to what `npm run export:demo` produces today.

## How these differ from the official Basic Catalog

- **These files:** catalog definitions **our exporter generated** from Storybook metadata for three small React
  components our team wrote (`src/extensions/`).
- **The official A2UI Basic Catalog** (18 components such as Text, Card, Row, Button, Slider): written by the A2UI SDK
  team and shipped in `@a2ui/web_core`. **Our exporter did not generate it.** Browse it in Storybook under
  *Start Here / Official Basic Catalog*.

These exported components are **not** yet wired into an A2UI renderer, so an agent cannot display them today. The
files show the catalog definition the exporter produces. One known issue with the generated schemas
(`additionalProperties: false` rejects the wire-level `id`) is documented in `docs/EXPORTER_FINDINGS.md`.

## Commands

```bash
npm run examples:verify      # read-only: checks both files are unchanged (SHA-256) and still valid
npm run examples:show        # list both examples
npm run examples:show -- 1   # print example 1 (or 2)
```

If `examples:verify` ever fails, restore the originals with `git checkout -- demo-examples`.
