# EDIS Storybook: 90-second walkthrough

The **public** Storybook route is Start Here → Basic Catalog → Composed Example. The exporter is a separate CLI demonstration, not a sidebar section.

## Before presenting

```powershell
npm ci
npm run demo:export    # static Storybook build, official SDK catalog and exporter output
npm run storybook      # leave the Storybook browser open at http://localhost:6006
```

Keep a second PowerShell terminal in the project directory. You do **not** need the exporter during the Storybook portion.

## What to show

| Stop | Open | What to say |
| --- | --- | --- |
| 1 | **Start Here → Welcome** | "These are official A2UI SDK components, documented and previewed in Storybook. We didn't write their implementations." |
| 2 | **Start Here → Official Basic Catalog** → select Slider → **Official JSON** | "This catalog lists the components and properties an agent is allowed to use." |
| 3 | **Basic Catalog → Interactive → Button** → click → **Actions** tab | "The UI sends a structured event with an event name and context. An agent can use it to decide the next interface." |
| 4 | **Basic Catalog → Interactive → Slider** → drag | "The control is bound to a data model; changing it updates the SDK's model." |
| 5 | **Composed Example → November Budget** → click a category, then Edit amounts | "This screen isn't one special budget component; it's made from those same basic building blocks." |
| 6 | **Show createSurface JSON** | "This is the JSON the SDK is using to render the dashboard." |

The budget sample runs **deterministic example logic**, not a live LLM. A real agent produces similar A2UI messages in the separate showcase app.

## What the SDK terms mean

- `@a2ui/web_core`: official Basic Catalog, message processing, and underlying web components.
- `@a2ui/react`: React integration that displays the processed surface.
- `Rendered by the official A2UI SDK`: a genuine SDK widget, not a visual imitation.
- `createSurface`: JSON instructions describing UI component instances and their relationships.

## Optional exporter CLI demo

The official Basic Catalog **does not come from our exporter**. Our exporter handles additional React source components documented in Storybook. Its source stories are hidden from the sidebar but still included in the Storybook build manifest.

In the second PowerShell terminal, with `npm run demo:export` already completed:

```powershell
npm run catalog:export:one
npm run catalog:show -- ProgressIndicator
npm run catalog:show -- --extension
```

The first command performs a real strict-mode export of one React primitive. The second shows its generated schema; the third shows the pre-generated or fresh three-component extension catalog.

**What to say:** "Storybook builds metadata describing a React component's props. Our exporter reads that manifest and generates an A2UI catalog definition, so agents can be told what additional components exist."

**Known limitations:** Exported components aren't registered in this Storybook's A2UI renderer. The current exporter also has a reproduced full-message envelope `id` validation issue even when catalog schema validation passes; see `docs/EXPORTER_FINDINGS.md`. Do not claim that generated extension components are already renderable.

If the CLI fails during a live presentation, stay in the working Storybook and show the saved JSON using `npm run catalog:show -- --extension`. It labels pre-generated snapshots.
