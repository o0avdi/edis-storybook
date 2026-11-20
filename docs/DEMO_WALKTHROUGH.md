# Two-minute walkthrough

## Before the demo (5 minutes earlier)

```powershell
npm ci                      # once
npm run demo:export         # prebuilds storybook-static and all catalogs; ends with PASS lines
npm run storybook           # terminal 1, leave running → http://localhost:6006
```

Open a second PowerShell terminal in the project folder for the live command. Browser zoom 100–125% on a 1920×1080
projector. Hide the addon panel with `Alt+A` on pages that have no controls.

## Script

| Time | Click | Say |
| --- | --- | --- |
| 0:00 | **Start Here / Official Basic Catalog** → type `slider` → *Official JSON* | “This is the vocabulary the agent is allowed to use. It ships with the A2UI SDK: 18 components, 14 functions. We didn’t write or generate this schema.” |
| 0:20 | *Live SDK preview →* (opens **Slider** docs), drag the slider | “These are the SDK’s own components, rendered from a small A2UI message. The panel underneath is the SDK data model; the binding is two-way.” |
| 0:35 | **Basic Catalog / Interactive / Button**, click *Save budget*, open **Actions** | “A button carries an agent event. Storybook’s Actions panel shows exactly what the agent would receive: event name, surface, source component, context.” |
| 0:50 | **Composed Example / November Budget**, click *Dining out*, then *Show emergency fund* → *Edit amounts* → change a value → *Check coverage* | “This dashboard isn’t a React component. It’s one `createSurface` message built only from those primitives. Each click sends an event, and deterministic sample logic answers with a new message, standing in for the agent. It’s not a live model call.” |
| 1:10 | *Show createSurface JSON* | “Here is the exact message the renderer received: Text, Row, Card, Button, Column.” |
| 1:25 | **Exporter / Source Primitives / ProgressIndicator** | “For a *new* company-specific primitive, we write a normal React component. Storybook documents its props.” |
| 1:35 | Terminal 2: `npm run catalog:export:one`, then `npm run catalog:show -- ProgressIndicator` | “Our exporter reads Storybook’s manifest, runs strictly, validates against the official A2UI v1.0 schemas, and writes an *additional* catalog. Events, children and objects are blocked, never guessed.” |
| 1:50 | **Exporter / Generated Catalogs** → tabs 2–4 | “Three exported primitives, the report, and, kept separate, the official Basic Catalog. We never re-export the SDK’s catalog.” |

Close: “Storybook describes components. A2UI tells an agent which components it may compose and how. Our exporter
bridges new source components into that vocabulary. It generates a schema, not the finished UI.”

## Fallbacks

- **No network or a failed build:** `npm run catalog:show -- --extension` falls back to the committed
  `catalog-snapshots/` and labels the output `[PRE-GENERATED SNAPSHOT]`. The Storybook exporter pages always use
  those snapshots.
- **“Output directory is not empty”:** the raw CLI needs a new or empty `--out`. Use `npm run catalog:export:one`, which
  clears its own folder, or `Remove-Item -Recurse -Force a2ui-catalog/live` first.
- **Manifest missing:** run `npm run build-storybook`. The dev server does not write `storybook-static`.

## Honesty checklist

- Official Basic Catalog JSON = SDK-authored. Exporter JSON = generated from Storybook metadata for our primitives.
- The budget is sample logic, not inference.
- The exported primitives are not registered with the renderer; the demo stops at a validated schema.
- Known exporter finding (envelope `id` vs `additionalProperties: false`): `docs/EXPORTER_FINDINGS.md`.
