# Demo walkthrough

The EDIS presenter script now lives in [`EDIS_QUICK_GUIDE.md`](EDIS_QUICK_GUIDE.md): what to say, the click path, the
live exporter command (`npm run export:demo`), the frozen example files and likely visitor questions.

Setup on any machine: README, section **Running the EDIS Demo on macOS** (the same commands work on Windows).

## Fallbacks

- **Live export fails or no network:** open the frozen files in `demo-examples/`. They do not depend on the exporter
  running. `npm run examples:show -- 1` prints one in the terminal.
- **"No Storybook build found":** run `npm run build-storybook` once (about a minute), then `npm run export:demo` again.
  The dev server (`npm run storybook`) does not create the static build.
- **Exporter Storybook pages:** hidden from the sidebar, but still available by URL, for example
  `http://localhost:6006/?path=/docs/exporter-source-primitives-progressindicator--docs`.

## Honesty checklist

- Official Basic Catalog JSON = SDK-authored. Exporter JSON = generated from Storybook metadata for our three primitives.
- The budget is deterministic sample logic, not a live model call.
- The exported primitives are not registered with a renderer; the demo stops at a validated catalog definition.
- Known exporter finding (envelope `id` vs `additionalProperties: false`): `EXPORTER_FINDINGS.md`.
